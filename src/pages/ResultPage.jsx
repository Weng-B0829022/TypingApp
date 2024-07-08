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

const ResultPage = ({ resultInfo, basicInfo, modeInfo, onComplete }) => {
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

    // Send request to backend immediately when component mounts
    const sendData = async () => {
      try {
        const response = await fetch('http://localhost:8080/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            basicInfo,
            modeInfo,
            questionInfo: resultInfo,
            resultInfo: formattedRows,
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
  }, [resultInfo, basicInfo, modeInfo]);

  const handleShare = () => {
    console.log("Sharing results...");
    // Implement sharing logic
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

  const ImageDownload = ({ imageUrl, fileName }) => {
    const [isDownloading, setIsDownloading] = useState(false);
  
    const handleDownload = async () => {
      setIsDownloading(true);
      try {
        // Fetch the image as a blob
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
  
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);
  
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'image.png';
        link.style.display = 'none';
        document.body.appendChild(link);
  
        // Programmatically click the link to trigger the download
        link.click();
  
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
  
        console.log("Image download initiated successfully");
      } catch (error) {
        console.error("Error initiating image download:", error);
        // Here you might want to show an error message to the user
      } finally {
        setIsDownloading(false);
      }
    };
  
    return (
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleDownload}
        startIcon={<ShareIcon />}
      >
        分享
      </Button>
    );
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
            <ImageDownload imageUrl="https://cdn.britannica.com/79/232779-050-6B0411D7/German-Shepherd-dog-Alsatian.jpg" fileName="result.jpg" />
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