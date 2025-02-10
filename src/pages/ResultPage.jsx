import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import html2canvas from 'html2canvas';
import { Share } from 'lucide-react';
import GetAppIcon from '@mui/icons-material/GetApp';
import { utils, writeFile } from 'xlsx';

const sharedContainerStyle = {
  width: '100%',
  maxWidth: 'min(100vw, 600px)',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#E0E0E0',
};

const ResultPage = ({ answerInfo, basicInfo, modeInfo, onComplete }) => {
  const [rows, setRows] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    const questionNumbers = {};
    let mainQuestionCount = 0;
  
    const formattedRows = answerInfo.map((item, index) => {
      if (!questionNumbers[item.question]) {
        mainQuestionCount++;
        questionNumbers[item.question] = {
          mainNumber: mainQuestionCount,
          subNumber: 0
        };
      } else {
        questionNumbers[item.question].subNumber++;
      }
  
      const { mainNumber, subNumber } = questionNumbers[item.question];
      const rowNumber = subNumber === 0 ? `${mainNumber}` : `${mainNumber}.${subNumber}`;
  
      if (modeInfo.questionFormat === "二選一選擇題") {
        console.log(item)
        const newOrder = [modeInfo.questions[index].options[item.correctAnswer ? 1 : 0], modeInfo.questions[index].options[item.correctAnswer ? 0 : 1]]
        return {
          row: rowNumber ,
          question: item.question,
          target: item.target,
          display: newOrder, // 假設 item 中包含選項數組
          correctAnswer: newOrder[item.correctAnswer] ,
          userAnswer: newOrder[item.userAnswer],
          reactionTime: item.reactionTime
        };
      } else {
        
        return {
          row: rowNumber,
          question: item.question,
          target: item.target,
          display: item.display,
          correctAnswer: item.correctAnswer,
          userAnswer: item.userAnswer,
          reactionTime: item.reactionTime
        };
      }
    });
    
    setRows(formattedRows);

    // Send request to backend
    const sendData = async () => {
      try {
        console.log("modeInfo:", modeInfo, "basicInfo:", basicInfo);
        const response = await fetch('http://localhost:5001/api/quizResult', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({

            modeInfo:{
              ...modeInfo,
              answerInfo: answerInfo,
              name: basicInfo.name,
              researchCode: basicInfo.researchCode,
            },
          }),
        });

        if (response.ok) {
          console.log('Data sent successfully');
        } else {
          console.error('Failed to send data');
        }
      } catch (error) {
        console.error('Error sending request:', error);
      }
    };

    sendData();
  }, [answerInfo, basicInfo, modeInfo]);

  
  const handleShare = async () => {
    if (tableRef.current) {
      try {
        const canvas = await html2canvas(tableRef.current);
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        const file = new File([blob], 'result.png', { type: 'image/png' });

        if (navigator.share) {
          await navigator.share({
            title: '測驗結果',
            text: '查看我的測驗結果！',
            files: [file]
          });
        } else {
          // 如果 Web Share API 不可用，回退到下載圖片
          const image = canvas.toDataURL("image/png");
          const link = document.createElement('a');
          link.href = image;
          link.download = 'result.png';
          link.click();
        }
      } catch (error) {
        console.error('分享失敗:', error);
        alert('分享失敗，請稍後再試。');
      }
    }
  };

  const handleConfirm = () => {
    console.log("Results confirmed");
    onComplete(rows);
  };

  const calculateTotalTime = () => {
    return rows.reduce((total, row) => total + (row.reactionTime || 0), 0);
  };

  const calculateAccuracy = () => {
    const correctAnswers = rows.filter(row => row.userAnswer === row.correctAnswer).length;
    return (correctAnswers / rows.length * 100).toFixed(2);
  };
  const renderDisplay = (display) => {
    return (
      <TableCell sx={{ padding: '0px'}} align="right">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {modeInfo.questionFormat === "二選一選擇題" ? 
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <img 
            src={display[0]} 
            alt="Question" 
            style={{ width: '1.6em', height: '1.6em', }}/>
          <img 
            src={display[1]}
            alt="Question"
            style={{ width: '1.6em', height: '1.6em', }}/>
        </div>:
        <img 
          src={display} 
          alt="Question" 
          style={{ width: '1.6em', height: '1.6em', marginBottom: '0.5em' }} 
        />}
          {/* <Typography
            variant="h1"
            sx={{
              fontWeight: 100,
              fontSize: '3.5em',
              fontFamily: '標楷體',
              color: '#000000'
            }}
          >
            {target}
          </Typography> */}
        </Box>
      </TableCell>
    );
  };

  const renderCorrectAnswer = (correctAnswer) => {
    return (
      <TableCell sx={{ padding: '0px' }} align="right">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {modeInfo.questionFormat === "二選一選擇題" ? (
          <img 
            src={correctAnswer} 
            alt="Correct Answer" 
            style={{ width: '1.6em', height: '1.6em' }}
          />
        ) : (
          correctAnswer
        )}
        </Box>
      </TableCell>
    );
  };

  const renderUserAnswer = (userAnswer, correctAnswer) => {
    return (
      <TableCell sx={{ padding: '0px' }} align="right">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {modeInfo.questionFormat === "二選一選擇題" ? (
            <img 
              src={userAnswer} 
              alt="User Answer" 
              style={{ width: '1.6em', height: '1.6em', marginRight: '4px' }}
            />
          ) : (
            userAnswer
          )}
          {' ('}
          <span style={{
            color: userAnswer === correctAnswer ? 'green' : 'red',
            marginLeft: '4px',
            fontSize: '1.2em'
          }}>
            {userAnswer === correctAnswer ? '✓' : '✘'}
          </span>
          {')'}
        </Box>
      </TableCell>
    );
  };

  const handleExportExcel = () => {
    console.log(rows)
    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Results");
    writeFile(wb, "test_results.xlsx");
  };
  return (
    <Container maxWidth={false} style={sharedContainerStyle} ref={tableRef}>
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#E0E0E0',
          padding: 2,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>測驗結果</Typography>
        <TableContainer component={Paper} sx={{ marginTop: 2, marginBottom: 2 }}>
          <Table aria-label="result table" size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: '0px'}} align="right">題號</TableCell>
                <TableCell sx={{ padding: '0px'}} align="right">題目</TableCell>
                <TableCell sx={{ padding: '0px'}} align="right">目標字</TableCell>
                <TableCell sx={{ padding: '0px'}} align="right">畫面顯示</TableCell>
                <TableCell sx={{ padding: '0px'}} align="right">正確答案</TableCell>
                <TableCell sx={{ padding: '0px'}} align="right">作答情況</TableCell>
                <TableCell sx={{ padding: '0px'}} align="right">反應時間(ms)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.row}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell sx={{ padding: '0px'}} align="right" component="th" scope="row">{row.row}</TableCell>
                  <TableCell sx={{ padding: '0px'}} align="right">{row.question}</TableCell>
                  <TableCell sx={{ padding: '0px'}} align="right">{row.target}</TableCell>
                  {renderDisplay(row.display)}
                  {renderCorrectAnswer(row.correctAnswer)}
                  {renderUserAnswer(row.userAnswer, row.correctAnswer)}
                  <TableCell align="right">{row.reactionTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h6" gutterBottom>
          總反應時間: {calculateTotalTime()} ms
        </Typography>
        <Typography variant="h6" gutterBottom>
          正確題數  /  總題數: {rows.filter(row => row.userAnswer === row.correctAnswer).length}  /  {rows.length}  題
        </Typography>
        <Typography variant="h6" gutterBottom>
          正確率: {calculateAccuracy()}%
        </Typography>
        <Grid container spacing={2} justifyContent="space-between" sx={{ marginTop: 2 }}>
          <Grid item>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleShare}
            startIcon={<ShareIcon />}
          >
            分享
          </Button>
          </Grid> 
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleExportExcel}
              startIcon={<GetAppIcon />}
            >
              匯出
            </Button>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleConfirm}
            >
              確認
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ResultPage;
