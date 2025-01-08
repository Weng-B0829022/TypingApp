import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, Accordion, AccordionSummary, AccordionDetails, TextField,
  Snackbar, Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CharacterWordTable from './ModePage/CharacterWordTable';
import toZhuyin from '../utils/toZhuyin';
const ModePage = ({ onComplete }) => {
  const theme = useTheme();
  const [selected, setSelected] = useState({
    grade: '一年級',
    level: '簡單',
    number: '1',
    mode: '立即回饋',
    startCountdown: 1 , // 新增倒數計時秒數的預設值
    queIntervel: 1 , // 題目間隔的等待時間
    pronunciationType: '注音' ,
    questionFormat: '是非題',  // 新增：題目格式（是非題/二選一選擇題）
    answerTiming: '出題後答題',  
    isRetryIncorrect: '否',
    errorRetry:'加入最後面' , //0馬上 1最後面
    characterType: '相似字', // 新增：字形類別（相似字/同音字）
  });
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleStart = () => {
    let newError = '';
    if (!selected.number) newError = '請選擇題目數';
    else if (!selected.mode) newError = '請選擇回饋模式';
    else if (!selected.startCountdown) newError = '請設置開始時準備時間';
    else if (!selected.queIntervel) newError = '請設置題目間隔時間';
    else if (!selected.questionFormat) newError = '請選擇題目格式';
    else if (!selected.answerTiming) newError = '請選擇答題時機';
    else if (!selected.pronunciationType) newError = '請選擇題目顯示類型';
    else if (selected.mode === '立即回饋' && !selected.isRetryIncorrect) newError = '請選擇是否重新加入錯誤題目';
    else if (selected.isRetryIncorrect === '是' && !selected.errorRetry) newError = '請選擇重新加入的位置';
    else if (questions.length < parseInt(selected.number)) newError = `請至少選擇 ${selected.number} 個題目`;

    if (newError) {
      setError(newError);
      setSnackbarOpen(true);
    } else {
      setError('');
      onComplete({ ...selected, questions });
    }
  };

  const setSelectedQuestions = (selectedItems) => {
    const newQuestions = selectedItems.map((item) => {
      if (selected.questionFormat === '是非題') {
        return {
          text: item.word,
          target: item.character,
          ans: item.isCorrectVariant ? '正確' : '錯誤',
          zhuyin: toZhuyin[item.character],
          display: `data:image/png;base64,${item.selectedVariantImage}`
        };
      } else if (selected.questionFormat === '二選一選擇題') {
        // Assuming item.alternativeCharacter exists for the second option
        return {
          text: item.word,
          tar: item.character,
          options: [
            `data:image/png;base64,${item.selectedVariantImage[0]}`,
            `data:image/png;base64,${item.selectedVariantImage[1]}`
          ],
          ans: 0,
          zhuyin: toZhuyin[item.character]
        };
      }
    });
  
    setQuestions(newQuestions);
    //console.log('Questions set:', newQuestions);
  };

  const handleButtonClick = (category, value) => {
    setSelected((prevState) => {
      // 只對 'grade' 和 'level' 類別實現切換功能
      if (category === 'grade' || category === 'level') {
        if (prevState[category] === value) {
          return {
            ...prevState,
            [category]: '', // 如果點擊已選中的值，則取消選擇
          };
        }
      }
      // 對其他類別保持原有的選擇邏輯
      return {
        ...prevState,
        [category]: value,
      };
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelected((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const buttonStyle = {
    '&:focus': {
      outline: 'none',
      boxShadow: 'none',
    }
  }
  const boxStyle = {
    width: '80%', 
    mb: 2, 
    backgroundColor: '#E0E0E0', 
    padding: 2, 
    borderRadius: 2,
    border: 'none',  // 添加這行來去除邊框
    boxShadow: 'none'  // 添加這行來去除陰影
  };

  return (
    <Grid container spacing={0}>
      <Grid item xs={5} md={5}>
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
            字形類別
          </Typography>
          <Grid container spacing={1}>
            {['相似字', '同音字'].map((type) => (
              <Grid item xs={6} key={type}>
                <Button
                  variant="contained"
                  color={selected.characterType === type ? 'primary' : 'white'}
                  fullWidth
                  onClick={() => handleButtonClick('characterType', type)}
                  style={{ color: selected.characterType === type ? 'white' : 'black' }}
                  sx={buttonStyle}
                >
                  {type}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={boxStyle}>
          <Typography variant="h6" align="center" gutterBottom>
            題目格式 
          </Typography>
          <Grid container spacing={1}>
            {['是非題', '二選一選擇題'].map((format) => (
              <Grid item xs={6} key={format}>
                <Button
                  variant="contained"
                  color={selected.questionFormat === format ? 'primary' : 'white'}
                  fullWidth
                  onClick={() => handleButtonClick('questionFormat', format)}
                  style={{ color: selected.questionFormat === format ? 'white' : 'black' }}
                  sx={buttonStyle}
                >
                  {format}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={boxStyle}>
          <Typography variant="h6" align="center" gutterBottom>
            答題時機 
          </Typography>
          <Grid container spacing={1}>
            {['出題後答題', '出題時答題'].map((timing) => (
              <Grid item xs={6} key={timing}>
                <Button
                  variant="contained"
                  color={selected.answerTiming === timing ? 'primary' : 'white'}
                  fullWidth
                  onClick={() => handleButtonClick('answerTiming', timing)}
                  style={{ color: selected.answerTiming === timing ? 'white' : 'black' }}
                  sx={buttonStyle}
                >
                  {timing}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={boxStyle}>
          <Typography variant="h6" align="center" gutterBottom>
            題目顯示類型 
          </Typography>
          <Grid container spacing={1}>
            {['注音', '發音'].map((type) => (
              <Grid item xs={6} key={type}>
                <Button
                  variant="contained"
                  color={selected.pronunciationType === type ? 'primary' : 'white'}
                  fullWidth
                  onClick={() => handleButtonClick('pronunciationType', type)}
                  style={{ color: selected.pronunciationType === type ? 'white' : 'black' }}
                  sx={buttonStyle}
                >
                  {type}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={boxStyle}>
          <Typography variant="h6" align="center" gutterBottom>
            字庫 
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
                  sx={buttonStyle}
                >
                  {grade}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={boxStyle}>
          <Typography variant="h6" align="center" gutterBottom>
            難易度 
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
                  sx={buttonStyle}
                >
                  {level}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={boxStyle}>
          <Typography variant="h6" align="center" gutterBottom>
            題目數 
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
                  sx={buttonStyle}
                >
                  {number}題
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={boxStyle}>
          <Typography variant="h6" align="center" gutterBottom>
            回饋模式 
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
                  sx={buttonStyle}
                >
                  {mode}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
        {(
          <Box sx={boxStyle}>
            <Typography variant="h6" align="center" gutterBottom>
              答錯的題目是否重新加入 
            </Typography>
            <Grid container spacing={1}>
              {['是', '否'].map((option) => (
                <Grid item xs={6} key={option}>
                  <Button
                    variant="contained"
                    color={selected.isRetryIncorrect === option ? 'primary' : 'white'}
                    fullWidth
                    onClick={() => handleButtonClick('isRetryIncorrect', option)}
                    style={{ color: selected.isRetryIncorrect === option ? 'white' : 'black' }}
                    sx={{
                      '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {option}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        {selected.isRetryIncorrect === '是' && (
          <Box sx={boxStyle}>
            <Typography variant="h6" align="center" gutterBottom>
              重新加入時穿插的位置 
            </Typography>
            <Grid container spacing={1}>
              {['立即加入', '加入最後面'].map((option) => (
                <Grid item xs={6} key={option}>
                  <Button
                    variant="contained"
                    color={selected.errorRetry === option ? 'primary' : 'white'}
                    fullWidth
                    onClick={() => handleButtonClick('errorRetry', option)}
                    style={{ color: selected.errorRetry === option ? 'white' : 'black' }}
                    sx={{
                      '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {option}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
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
                開始時準備時間 
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
                題目顯示後的等待時間 
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
          sx={{ mt: 2 }}
          onClick={handleStart}
        >
          開始測驗
        </Button>
      </Container>
      </Grid>
      <Grid item xs={7} md={7}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          background:'#F5F5F5',
          width: '55%', // 調整寬度以適應您的需求
          zIndex: 1000,
          height: '96vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding:1 
        }}
      >
          <CharacterWordTable 
            grade={selected.grade.charAt(0)} 
            level={selected.level}
            number={selected.number}
            questionFormat={selected.questionFormat}
            onSelectQuestions={setSelectedQuestions}
          />
        </Box>
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
};

export default ModePage;


