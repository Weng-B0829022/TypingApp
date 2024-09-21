import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Typography, Box, Checkbox, Chip, Alert, TextField, InputAdornment, CircularProgress, Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MuiAlert from '@mui/material/Alert';


const CharacterWordTable = ({ grade, level, number }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const fetchCharacters = useApi('api/characters-with-variants');

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
            if (isSelected) {
                setError('');
                return prev.filter(selected => selected.id !== item.id)
                            .map((selected, index) => ({
                                ...selected,
                                order: index + 1
                            }));
            } else {
                if (prev.length < number) {
                    setError('');
                    return [...prev, { ...item, order: prev.length + 1 }];
                } else {
                    setError(`您只能選擇 ${number} 個題目。`);
                    setSnackbarOpen(true);
                    return prev;
                }
            }
        });
    }, [number]);
    
    const renderVariantImages = useCallback((variants) => {
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {variants.slice(0, 5).map((variant, index) => (
                    <img 
                        key={index}
                        src={`data:image/png;base64,${variant.image}`}
                        alt={variant.file_path}
                        style={{ width: '64px', height: '64px', objectFit: 'contain' }}
                        loading="lazy"
                    />
                ))}
            </Box>
        );
    }, []);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom component="div" sx={{ padding: '16px' }}>
                字詞表格 (年級: {grade}, 難度: {level}, 需選擇: {number})
            </Typography>
            
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, ml: 2 }}>
                {selectedItems.map((item) => (
                    <Chip
                        key={item.id}
                        label={`${item.order}. ${item.character} - ${item.word}`}
                        onDelete={() => handleSelect(item)}
                        color="primary"
                        variant="outlined"
                    />
                ))}
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="搜尋字或詞"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selectedItems.length > 0 && selectedItems.length < Math.min(filteredData.length, number)}
                                    checked={selectedItems.length === Math.min(filteredData.length, number)}
                                    onChange={() => {
                                        if (selectedItems.length === number) {
                                            setSelectedItems([]);
                                        } else {
                                            setSelectedItems(filteredData.slice(0, number).map((item, index) => ({
                                                ...item,
                                                order: index + 1
                                            })));
                                        }
                                    }}
                                    disabled={selectedItems.length === number}
                                />
                            </TableCell>
                            <TableCell>字</TableCell>
                            <TableCell>詞語</TableCell>
                            <TableCell>變種</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ overflow: 'auto' }}>
                        {filteredData.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedItems.some(item => item.id === row.id)}
                                        onChange={() => handleSelect(row)}
                                        disabled={selectedItems.length === number && !selectedItems.some(item => item.id === row.id)}
                                    />
                                </TableCell>
                                <TableCell>{row.character}</TableCell>
                                <TableCell>{row.word}</TableCell>
                                <TableCell>{renderVariantImages(row.variants)}</TableCell>
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
    