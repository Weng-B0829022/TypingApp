import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';

const questions = [
{ text: '相同', tar: '同', options: ['同', '桐'], ans: '同', zhuyin: 'ㄊㄨㄥˊ' },
{ text: '你好', tar: '尔', options: ['你', '尔'], ans: '你', zhuyin: 'ㄦˇ' },
{ text: '微風', tar: '微', options: ['徵', '微'], ans: '微', zhuyin: 'ㄨㄟ' },
{ text: '月亮', tar: '月', options: ['月', '日'], ans: '月', zhuyin: 'ㄩㄝˋ' },
{ text: '火車', tar: '人', options: ['人', '火'], ans: '火', zhuyin: 'ㄖㄣˊ' },
{ text: '日本好玩', tar: '目', options: ['日', '目'], ans: '日', zhuyin: 'ㄇㄨˋ' },
];

const MultipleChoiceQuestionPage = ({ startCountdown, queIntervel, answerTiming, pronunciationType, onComplete }) => {
const [step, setStep] = useState(0);
const [countdown, setCountdown] = useState(startCountdown);
const [questionIndex, setQuestionIndex] = useState(0);
const [answers, setAnswers] = useState([]);
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
        setStep(3);
        }
    }, queIntervel * 1000);

    return () => clearTimeout(timer);
    }
}, [step, answerTiming, queIntervel]);

const handleAnswer = (answer) => {
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

    if (questionIndex < questions.length - 1) {
        setStep(1);
        setQuestionIndex(questionIndex + 1);
        startTimeRef.current = null;
    } else {
        onComplete(newAnswers);
    }
};

const renderPronunciation = () => {
    const question = questions[questionIndex];
    return pronunciationType === '注音' ? question.zhuyin : '(播放發音)';
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
    }}
    >
    {step === 0 ? (
        <Box sx={{ width: '100%', backgroundColor: '#E0E0E0', padding: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h4">倒數 {countdown}</Typography>
        </Box>
    ) : step === 1 ? (
        <Box sx={{ width: '100%', backgroundColor: '#E0E0E0', padding: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h4">{questions[questionIndex].text}</Typography>
            <Typography variant="h5">{renderPronunciation()}</Typography>
        </Box>
    ) : step === 2 ? (
        <Box sx={{ width: '100%', backgroundColor: '#E0E0E0', padding: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h4">{questions[questionIndex].tar}</Typography>
            <Typography variant="h5">{renderPronunciation()}</Typography>
        </Box>
    ) : (
        <Box sx={{ width: '100%', backgroundColor: '#E0E0E0', padding: 2, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="h4">{questions[questionIndex].tar}</Typography>
            <Typography variant="h5">{renderPronunciation()}</Typography>
        <Grid container spacing={2} justifyContent="center" mt={2}>
            {questions[questionIndex].options.map((option, index) => (
            <Grid item key={index}>
                <Button variant="contained" color="primary" onClick={() => handleAnswer(option)}>
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