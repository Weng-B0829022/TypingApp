import React from 'react';
import { TableRow, TableCell, Box, Typography, Button } from '@mui/material';

const DeleteConfirmationRow = ({ index, onConfirm, onCancel }) => {
  return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 1 }}>
            <Typography 
                variant="body2"
                sx={{ alignSelf: 'center' }}
                >確定要刪除嗎？
            </Typography>
            <Button 
                variant="contained" 
                color="error" 
                size="small"
                onClick={() => onConfirm(index)}
            >
                確認
            </Button>
            <Button 
                variant="outlined" 
                size="small"
                onClick={onCancel}
            >
                取消
            </Button>
        </Box>
  );
};

export default DeleteConfirmationRow;