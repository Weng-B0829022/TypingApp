import React from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const BasicInfo = () => {
  return (
    <Container maxWidth="sm" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 360,
          padding: '16px',
          border: '1px solid #26A69A',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h6" align="center" gutterBottom>
          開始測驗
        </Typography>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            variant="outlined"
            label="請輸入姓名"
            fullWidth
          />
          <TextField
            variant="outlined"
            label="請輸入研究代號"
            fullWidth
          />
          <Button variant="contained" color="primary" fullWidth>
            開始測驗
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default BasicInfo;
