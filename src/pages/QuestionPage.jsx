import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';

const questions = [
    { text: '相同', tar: '同' , ans:'正確'},
    { text: '你好', tar: '尔' , ans:'錯誤   '},
    { text: '微風', tar: '微' , ans:'正確'},
    { text: '月亮', tar: '月' , ans:'正確'},
    { text: '火車', tar: '人' , ans:'錯誤'},
  ];
  
  const App = () => {
    const [step, setStep] = useState(0);
    const [countdown, setCountdown] = useState(3);
    const [questionIndex, setQuestionIndex] = useState(0);
  
    useEffect(() => {
      if (step === 0) {
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(timer);
              setStep(1);
              return prev;
            }
            return prev - 1;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
  
      if (step === 1) {
        const timer = setTimeout(() => {
          setStep(2);
        }, 1000);
  
        return () => clearTimeout(timer);
      }
    }, [step]);
  
    const handleNextQuestion = () => {
      if (questionIndex < questions.length - 1) {
        setStep(1);
        setQuestionIndex(questionIndex + 1);
      } else {
        // 如果已經到最後一題，重置為第一題或執行其他邏輯
        console.log('測驗完成');
        setQuestionIndex(0); // 或其他邏輯
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
            backgroundColor: '#E0E0E0',
          }}
        >
          {step === 0 ? (
            <Box
              sx={{
                width: '100%',
                backgroundColor: '#E0E0E0',
                padding: 2,
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4">倒數 {countdown}</Typography>
            </Box>
          ) : step === 1 ? (
            <Box
              sx={{
                width: '100%',
                backgroundColor: '#E0E0E0',
                padding: 2,
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4">{questions[questionIndex].text}</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                width: '100%',
                backgroundColor: '#E0E0E0',
                padding: 2,
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h4">{questions[questionIndex].tar}</Typography>
              <Grid container spacing={2} justifyContent="center" mt={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleNextQuestion}
                    style={{ color: 'white' }}
                  >
                    錯誤
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNextQuestion}
                  >
                    正確
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </Container>
    );
  };
  

export default App;
