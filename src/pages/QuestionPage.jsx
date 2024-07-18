import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import { CheckCircle, X } from 'lucide-react';

const questions = [
  { text: '相同', tar: '同', ans: '正確' },
  { text: '你好', tar: '尔', ans: '錯誤' },
  { text: '微風', tar: '微', ans: '正確' },
  { text: '月亮', tar: '月', ans: '正確' },
  { text: '火車', tar: '人', ans: '錯誤' },
  { text: '日本好玩', tar: '目', ans: '錯誤' },
];

const QuestionPage = ({ startCountdown, queIntervel, onComplete, isFeedbackImmediately }) => {
  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState(startCountdown);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const startTimeRef = useRef(null);
  const [isWaiting, setIsWaiting] = useState(false);

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
        startTimeRef.current = Date.now();
      }, queIntervel * 1000);

      return () => clearTimeout(timer);
    }
  }, [step, queIntervel]);

  const handleAnswer = (answer) => {
    if (isWaiting) return; // Prevent multiple answers during feedback display

    const endTime = Date.now();
    const reactionTime = startTimeRef.current ? endTime - startTimeRef.current : null;

    const newAnswers = [...answers, {
      question: questions[questionIndex].text,
      target: questions[questionIndex].tar,
      userAnswer: answer,
      correctAnswer: questions[questionIndex].ans,
      reactionTime: reactionTime
    }];
    setAnswers(newAnswers);

    if (isFeedbackImmediately) {
      setFeedback(answer === questions[questionIndex].ans ? 'correct' : 'incorrect');
      setIsWaiting(true);
      setTimeout(() => {
        setFeedback(null);
        setIsWaiting(false);
        moveToNextQuestion(newAnswers);
      }, 100);
    } else {
      moveToNextQuestion(newAnswers);
    }
  };

  const moveToNextQuestion = (newAnswers) => {
    if (questionIndex < questions.length - 1) {
      setStep(1);
      setQuestionIndex(questionIndex + 1);
      startTimeRef.current = null;
    } else {
      onComplete(newAnswers);
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        minWidth: 'min(100vw, 600px)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0E0E0',
        position: 'relative', // Add this for absolute positioning context
      }}
    >
      {feedback && (
        <Box
          sx={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
          }}
        >
          {feedback === 'correct' ? (
            <CheckCircle color="green" size={160} />
          ) : (
            <X color="red" size={160} />
          )}
        </Box>
      )}
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
                onClick={() => handleAnswer('錯誤')}
                style={{ color: 'white' }}
                disabled={isWaiting}
              >
                錯誤
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAnswer('正確')}
                disabled={isWaiting}
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

export default QuestionPage;