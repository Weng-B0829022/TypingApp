import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import BouncingBallsBackground from './BouncingBallsBackground'; // 確保路徑正確

const BasicInfo = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [researchCode, setResearchCode] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name && researchCode) {
      onComplete({ name, researchCode });
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <BouncingBallsBackground ballCount={15} />
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm">
          <Box
            sx={{
              width: '100%',
              maxWidth: 300,
              padding: '16px',
              border: '1px solid #26A69A',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)', // 半透明白色背景
              margin: 'auto', // 居中顯示
            }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              開始測驗
            </Typography>
            <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                label="請輸入姓名"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                variant="outlined"
                label="請輸入研究代號"
                fullWidth
                value={researchCode}
                onChange={(e) => setResearchCode(e.target.value)}
                required
              />
              <Button variant="contained" color="primary" fullWidth type="submit">
                開始測驗
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default BasicInfo;