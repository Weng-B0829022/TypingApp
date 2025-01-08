import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import { CheckCircle, X } from 'lucide-react';

/*
const questions_old = [
    { text: '相同', tar: '同', options: ['同', '桐'], ans: 0, zhuyin: 'ㄊㄨㄥˊ' },
    { text: '你好', tar: '你', options: ['你', '尔'], ans: 0, zhuyin: 'ㄋㄧˇ' },
    { text: '微風', tar: '微', options: ['徵', '微'], ans: 0, zhuyin: 'ㄨㄟˊ' },
    { text: '月亮', tar: '月', options: ['月', '日'], ans: 0, zhuyin: 'ㄩㄝˋ' },
    { text: '火車', tar: '火', options: ['人', '火'], ans: 0, zhuyin: 'ㄏㄨㄛˇ' },
    { text: '日本好玩', tar: '日', options: ['日', '目'], ans: 0, zhuyin: 'ㄖˋ' },
];*/

const MultipleChoiceQuestionPage = ({ questions, errorRetry, startCountdown, queIntervel, answerTiming, pronunciationType, onComplete, isFeedbackImmediately, isRetryIncorrect }) => {
  console.log(questions)
  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState(startCountdown);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const startTimeRef = useRef(null);

  // 在組件初始化時對問題選項進行隨機排序
  const shuffledQuestions = useMemo(() => {
    return questions.map(question => ({
      ...question,
      options: Math.random() < 0.5 ? question.options : [...question.options].reverse(),
    }));
  }, [questions]);

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

    const currentQuestion = shuffledQuestions[questionIndex];
    const originalIndex = currentQuestion.options.indexOf(questions[questionIndex].options[currentQuestion.ans]);
    const isCorrect = answer === originalIndex;
    const newAnswers = [...answers, { 
      question: currentQuestion.text,
      target: currentQuestion.tar,
      userAnswer: answer,
      correctAnswer: originalIndex,
      reactionTime: reactionTime
    }];
    setAnswers(newAnswers);

    if (!isCorrect && isRetryIncorrect) {
      if (errorRetry === '立即加入') {
        // 如果答錯，立即在當前位置之後插入同一個問題
        questions.splice(questionIndex + 1, 0, questions[questionIndex]);
      } else if (errorRetry === '加入最後面') {
        // 如果答錯，將當前問題添加到問題列表的末尾
        questions.push(questions[questionIndex]);
      }
    }
    
    if (isFeedbackImmediately) {
      setFeedback(isCorrect ? 'correct' : 'incorrect');

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
      return question.text.replace(question.target, question.zhuyin);
    } else {
      // 使用浏览器内置的 Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(question.text);
        utterance.lang = 'zh-TW'; // 设置为繁体中文
        window.speechSynthesis.speak(utterance);
      } else {
        console.warn('Text-to-speech not supported in this browser.');
      }
      return question.text.replace(question.target, question.zhuyin);
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
            {shuffledQuestions[questionIndex].options.map((option, index) => (
              <Grid item key={index}>
                <Button
                  variant="contained"
                  color="white"
                  onClick={() => handleAnswer(index)}
                  style={{ color: 'white' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img 
                      src={option} 
                      alt="Question" 
                      style={{ width: '3.2em', height: '3.2em', marginBottom: '0.5em' }} 
                    />
                  </div>
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
