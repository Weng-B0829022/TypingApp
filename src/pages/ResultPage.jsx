import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';

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

const ResultPage = ({ resultInfo, onComplete }) => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const formattedRows = resultInfo.map((item, index) => ({
      row: index + 1,
      question: item.question,
      target: item.target,
      correctAnswer: item.correctAnswer,
      userAnswer: item.userAnswer,
      reactionTime: item.reactionTime
    }));
    setRows(formattedRows);
    console.log("Result data loaded:", formattedRows);
  }, [resultInfo]);

  const handleShare = () => {
    console.log("Sharing results...");
    // 實現分享邏輯
  };

  const handleConfirm = () => {
    console.log("Results confirmed");
    onComplete(rows);  // 傳遞完整的行數據
  };

  const calculateTotalTime = () => {
    return rows.reduce((total, row) => total + (row.reactionTime || 0), 0);
  };

  const calculateAccuracy = () => {
    const correctAnswers = rows.filter(row => row.userAnswer === row.correctAnswer).length;
    return (correctAnswers / rows.length * 100).toFixed(2);
  };

  return (
    <Container maxWidth={false} style={sharedContainerStyle}>
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
                <TableCell>題號</TableCell>
                <TableCell align="right">題目</TableCell>
                <TableCell align="right">目標字</TableCell>
                <TableCell align="right">正確答案</TableCell>
                <TableCell align="right">作答情況</TableCell>
                <TableCell align="right">反應時間(ms)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.row}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{row.row}</TableCell>
                  <TableCell align="right">{row.question}</TableCell>
                  <TableCell align="right">{row.target}</TableCell>
                  <TableCell align="right">{row.correctAnswer}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      {row.userAnswer}
                      {' ('}
                      <span style={{
                        color: row.userAnswer === row.correctAnswer ? 'green' : 'red',
                        marginLeft: '4px',
                        fontSize: '1.2em'
                      }}>
                        {row.userAnswer === row.correctAnswer ? '✓' : '✘'}
                      </span>
                      {')'}
                    </Box>
                  </TableCell>
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
          正確題數: {rows.filter(row => row.userAnswer === row.correctAnswer).length}
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