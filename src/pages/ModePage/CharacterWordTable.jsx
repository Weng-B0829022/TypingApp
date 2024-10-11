import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Typography, Box, Checkbox, Chip, TextField, InputAdornment, CircularProgress, Snackbar, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MuiAlert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const cellStyle = {
    padding: '6px 8px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

const CharacterWordTable = ({ grade, level, number, onSelectQuestions, questionFormat }) => {
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
    }, [data, grade, level, searchTerm]);

    const handleSelect = useCallback((item) => {
        setSelectedItems(prev => {
            const isSelected = prev.some(selected => selected.id === item.id);
            let newItems;
            if (isSelected) {
                setError('');
                // Clear selected variant for this item
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
                    // Auto-select the first variant
                    const firstVariant = item.variants && item.variants.length > 0 ? item.variants[0] : null;
                    setSelectedVariants(prevVariants => ({
                        ...prevVariants,
                        [item.id]: 0
                    }));
                    newItems = [...prev, { 
                        ...item, 
                        order: prev.length + 1,
                        selectedVariantImage: firstVariant ? firstVariant.image : null,
                        isCorrectVariant: true  // Mark as correct because it's the first variant
                    }];
                } else {
                    setError(`您只能選擇 ${number} 個題目。`);
                    setSnackbarOpen(true);
                    return prev;
                }
            }
            return newItems;
        });
    }, [number, setError, setSnackbarOpen]);

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
            
            if (!isItemSelected) {
                newItems.push({ 
                    ...item, 
                    order: newItems.length + 1,
                    selectedVariantImage: selectedVariant.image,
                    isCorrectVariant: variantIndex === 0  // Only correct if it's the first variant
                });
            } else {
                newItems = newItems.map(selected => 
                    selected.id === item.id 
                        ? { 
                            ...selected, 
                            selectedVariantImage: selectedVariant.image,
                            isCorrectVariant: variantIndex === 0  // Update correctness based on variant index
                        }
                        : selected
                );
            }
            
            setSelectedVariants(prev => ({
                ...prev,
                [item.id]: variantIndex
            }));
            
            setError('');
            return newItems;
        });
    }, [number, setError, setSnackbarOpen]);

    const renderVariantImages = useCallback((variants, item) => {
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {variants.map((variant, index) => (
                    <Box 
                        key={index} 
                        sx={{ 
                            position: 'relative', 
                            width: '48px', 
                            height: '48px'
                        }}
                    >
                        <img 
                            src={`data:image/png;base64,${variant.image}`}
                            alt={variant.file_path}
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'contain', 
                                cursor: 'pointer',
                                opacity: selectedVariants[item.id] === index ? 0.8 : 1
                            }}
                            onClick={() => handleVariantSelect(item, index)}
                        />
                        {selectedVariants[item.id] === index && (
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
                ))}
            </Box>
        );
    }, [selectedVariants, handleVariantSelect]);

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
                        avatar={item.selectedVariantImage ? 
                            <Avatar src={`data:image/png;base64,${item.selectedVariantImage}`} /> : 
                            undefined
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
    