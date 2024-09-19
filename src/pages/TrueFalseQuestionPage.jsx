import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import { CheckCircle, X } from 'lucide-react';
import photo1 from '../assets/好_代1.png';
import photo2 from '../assets/們_代.png';
import photo3 from '../assets/倒_漏.png';
import photo4 from '../assets/寫_漏代.png';
import photo5 from '../assets/我_漏1.png';
var questions = [
    { text: '你好', target: '好', ans: '錯誤', zhuyin: 'ㄏㄠˇ', display: photo1 },
    { text: '你們', target: '們', ans: '錯誤', zhuyin: 'ㄇㄣ˙', display: photo2 },
    { text: '倒車', target: '倒', ans: '錯誤', zhuyin: 'ㄉㄠˋ', display: photo3 },
    { text: '寫字', target: '寫', ans: '錯誤', zhuyin: 'ㄒㄧㄝˇ', display: photo4 },
    { text: '我們', target: '我', ans: '錯誤', zhuyin: 'ㄨㄛˇ', display: photo5 },
];
//1.遺漏 添加 替代2.鏡像3.注音4.同音別字
const TrueFalseQuestionPage = ({ startCountdown, queIntervel, answerTiming, pronunciationType, onComplete, isFeedbackImmediately, isRetryIncorrect, errorRetry }) => {
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
        if (errorRetry === '立即加入') {
          // 如果答錯，立即在當前位置之後插入同一個問題
          questions.splice(questionIndex + 1, 0, questions[questionIndex]);
        } else if (errorRetry === '加入最後面') {
          // 如果答錯，將當前問題添加到問題列表的末尾
          questions.push(questions[questionIndex]);
        }
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
    if (question.text.includes(question.target)) {
      return question.text.replace(question.target, question.zhuyin);
    } else {
      return question.text;
    }
  };

  const renderDisplay = (display, target) => {
    if (!display.includes('.png')) {
      return <Typography variant="h4" style={{ fontFamily: '標楷體', color: '#000000' }}>{display}</Typography>;
    } else if (display.includes('.png')) {
      return (<div>
        <img src={display} alt="Question" style={{ width: '3.2em', height: '3em' }} />
        <Typography variant="h4" style={{fontSize: '3.5em', fontFamily: '標楷體', color: '#000000' }}>{target}</Typography>
      </div>)
    } else {
      return <Typography variant="h4">圖片載入錯誤</Typography>;
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
          <Typography variant="h4" style={{fontSize: '3.5em', fontFamily: '標楷體', color: '#000000' }}>{renderQuestion()}</Typography>
        </Box>
      )}
      {step >= 2 && (
        <Box sx={{ width: '100%', backgroundColor: '#E0E0E0', padding: 2, borderRadius: 2, textAlign: 'center' }}>
          {(!showOptions || answerTiming === '出題時答題') && (
            renderDisplay(questions[questionIndex].display)
          )}
          {showOptions && (
            <>
              {answerTiming === '出題後答題' && (
                renderDisplay(questions[questionIndex].display, questions[questionIndex].target)
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