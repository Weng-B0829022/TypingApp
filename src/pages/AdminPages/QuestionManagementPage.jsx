import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';

const QuestionManagementPage = () => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        題目管理
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" sx={{ mr: 2 }}>
          新增題目
        </Button>
        <Button variant="contained" color="secondary">
          刪除題目
        </Button>
      </Box>
    </Paper>
  );
};

export default QuestionManagementPage;