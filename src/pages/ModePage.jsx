import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const primary = '#26A69A';

const ModePage = () => {
  const theme = useTheme();
  const [selected, setSelected] = useState({
    grade: null,
    level: null,
    number: null,
    mode: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  const handleButtonClick = (category, value) => {
    setSelected((prevState) => ({
      ...prevState,
      [category]: value,
    }));
  };

  const handleStartTest = () => {
    const newErrors = {};
    if (!selected.grade) newErrors.grade = true;
    if (!selected.level) newErrors.level = true;
    if (!selected.number) newErrors.number = true;
    if (!selected.mode) newErrors.mode = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      console.log(selected);
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box sx={{ width: '100%', mb: 4, backgroundColor: '#E0E0E0', padding: 2, borderRadius: 2 }}>
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
      <Box sx={{ width: '100%', mb: 4, backgroundColor: '#E0E0E0', padding: 2, borderRadius: 2 }}>
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
      <Box sx={{ width: '100%', mb: 4, backgroundColor: '#E0E0E0', padding: 2, borderRadius: 2 }}>
        <Typography variant="h6" align="center" gutterBottom>
          題目數 {errors.number && <span style={{ color: 'red' , fontSize:'0.7em'}}>(必選)</span>}
        </Typography>
        <Grid container spacing={1}>
          {['1題', '5題', '10題'].map((number) => (
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
                {number}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ width: '100%', mb: 4, backgroundColor: '#E0E0E0', padding: 2, borderRadius: 2 }}>
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
      <Button variant="contained" color="primary" fullWidth onClick={handleStartTest}>
        開始測驗
      </Button>
    </Container>
  );
};

export default ModePage;
