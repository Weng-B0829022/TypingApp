import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import { CheckCircle, X } from 'lucide-react';

var questions = [
    { text: '月亮', tar: '亮', ans: '正確', zhuyin: 'ㄌㄧㄤˋ', display: '亮' },
    //{ text: '你好', tar: '你', ans: '錯誤', zhuyin: 'ㄋㄧˇ', display: '尔' },
    //{ text: '微風', tar: '微', ans: '正確', zhuyin: 'ㄨㄟˊ', display: '微' },
    //{ text: '相同', tar: '同', ans: '正確', zhuyin: 'ㄊㄨㄥˊ', display: '同' },
    //{ text: '火車', tar: '火', ans: '錯誤', zhuyin: 'ㄏㄨㄛˇ', display: '人' },
    //{ text: '日本好玩', tar: '日', ans: '錯誤', zhuyin: 'ㄖˋ', display: '目' },
];

const TrueFalseQuestionPage = ({ startCountdown, queIntervel, answerTiming, pronunciationType, onComplete, isFeedbackImmediately, isRetryIncorrect }) => {
  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState(startCountdown);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const startTimeRef = useRef(null);

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
        if (answerTiming === '出題時答題') {
          setShowOptions(true);
        }
      }, queIntervel * 1000);
      return () => clearTimeout(timer);
    }

    if (step === 2 && answerTiming === '出題後答題') {
      const timer = setTimeout(() => {
        setShowOptions(true);
      }, queIntervel * 1000);
      return () => clearTimeout(timer);
    }
  }, [step, answerTiming, queIntervel]);

  const handleAnswer = (answer) => {
    const endTime = Date.now();
    const reactionTime = startTimeRef.current ? endTime - startTimeRef.current : null;

    const isCorrect = answer === questions[questionIndex].ans;
    const newAnswers = [...answers, { 
      question: questions[questionIndex].text,
      target: questions[questionIndex].tar,
      display: questions[questionIndex].display,
      userAnswer: answer,
      correctAnswer: questions[questionIndex].ans,
      reactionTime: reactionTime
    }];
    setAnswers(newAnswers);

    if (isFeedbackImmediately) {
      setFeedback(isCorrect ? 'correct' : 'incorrect');

      if (!isCorrect && isRetryIncorrect) {
        // 如果答錯，將當前問題添加到問題列表的末尾
        questions = [...questions, questions[questionIndex]];
      }

      setTimeout(() => {
        console.log('setFeedback(null)')
        setFeedback(null);
        moveToNextQuestion(newAnswers);
      }, 1000);
    } else {
      moveToNextQuestion(newAnswers);
    }
  };

  const moveToNextQuestion = (newAnswers) => {
    if (questionIndex < questions.length - 1) {
      setStep(1);
      setQuestionIndex(questionIndex + 1);
      setShowOptions(false);
      startTimeRef.current = null;
    } else {
      onComplete(newAnswers);
    }
  };

  const renderQuestion = () => {
    const question = questions[questionIndex];
    if (pronunciationType === '注音') {
      return question.text.replace(question.tar, question.zhuyin);
    } else {
      return question.text;
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
        position: 'relative',
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
      {step === 0 && (
        <Box sx={{ width: '100%', backgroundColor: '#E0E0E0', padding: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h4">倒數 {countdown}</Typography>
        </Box>
      )}
      {step === 1 && (
        <Box sx={{ width: '100%', backgroundColor: '#E0E0E0', padding: 2, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h4">{renderQuestion()}</Typography>
        </Box>
      )}
      {step >= 2 && (
        <Box sx={{ width: '100%', backgroundColor: '#E0E0E0', padding: 2, borderRadius: 2, textAlign: 'center' }}>
          {(!showOptions || answerTiming === '出題時答題') && (
            <Typography variant="h4">
              {questions[questionIndex].display}
            </Typography>
          )}
          {showOptions && (
            <>
              {answerTiming === '出題後答題' && (
                <Typography variant="h4">
                  ?
                </Typography>
              )}
              <Grid container spacing={2} justifyContent="center" mt={2}>
                <Grid item>
                  <Button variant="contained" color="secondary" onClick={() => handleAnswer('錯誤')} style={{ color: 'white' }}>
                    否
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => handleAnswer('正確')}>
                    是
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      )}
    </Container>
  );
};

export default TrueFalseQuestionPage;