import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import { CheckCircle, X } from 'lucide-react';

const questions = [
    { text: '相同', tar: '同', options: ['同', '桐'], ans: '同', zhuyin: 'ㄊㄨㄥˊ' },
    { text: '你好', tar: '你', options: ['你', '尔'], ans: '你', zhuyin: 'ㄋㄧˇ' },
    { text: '微風', tar: '微', options: ['徵', '微'], ans: '微', zhuyin: 'ㄨㄟˊ' },
    { text: '月亮', tar: '月', options: ['月', '日'], ans: '月', zhuyin: 'ㄩㄝˋ' },
    { text: '火車', tar: '火', options: ['人', '火'], ans: '火', zhuyin: 'ㄏㄨㄛˇ' },
    { text: '日本好玩', tar: '日', options: ['日', '目'], ans: '日', zhuyin: 'ㄖˋ' },
];

const MultipleChoiceQuestionPage = ({ startCountdown, queIntervel, answerTiming, pronunciationType, onComplete, isFeedbackImmediately, isRetryIncorrect }) => {
  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState(startCountdown);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
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
      }, queIntervel * 1000);
      return () => clearTimeout(timer);
    }

    if (step === 2 && answerTiming === '出題後答題') {
      const timer = setTimeout(() => {
        setStep(3);
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
      userAnswer: answer,
      correctAnswer: questions[questionIndex].ans,
      reactionTime: reactionTime
    }];
    setAnswers(newAnswers);

    if (isFeedbackImmediately) {
      setFeedback(isCorrect ? 'correct' : 'incorrect');

      if (!isCorrect && isRetryIncorrect) {
        if (errorRetry === '立即加入') {
          // 如果答錯，立即在當前位置之後插入同一個問題
          questions.splice(questionIndex + 1, 0, questions[questionIndex]);
        } else if (errorRetry === '加入最後面') {
          // 如果答錯，將當前問題添加到問題列表的末尾
          questions.push(questions[questionIndex]);
        }
      }

      setTimeout(() => {
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
          {answerTiming === '出題時答題' && step === 2 && (
            <Typography variant="h4">
              {renderQuestion()}
            </Typography>
          )}
          {answerTiming === '出題後答題' && step >= 2 && (
            <Typography variant="h4">
              ?
            </Typography>
          )}
          <Grid container spacing={2} justifyContent="center" mt={2}>
            {questions[questionIndex].options.map((option, index) => (
              <Grid item key={index}>
                <Button
                  variant="contained"
                  color={index === 0 ? "secondary" : "primary"}
                  onClick={() => handleAnswer(option)}
                  style={{ color: 'white' }}
                >
                  {option}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default MultipleChoiceQuestionPage;