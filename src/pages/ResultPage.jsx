import React from 'react';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// 創建表格資料
const createData = (row, col1, col2, col3, col4, col5) => {
  return { row, col1, col2, col3, col4, col5 };
};

const rows = [
  createData(1, 'A1', 'B1', 'C1', 'D1', 'E1'),
  createData(2, 'A2', 'B2', 'C2', 'D2', 'E2'),
  createData(3, 'A3', 'B3', 'C3', 'D3', 'E3'),
  createData(4, 'A4', 'B4', 'C4', 'D4', 'E4'),
  createData(5, 'A5', 'B5', 'C5', 'D5', 'E5'),
];

const ResultPage = () => {
  return (
      <Container
        maxWidth="sm"
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#E0E0E0',
        }}
      >
        <Box
          sx={{
            width: '100%',
            backgroundColor: '#E0E0E0',
            padding: 2,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4">表格</Typography>
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Row</TableCell>
                  <TableCell align="right">Column 1</TableCell>
                  <TableCell align="right">Column 2</TableCell>
                  <TableCell align="right">Column 3</TableCell>
                  <TableCell align="right">Column 4</TableCell>
                  <TableCell align="right">Column 5</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.row}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.row}
                    </TableCell>
                    <TableCell align="right">{row.col1}</TableCell>
                    <TableCell align="right">{row.col2}</TableCell>
                    <TableCell align="right">{row.col3}</TableCell>
                    <TableCell align="right">{row.col4}</TableCell>
                    <TableCell align="right">{row.col5}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" color="primary" style={{ margin: 16 }}>
            分享
          </Button>
          <Button variant="contained" color="primary">
            確認
          </Button>
        </Box>
      </Container>
  );
};

export default ResultPage;
