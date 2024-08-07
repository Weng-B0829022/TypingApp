import React, { useState } from 'react';
import { Container, Typography, Box, Button, Grid, Accordion, AccordionSummary, AccordionDetails, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ModePage = ({ onComplete }) => {
  const theme = useTheme();
  const [selected, setSelected] = useState({
    grade: '一年級',
    level: '簡單',
    number: '1',
    mode: '立即回饋',
    startCountdown: 1 , // 新增倒數計時秒數的預設值
    queIntervel: 0.1 // 題目間隔的等待時間
  });

  const [errors, setErrors] = useState({});

  const handleButtonClick = (category, value) => {
    setSelected((prevState) => ({
      ...prevState,
      [category]: value,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelected((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStartTest = () => {
    const newErrors = {};
    if (!selected.grade) newErrors.grade = true;
    if (!selected.level) newErrors.level = true;
    if (!selected.number) newErrors.number = true;
    if (!selected.mode) newErrors.mode = true;
    if (!selected.startCountdown) newErrors.startCountdown = true;
    if (!selected.queIntervel) newErrors.queIntervel = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      onComplete(selected); // 確保傳遞所有選擇，包括倒數計時秒數和題目間隔時間
    }
  };

  const boxStyle = {
    width: '100%', 
    mb: 2, 
    backgroundColor: '#E0E0E0', 
    padding: 2, 
    borderRadius: 2,
    border: 'none',  // 添加這行來去除邊框
    boxShadow: 'none'  // 添加這行來去除陰影
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
        padding: '20px',
      }}
    >
      <Box sx={boxStyle}>
        <Typography variant="h6" align="center" gutterBottom>
          字庫 {errors.grade && <span style={{ color: 'red' , fontSize:'0.7em'}}>(必選)</span>}
        </Typography>
        <Grid container spacing={1}>
          {['一年級', '二年級', '三年級', '四年級', '五年級', '六年級'].map((grade) => (
            <Grid item xs={4} key={grade}>
              <Button
                variant="contained"
                color={selected.grade === grade ? 'primary' : 'white'}
                fullWidth
                onClick={() => handleButtonClick('grade', grade)}
                style={{ color: selected.grade === grade ? 'white' : 'black' }}
                sx={{
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                {grade}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={boxStyle}>
        <Typography variant="h6" align="center" gutterBottom>
          難易度 {errors.level && <span style={{ color: 'red' , fontSize:'0.7em'}}>(必選)</span>}
        </Typography>
        <Grid container spacing={1}>
          {['簡單', '中等', '困難'].map((level) => (
            <Grid item xs={4} key={level}>
              <Button
                variant="contained"
                color={selected.level === level ? 'primary' : 'white'}
                fullWidth
                onClick={() => handleButtonClick('level', level)}
                style={{ color: selected.level === level ? 'white' : 'black' }}
                sx={{
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                {level}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={boxStyle}>
        <Typography variant="h6" align="center" gutterBottom>
          題目數 {errors.number && <span style={{ color: 'red' , fontSize:'0.7em'}}>(必選)</span>}
        </Typography>
        <Grid container spacing={1}>
          {['1', '5', '10'].map((number) => (
            <Grid item xs={4} key={number}>
              <Button
                variant="contained"
                color={selected.number === number ? 'primary' : 'white'}
                fullWidth
                onClick={() => handleButtonClick('number', number)}
                style={{ color: selected.number === number ? 'white' : 'black' }}
                sx={{
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                {number}題
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={boxStyle}>
        <Typography variant="h6" align="center" gutterBottom>
          回饋模式 {errors.mode && <span style={{ color: 'red' , fontSize:'0.7em'}}>(必選)</span>}
        </Typography>
        <Grid container spacing={1}>
          {['立即回饋', '答題後回饋'].map((mode) => (
            <Grid item xs={6} key={mode}>
              <Button
                variant="contained"
                color={selected.mode === mode ? 'primary' : 'white'}
                fullWidth
                onClick={() => handleButtonClick('mode', mode)}
                style={{ color: selected.mode === mode ? 'white' : 'black' }}
                sx={{
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                {mode}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={boxStyle}>
        <Typography variant="h6" align="center" gutterBottom>
          詳細設置
        </Typography>
        <Accordion 
          sx={{ 
            backgroundColor: 'transparent',
            boxShadow: 'none',
            '&:before': {
              display: 'none',
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>點擊展開更多設置</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              backgroundColor: '#F5F5F5',
              borderRadius: 2,
              mt: 1,
            }}
          >
            <Typography>
              開始時準備時間 {errors.startCountdown && <span style={{ color: 'red' , fontSize:'0.7em'}}>(必選)</span>}
            </Typography>
            <TextField
              fullWidth
              type="number"
              name="startCountdown"
              value={selected.startCountdown}
              onChange={handleInputChange}
              placeholder="輸入秒數"
              sx={{ 
                mt: 1,
                width: '50%',   // 調整寬度
                '& .MuiInputBase-root': {
                  height: '30px', // 調整高度
                },
                '& .MuiInputBase-input': {
                  padding: '5px 10px', // 調整內部填充
                }
              }}
            />
            <Typography>
              題目顯示後的等待時間 {errors.queIntervel && <span style={{ color: 'red' , fontSize:'0.7em'}}>(必選)</span>}
            </Typography>
            <TextField
              fullWidth
              type="number"
              name="queIntervel"
              value={selected.queIntervel}
              onChange={handleInputChange}
              placeholder="輸入秒數"
              sx={{ 
                mt: 1,
                width: '50%',   // 調整寬度
                '& .MuiInputBase-root': {
                  height: '30px', // 調整高度
                },
                '& .MuiInputBase-input': {
                  padding: '5px 10px', // 調整內部填充
                }
              }}
            />
          </AccordionDetails>
        </Accordion>
      </Box>

      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        onClick={handleStartTest}
        sx={{ mt: 2 }}
      >
        開始測驗
      </Button>
    </Container>
  );
};

export default ModePage;
