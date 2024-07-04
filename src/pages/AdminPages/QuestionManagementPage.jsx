import React, { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  Button, 
  Typography,
  useMediaQuery,
  Collapse,
  Box
} from '@mui/material';

import { useTheme } from '@mui/material/styles';

const styles = {
  container: {
    display: 'flex',
    height: '89vh',
    width: '100%',
    fontFamily: 'Arial, sans-serif',
  },
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    overflowY: 'auto',
  },
  title: {
    marginBottom: '16px',
  },
  searchInput: {
    marginBottom: '16px',
  },
  tableContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    borderRadius:'8px'
  },
  selectedRow: {
    backgroundColor: '#e6f3ff',
  },
  detailsPanel: {
    width: '300px',
    backgroundColor: '#f8f8f8',
    overflowY: 'auto',
    borderRadius:'8px'
  },
  detailsTitle: {
    marginBottom: '12px',
  },
  detailsContent: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '8px',
  },
  classPanel: {
    width: '250px',
    height: '220px',
    backgroundColor: '#f8f8f8',
    overflowY: 'auto',
    borderRadius:'8px'
  }
};

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const theme = useTheme();
  const isMiduimScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [grade, setGrade] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const handleGradeChange = (newGrade) => {
    setGrade(grade === newGrade ? '' : newGrade);
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(difficulty === newDifficulty ? '' : newDifficulty);
  };
  // 模擬數據
  const data = [
    {
      name: '張三',
      researchCode: 'A001',
      details: {
        wordBank: '一年級',
        difficulty: '簡單',
        questionCount: 10,
        feedbackMode: '立即反饋',
        additionalSettings: '倒計時: 30秒'
      }
    },
    {
      name: '李四',
      researchCode: 'B002',
      details: {
        wordBank: '二年級',
        difficulty: '中等',
        questionCount: 15,
        feedbackMode: '答題後反饋',
        additionalSettings: '允許跳過: 是'
      }
    },
    // 為了演示滾動效果，添加更多數據
    ...Array(20).fill().map((_, i) => ({
      name: `測試用戶 ${i+3}`,
      researchCode: `T00${i+3}`,
      details: {
        wordBank: '三年級',
        difficulty: '困難',
        questionCount: 20,
        feedbackMode: '混合模式',
        additionalSettings: '時間限制: 45分鐘'
      }
    }))
  ];

  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.researchCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const toggleDetails = (index) => {
    setSelectedRow(selectedRow === index ? null : index);
  }; 

  const renderDetails = (item) => (
    <Box sx={{ margin: 1 }}>
      <Typography><strong>姓名:</strong> {item.name}</Typography>
      <Typography><strong>研究代號:</strong> {item.researchCode}</Typography>
      <Typography><strong>時間:</strong> {item.time}</Typography>
      <Typography><strong>正確率:</strong> {item.accuracy}</Typography>
      <Typography><strong>字庫:</strong> {item.details.wordBank}</Typography>
      <Typography><strong>難易度:</strong> {item.details.difficulty}</Typography>
      <Typography><strong>題目數:</strong> {item.details.questionCount}</Typography>
      <Typography><strong>反饋模式:</strong> {item.details.feedbackMode}</Typography>
      <Typography><strong>詳細設置:</strong> {item.details.additionalSettings}</Typography>
    </Box>
  );

  const classPanel = () =>{
    return <div style={styles.classPanel}>
          <Typography variant="subtitle1" gutterBottom>
            年級
          </Typography>
          <div style={styles.buttonGroup}>
            {['一年級', '二年級', '三年級', '四年級', '五年級', '六年級'].map((g) => (
              <Button 
                key={g} 
                variant={grade === g ? "contained" : "outlined"}
                onClick={() => handleGradeChange(g)}
                style={grade === g ? styles.selectedButton : {}}
              >
                {g}
              </Button>
            ))}
          </div>
          <Typography variant="subtitle1" gutterBottom>
            難度
          </Typography>
          <div style={styles.buttonGroup}>
            {['簡單', '中等', '困難'].map((d) => (
              <Button 
                key={d} 
                variant={difficulty === d ? "contained" : "outlined"}
                onClick={() => handleDifficultyChange(d)}
                style={difficulty === d ? styles.selectedButton : {}}
              >
                {d}
              </Button>
            ))}
          </div>
        </div>
  }

  return (
    <div style={isMiduimScreen ? isSmallScreen? {} : {display:'flex'} : styles.container}>
      {!isSmallScreen && (
        classPanel()
      )}
      {isSmallScreen && (
        classPanel()
      )}
      <div style={styles.mainContent}>
        <TextField
          fullWidth
          placeholder="搜尋姓名或研究代號..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <TableContainer component={Paper} style={styles.tableContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>姓名</TableCell>
                <TableCell>研究代號</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((item, index) => (
                <React.Fragment key={index}>
                  <TableRow 
                    style={selectedRow === index ? styles.selectedRow : {}}
                  >
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.researchCode}</TableCell>
                    <TableCell>
                      <Button 
                        onClick={() => toggleDetails(index)}
                        color="primary"
                      >
                        {selectedRow === index ? '隱藏詳情' : '查看詳情'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {isMiduimScreen && (
                    <TableRow>
                      <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
                        <Collapse in={selectedRow === index} timeout="auto" unmountOnExit>
                          {renderDetails(item)}
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {!isMiduimScreen && (
        <div style={styles.detailsPanel}>
          <Typography variant="h6" style={styles.detailsTitle}>
            {selectedRow !== null ? '詳細資訊' : '請選擇一行查看詳情'}
          </Typography>
          {selectedRow !== null && renderDetails(filteredData[selectedRow])}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;