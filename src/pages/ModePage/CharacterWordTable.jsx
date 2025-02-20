import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Typography, Box, Checkbox, Chip, TextField, InputAdornment, CircularProgress, Snackbar, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MuiAlert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import sameSound from '../../utils/sameSound';

const textToBase64Image = (text) => {
    const canvas = document.createElement('canvas');
    canvas.width = 60;  // 設置畫布大小
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    
    // 設置背景為淺明色 (#F5F5F5)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 設置文字樣式
    ctx.fillStyle = 'black';
    ctx.font = '60px "標楷體"';  // 使用標楷體
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 繪製文字
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // 轉換為 base64
    return canvas.toDataURL('image/png').split(',')[1];
};

const cellStyle = {
    padding: '6px 8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const CharacterWordTable = ({ grade, level, number, onSelectQuestions, questionFormat, characterType }) => {
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [selectedVariants, setSelectedVariants] = useState({});
    const [selectedItems, setSelectedItems] = useState([]);
    const fetchCharacters = useApi('api/characters-with-variants');
    useEffect(()=>{
        setSelectedVariants([])
        setSelectedItems([])
    }, [questionFormat])

    useEffect(() => {
        setIsLoading(true);
        fetchCharacters()
            .then(result => {
                setData(result);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setSnackbarOpen(true);
                setIsLoading(false);
            });
    }, []);

    const previousSelectedItemsRef = useRef();
    useEffect(() => {
        if (JSON.stringify(selectedItems) !== JSON.stringify(previousSelectedItemsRef.current)) {
            onSelectQuestions(selectedItems);
            previousSelectedItemsRef.current = selectedItems;
        }
    }, [selectedItems, onSelectQuestions]);

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];
    
        const gradeNumber = {
            '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6
        }[grade];
    
        let filtered = gradeNumber ? data.filter(item => item.grade === gradeNumber) : data;
    
        if (characterType === '同音字') {
            filtered = filtered.filter(item => 
                item.variants && 
                item.variants.length > 0 && 
                sameSound[item.character] && 
                sameSound[item.character].length > 0
            );
            
            filtered = filtered.map(item => ({
                ...item,
                variants: [
                    {
                        image: item.variants[0]?.image || '',
                        file_path: item.variants[0]?.file_path || '',
                        character: item.character
                    },
                    ...(sameSound[item.character] || []).map(char => ({
                        image: '',
                        file_path: `same_sound_${char}`,
                        character: char
                    }))
                ]
            }));
        }
    
        if (searchTerm) {
            filtered = filtered.filter(item => 
                item.character.includes(searchTerm) || 
                item.word.includes(searchTerm)
            );
        }
    
        if (filtered.length === 0) return [];
    
        if (!level) return filtered;
    
        const sortedFrequencies = filtered.map(item => item.word_frequency).sort((a, b) => b - a);
        const maxFrequency = sortedFrequencies[0];
        const easyThreshold = maxFrequency * 2 / 3;
        const mediumThreshold = maxFrequency / 3;
    
        return filtered.filter(item => {
            if (level === '簡單') {
                return item.word_frequency >= easyThreshold;
            } else if (level === '中等') {
                return item.word_frequency < easyThreshold && item.word_frequency >= mediumThreshold;
            } else {
                return item.word_frequency < mediumThreshold;
            }
        });
    }, [data, grade, level, searchTerm, characterType]);

    const handleSelect = useCallback((item) => {
        setSelectedItems(prev => {
            const isSelected = prev.some(selected => selected.id === item.id);
            let newItems;
            if (isSelected) {
                setError('');
                // 清除該項目的已選變體
                setSelectedVariants(prevVariants => {
                    const newVariants = { ...prevVariants };
                    delete newVariants[item.id];
                    return newVariants;
                });
                newItems = prev.filter(selected => selected.id !== item.id)
                    .map((selected, index) => ({
                        ...selected,
                        order: index + 1
                    }));
            } else {
                if (prev.length < number) {
                    setError('');
                    // 對於二選一選擇題，自動選擇前兩個變體
                    if (questionFormat === '二選一選擇題') {
                        setSelectedVariants(prevVariants => ({
                            ...prevVariants,
                            [item.id]: [0, 1]
                        }));
                        newItems = [...prev, { 
                            ...item, 
                            order: prev.length + 1,
                            selectedVariantImage: [item.variants[0].image, item.variants[1].image],
                            isCorrectVariant: false
                        }];
                    } else {
                        // 對於其他格式，選擇第一個變體
                        setSelectedVariants(prevVariants => ({
                            ...prevVariants,
                            [item.id]: 0
                        }));
                        newItems = [...prev, { 
                            ...item, 
                            order: prev.length + 1,
                            selectedVariantImage: item.variants[0].image,
                            isCorrectVariant: true
                        }];
                    }
                } else {
                    setError(`您只能選擇 ${number} 個題目。`);
                    setSnackbarOpen(true);
                    return prev;
                }
            }
            return newItems;
        });
    }, [number, setError, setSnackbarOpen, questionFormat]);

    

    const handleVariantSelect = useCallback((item, variantIndex) => {
        setSelectedItems(prevItems => {
            const isItemSelected = prevItems.some(selected => selected.id === item.id);
            
            if (!isItemSelected && prevItems.length >= number) {
                setError(`您只能選擇 ${number} 個題目。`);
                setSnackbarOpen(true);
                return prevItems;
            }
            
            let newItems = [...prevItems];
            const selectedVariant = item.variants[variantIndex];
            const selectedChar = selectedVariant.character;
            const generatedImage = selectedChar ? textToBase64Image(selectedChar) : selectedVariant.image;
            
            if (!isItemSelected) {
                newItems.push({ 
                    ...item, 
                    order: newItems.length + 1,
                    selectedVariantImage: questionFormat === '二選一選擇題' 
                        ? [
                            textToBase64Image(item.variants[0].character),
                            textToBase64Image(selectedVariant.character)
                          ]
                        : generatedImage,
                    isCorrectVariant: questionFormat !== '二選一選擇題' && variantIndex === 0,
                    selectedCharacter: selectedChar
                });
            } else {
                newItems = newItems.map(selected => 
                    selected.id === item.id 
                        ? { 
                            ...selected, 
                            selectedVariantImage: questionFormat === '二選一選擇題'
                                ? [
                                    textToBase64Image(item.variants[0].character),
                                    textToBase64Image(selectedVariant.character)
                                  ]
                                : generatedImage,
                            isCorrectVariant: questionFormat !== '二選一選擇題' && variantIndex === 0,
                            selectedCharacter: selectedChar
                        }
                        : selected
                );
            }
            
            if (questionFormat === '二選一選擇題' && variantIndex > 0) {
                setSelectedVariants(prev => ({
                    ...prev,
                    [item.id]: [0, variantIndex]
                }));
            } else if (questionFormat !== '二選一選擇題') {
                setSelectedVariants(prev => ({
                    ...prev,
                    [item.id]: variantIndex
                }));
            }
            
            setError('');
            return newItems;
        });
    }, [number, setError, setSnackbarOpen, questionFormat]);

    const renderVariantImages = useCallback((variants, item) => {
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {variants.map((variant, index) => {
                    // 判斷該變體是否可選
                    const isSelectable = questionFormat !== '二選一選擇題' || index > 0;
                    // 判斷該變體是否被選中
                    const isSelected = Array.isArray(selectedVariants[item.id])
                        ? selectedVariants[item.id].includes(index)
                        : selectedVariants[item.id] === index;
                    
                    return (
                        <Box 
                            key={index} 
                            sx={{ 
                                position: 'relative', 
                                width: '48px', 
                                height: '48px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.1)' : 'white',
                                cursor: isSelectable ? 'pointer' : 'default',
                                opacity: isSelected ? 0.8 : 1
                            }}
                            onClick={() => isSelectable && handleVariantSelect(item, index)}
                        >
                            {variant.character ? (
                                // 如果是同音字，直接顯示文字
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        // Start of Selection
                                        fontSize: '3rem',
                                        fontFamily: '"標楷體", sans-serif',
                                        color: isSelected ? 'primary.main' : 'text.primary'
                                    }}
                                >
                                    {variant.character}
                                </Typography>
                            ) : (
                                // 如果有圖片，顯示圖片
                                <img 
                                    src={`data:image/png;base64,${variant.image}`}
                                    alt={variant.file_path}
                                    style={{ 
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            )}
                            {/* 顯示選中的標記 */}
                            {isSelected && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        borderRadius: '50%',
                                        padding: '2px',
                                    }}
                                >
                                    <CheckCircleIcon 
                                        sx={{
                                            fontSize: 20,
                                            color: 'primary.main',
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>
        );
    }, [selectedVariants, handleVariantSelect, questionFormat]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom component="div" sx={{ padding: '4px' }}>
                字詞表格 (年級: {grade}, 難度: {level}, 需選擇: {number})
            </Typography>
            
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Box 
                sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1, 
                    mb: 2, 
                    ml: 2, 
                    mr: 2,
                    height: '80px', // Fixed height
                    overflowY: 'auto', // Add vertical scroll if needed
                    border: '1px solid #e0e0e0', // Optional: adds a border for visual separation
                    borderRadius: '4px', // Optional: rounds the corners
                    padding: '8px',
                }}
            >
                {selectedItems.map((item) => (
                    <Chip
                        key={item.id}
                        avatar={questionFormat == '二選一選擇題' ? 
                            <Avatar src={`data:image/png;base64,${item.selectedVariantImage[1]}`} /> : 
                            <Avatar src={`data:image/png;base64,${item.selectedVariantImage}`} />
                        }
                        label={`${item.order}. ${item.character} - ${item.word}`}
                        onDelete={() => handleSelect(item)}
                        color="primary"
                        variant="outlined"
                        sx={{ 
                            margin: '2px',
                            '& .MuiChip-avatar': {
                                background:'transparent',
                                padding: '8px',
                                width: 24,
                                height: 24,
                            }
                        }}
                    />
                ))}
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="搜尋字或詞"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                    mb: 1,
                    mx: 2,
                    '& .MuiOutlinedInput-root': {
                        height: '40px', // Adjust this value to make the TextField lower
                    },
                    '& .MuiOutlinedInput-input': {
                        padding: '8px 14px', // Adjust padding to center the text vertically
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ fontSize: '1.2rem' }} /> {/* Optionally make the icon smaller */}
                        </InputAdornment>
                    ),
                }}
            />

            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{ ...cellStyle, width: '48px' }}>
                                <Checkbox
                                    // indeterminate={selectedItems.length > 0 && selectedItems.length < Math.min(filteredData.length, number)}
                                    // checked={selectedItems.length === Math.min(filteredData.length, number)}
                                    // onChange={() => {
                                    //     if (selectedItems.length === number) {
                                    //         setSelectedItems([]);
                                    //         setSelectedVariants({});
                                    //     } else {
                                    //         const newSelectedItems = filteredData.slice(0, number).map((item, index) => ({
                                    //             ...item,
                                    //             order: index + 1
                                    //         }));
                                    //         setSelectedItems(newSelectedItems);
                                    //         const newSelectedVariants = {};
                                    //         newSelectedItems.forEach(item => {
                                    //             newSelectedVariants[item.id] = 0; // Select first variant
                                    //         });
                                    //         setSelectedVariants(newSelectedVariants);
                                    //     }
                                    // }}
                                    disabled={true}
                                />
                            </TableCell>
                            <TableCell sx={{ ...cellStyle, width: '60px' }}>字</TableCell>
                            <TableCell sx={{ ...cellStyle, width: '100px' }}>詞語</TableCell>
                            <TableCell sx={{ ...cellStyle, width: '340px' }}>變種</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ overflow: 'auto' }}>
                        {filteredData.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell padding="checkbox" sx={{ ...cellStyle, width: '48px' }}>
                                    <Checkbox
                                        checked={selectedItems.some(item => item.id === row.id)}
                                        onChange={() => handleSelect(row)}
                                        disabled={selectedItems.length === number && !selectedItems.some(item => item.id === row.id)}
                                    />
                                </TableCell>
                                <TableCell sx={{ ...cellStyle, width: '60px' }}>{row.character}</TableCell>
                                <TableCell sx={{ ...cellStyle, width: '100px' }}>{row.word}</TableCell>
                                <TableCell sx={{ ...cellStyle, width: '340px' }}>{renderVariantImages(row.variants, row)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CharacterWordTable;

const useApi = (endpoint, options = {}) => {
        const {
        method = 'GET',
        body,
        headers: customHeaders,
        ...restOptions
        } = options;
    
        const fetchData = async () => {
        try {
            const headers = {
            'Content-Type': 'application/json',
            ...customHeaders
            };
    
            const fetchOptions = {
            method,
            headers,
            ...restOptions
            };
    
            if (body) {
            fetchOptions.body = JSON.stringify(body);
            }
    
            const response = await fetch(`http://localhost:5001/${endpoint}`, fetchOptions);
    
            if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
            }
    
            const text = await response.text();
            return text ? JSON.parse(text) : {};
        } catch (error) {
            console.error('API call error:', error);
            throw error;
        }
    };

    return fetchData;
};
    