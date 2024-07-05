import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  Box,
  Pagination,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import DeleteConfirmationRow from './components/DeleteConfirmationRow';
import styles from './styles/QuestionManagementPage_styles';

const initialData = [
  {
    name: '張三',
    researchCode: 'A001',
    time: '2023-07-01 14:30',
    accuracy: '85%',
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
    time: '2023-07-02 10:15',
    accuracy: '92%',
    details: {
      wordBank: '二年級',
      difficulty: '中等',
      questionCount: 15,
      feedbackMode: '答題後反饋',
      additionalSettings: '允許跳過: 是'
    }
  },
  // 為了演示滾動效果，添加更多數據
  ...Array(200000).fill().map((_, i) => ({
    name: `測試用戶 ${i+3}`,
    researchCode: `T00${i+3}`,
    time: '2023-07-03 09:00',
    accuracy: '88%',
    details: {
      wordBank: '三年級',
      difficulty: '困難',
      questionCount: 20,
      feedbackMode: '混合模式',
      additionalSettings: '時間限制: 45分鐘'
    }
  }))
];

const ITEMS_PER_PAGE = 50; // 每页显示的项目数

const DashboardPage = () => {
  const [data, setData] = useState(initialData);
  const [selectedRow, setSelectedRow] = useState(null);
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [grade, setGrade] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter(item => 
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.researchCode.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (grade ? item.details.wordBank === grade : true) &&
      (difficulty ? item.details.difficulty === difficulty : true)
    );
  }, [searchTerm, grade, difficulty, data]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, page]);

  const handleGradeChange = useCallback((newGrade) => {
    setGrade(prevGrade => prevGrade === newGrade ? '' : newGrade);
    setPage(1);                   //  重置頁碼
    setDeleteConfirmation(null);  //  關閉刪除確認列
    setSelectedRow(-1);           //  關閉詳細信息列
  }, []);

  const handleDifficultyChange = useCallback((newDifficulty) => {
    setDifficulty(prevDifficulty => prevDifficulty === newDifficulty ? '' : newDifficulty);
    setPage(1);                   //  重置頁碼
    setDeleteConfirmation(null);  //  關閉刪除確認列
    setSelectedRow(-1);           //  關閉詳細信息列
  }, []);

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value);
    setPage(1);                   //  重置頁碼
    setDeleteConfirmation(null);  //  關閉刪除確認列
    setSelectedRow(-1);           //  關閉詳細信息列
  }, []);

  const toggleDetails = useCallback((index) => {
    setSelectedRow(prevSelectedRow => prevSelectedRow === index ? null : index);
    setDeleteConfirmation(null);
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleDelete = useCallback((index) => {
    setSelectedRow(-1);
    setDeleteConfirmation(prevIndex => prevIndex === index ? null : index);
  }, []);

  const confirmDelete = useCallback((index) => {
    setData(prevData => prevData.filter((_, i) => i !== index));
    setDeleteConfirmation(null);
    setSelectedRow(null);
    setSnackbarOpen(true);//顯示snacker
  }, []);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const renderDetails = useCallback((item) => (
    <Box sx={{ margin: 1 }}>
      <Typography><strong>姓名:</strong> {item.name}</Typography>
      <Typography><strong>研究代號:</strong> {item.researchCode}</Typography>
      <Typography><strong>字庫:</strong> {item.details.wordBank}</Typography>
      <Typography><strong>難易度:</strong> {item.details.difficulty}</Typography>
      <Typography><strong>题目數:</strong> {item.details.questionCount}</Typography>
      <Typography><strong>反饋模式:</strong> {item.details.feedbackMode}</Typography>
      <Typography><strong>詳細設置:</strong> {item.details.additionalSettings}</Typography>
    </Box>
  ), []);

  // 使用 useEffect 来处理过滤后数据变化时的逻辑
  useEffect(() => {
    if (filteredData.length > 0 && (page - 1) * ITEMS_PER_PAGE >= filteredData.length) {
      setPage(1);
    }
  }, [filteredData, page]);

  return (
    <div style={isMediumScreen ? isSmallScreen ? {} : {display:'flex'} : styles.container}>
      <div style={styles.mainContent}>
        {/* 搜索区块 */}
        <div style={styles.classPanel}>
          <div style={styles.buttonSection}>
            <Typography variant="subtitle1" gutterBottom>
              年級
            </Typography>
            <div style={styles.buttonGroup}>
              {['一年級', '二年級', '三年級', '四年級', '五年級', '六年級'].map((g) => (
                <Button 
                  key={g} 
                  variant={grade === g ? "contained" : "outlined"}
                  onClick={() => handleGradeChange(g)}
                  style={grade === g ? { ...styles.button, ...styles.selectedButton } : styles.button}
                  fullWidth
                >
                  {g}
                </Button>
              ))}
            </div>
            <Typography variant="subtitle1" gutterBottom style={{textAlign: 'left', marginLeft:'80px'}}>
              難度
            </Typography>
            <div style={styles.buttonGroup}>
              <Box sx={{display:'flex'}}>
                {['簡單', '中等', '困難'].map((d) => (
                  <Button 
                    key={d}
                    variant={difficulty === d ? "contained" : "outlined"}
                    onClick={() => handleDifficultyChange(d)}
                    style={difficulty === d ? { ...styles.button, ...styles.selectedButton } : styles.button}
                    fullWidth
                  >
                    {d}
                  </Button>
                ))}
              </Box>
              <div style={styles.searchSection}>
                <TextField
                  placeholder="搜尋姓名或研究代號..."
                  variant="outlined"
                  size="small"
                  style={styles.searchInput}
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
        {/* 数据区块 */}
        <TableContainer component={Paper} style={styles.tableContainer}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>姓名</TableCell>
                <TableCell>研究代號</TableCell>
                <TableCell>時間</TableCell>
                <TableCell>正確率</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((item, index) => (
                <React.Fragment key={index}>
                  <TableRow 
                    style={selectedRow === index ? styles.selectedRow : {}}
                  >
                    <TableCell sx={{borderBottom: 'none'}}>{item.name}</TableCell>
                    <TableCell sx={{borderBottom: 'none'}}>{item.researchCode}</TableCell>
                    <TableCell sx={{borderBottom: 'none'}}>{item.time}</TableCell>
                    <TableCell sx={{borderBottom: 'none'}}>{item.accuracy}</TableCell>
                    
                    <TableCell sx={{borderBottom: 'none'}}
                    >
                      <Button 
                        onClick={() => toggleDetails(index)}
                        color="primary"
                        sx={{
                          padding: isMediumScreen ? '2px' : '8px'
                        }}
                      >
                        {selectedRow === index ? '隱藏詳情' : '查看詳情'}
                      </Button>
                      <IconButton 
                        aria-label="delete" 
                        onClick={() => handleDelete(index)}
                        sx={{
                          '&:focus': {
                            outline: 'none',
                            boxShadow: 'none',
                          },
                          width: isMediumScreen ? '30px' : '40px',
                          height: isMediumScreen ? '30px' : '40px',
                          padding: isMediumScreen ? '2px' : '8px',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {<TableRow>
                      <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0  }}>
                        <Collapse in={deleteConfirmation === index} timeout="auto" unmountOnExit>
                          <DeleteConfirmationRow
                            index={index}
                            onConfirm={() => confirmDelete(index)}
                            onCancel={() => handleDelete(null)}
                          />
                        </Collapse>
                      </TableCell>
                  </TableRow>}
                  {isMediumScreen && (
                    <TableRow>
                      <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 , borderBottom: 'none' }}>
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
        <Pagination
          count={Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          style={{ 
            marginTop: '-10px', 
            display: 'flex', 
            justifyContent: 'center' , 
            backgroundColor: '#f8f8f8', 
            zIndex: 999,
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px'
          }}
        />
      </div>
      {!isMediumScreen && (
        <div style={styles.detailsPanel}>
          <Typography variant="h6" style={styles.detailsTitle}>
            {selectedRow !== null ? '詳細信息' : '點擊詳細訊息查看'}
          </Typography>
          {selectedRow !== null && renderDetails(paginatedData[selectedRow])}
        </div>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      > 
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          刪除成功
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DashboardPage;
