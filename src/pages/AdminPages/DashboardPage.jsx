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
  Alert,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import DeleteConfirmationRow from './components/DeleteConfirmationRow';
import styles from './styles/QuestionManagementPage_styles';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';

const ITEMS_PER_PAGE = 50; // 每页显示的项目数

const DashboardPage = () => {
  const [data, setData] = useState([]);
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
  const [loading, setLoading] = useState(true);

  const filteredData = useMemo(() => {
    return data.filter(item => 
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.researchCode.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (grade ? item.details.wordBank === grade : true) &&
      (difficulty ? item.details.difficulty === difficulty : true)
    );
  }, [searchTerm, grade, difficulty, data]);

  const paginatedData = useMemo(() => {
    console.log(filteredData);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, page]);

  const handleGradeChange = useCallback((newGrade) => {
    setGrade(prevGrade => prevGrade === newGrade ? '' : newGrade);
    setPage(1);                   //  重置頁碼
    setDeleteConfirmation(null);  //  關閉刪除確認列
    setSelectedRow(null);           //  關閉詳細信息列
  }, []);

  const handleDifficultyChange = useCallback((newDifficulty) => {
    setDifficulty(prevDifficulty => prevDifficulty === newDifficulty ? '' : newDifficulty);
    setPage(1);                   //  重置頁碼
    setDeleteConfirmation(null);  //  關閉刪除確認列
    setSelectedRow(null);           //  關閉詳細信息列
  }, []);

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value);
    setPage(1);                   //  重置頁碼
    setDeleteConfirmation(null);  //  關閉刪除確認列
    setSelectedRow(null);           //  關閉詳細信息列
  }, []);

  const toggleDetails = useCallback(async (index, id) => {
    setSelectedRow(prevSelectedRow => prevSelectedRow === index ? null : index);
    setDeleteConfirmation(null);
    
    // 获取答题内容
    const result = await fetchQuizResultsByID(id);
    console.log(result);
    
    // 创建新的数据数组以确保状态更新
    setData(prevData => {
      const newData = [...prevData];
      const itemIndex = newData.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        newData[itemIndex] = {
          ...newData[itemIndex],
          details: { ...newData[itemIndex].details, ...result }
        };
      }
      return newData;
    });
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleDelete = useCallback((index) => {
    setSelectedRow(null);
    setDeleteConfirmation(prevIndex => prevIndex === index ? null : index);
  }, []);

  const deleteQuizResult = useCallback(async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/quizResults/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      throw error;
    }
  }, []);

  const confirmDelete = useCallback(async (item) => {
    try {
      await deleteQuizResult(item.id);
      setData(prevData => prevData.filter(dataItem => dataItem !== item));
      setDeleteConfirmation(null);
      setSelectedRow(null);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('删除失败:', error);
      // 可以添加错误提示
      alert('删除失败，请稍后重试');
    }
  }, [deleteQuizResult]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const renderDetails = useCallback((item) => (
    item && 
    <Box sx={{ margin: 1, textAlign: 'left' }}>
      {/* 基本信息部分 */}
      <Typography variant="h6" gutterBottom>詳細答題情況</Typography>
      <Typography><strong>姓名:</strong> {item.name}</Typography>
      <Typography><strong>研究代號:</strong> {item.researchCode}</Typography>
      <Typography><strong>字庫:</strong> {item.details.wordBank}</Typography>
      <Typography><strong>難易度:</strong> {item.details.difficulty}</Typography>
      <Typography><strong>題目數:</strong> {item.details.questionCount}</Typography>
      <Typography><strong>反饋模式:</strong> {item.details.mode || '未設定'}</Typography>
      <Typography><strong>題型:</strong> {item.details.question_format}</Typography>
      <Typography><strong>注音類型:</strong> {item.details.pronunciation_type}</Typography>
      <Typography><strong>答題時機:</strong> {item.details.answer_timing}</Typography>
      <Typography><strong>錯題重試:</strong> {item.details.is_retry_incorrect}</Typography>
      <Typography><strong>錯題處理:</strong> {item.details.error_retry}</Typography>
      <Typography><strong>詳細設置:</strong> {item.details.additionalSettings}</Typography>
      
      {/* 答題詳情部分 */}
      {item.details.questions && item.details.answerInfo && (
        <>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>答題詳情</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'start', width: '100%', overflowX: 'auto' }}>
            <TableContainer component={Paper} style={{minWidth: '800px'}}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>題目</TableCell>
                    <TableCell>目標字</TableCell>
                    {item.details.question_format === '是非題' && (
                      <TableCell>圖片</TableCell>
                    )}
                    {item.details.question_format === '二選一選擇題' && (
                      <>
                        <TableCell>選項0/選項1</TableCell>
                      </>
                    )}
                    <TableCell>注音</TableCell>
                    <TableCell>學生答案</TableCell>
                    <TableCell>正確答案</TableCell>
                    <TableCell>結果</TableCell>
                    <TableCell>反應時間(ms)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {item.details.questions.map((question, index) => (
                    <TableRow key={index}>
                      <TableCell>{question.text}</TableCell>
                      <TableCell>{question.target || question.tar}</TableCell>
                      {item.details.question_format === '是非題' && (
                        <TableCell>
                          {item.details.answerInfo[index].display && (
                            <img 
                              src={item.details.answerInfo[index].display}
                              alt="題目圖片"
                              style={{ 
                                width: '30px',
                                height: '30px',
                                objectFit: 'contain'
                              }}
                            />
                          )}
                        </TableCell>
                      )}
                      {item.details.question_format === '二選一選擇題' && (
                        <TableCell>
                          {(() => {
                            const options = [...item.details.questions[index].options];
                            if (item.details.answerInfo[index].correctAnswer === 1) {
                              options.reverse();
                            }
                            return options.map((option, optIndex) => (
                              <img 
                                key={optIndex}
                                src={option}
                                alt="題目圖片"
                                style={{ 
                                  width: '30px',
                                  height: '30px',
                                  objectFit: 'contain'
                                }}
                              />
                            ));
                          })()}
                        </TableCell>
                      )}
                      <TableCell>{question.zhuyin}</TableCell>
                      <TableCell>{item.details.answerInfo[index].userAnswer}</TableCell>
                      <TableCell>{item.details.answerInfo[index].correctAnswer}</TableCell>
                      <TableCell style={{color: item.details.answerInfo[index].userAnswer === item.details.answerInfo[index].correctAnswer ? 'green' : 'red'}}>{
                        item.details.answerInfo[index].userAnswer === item.details.answerInfo[index].correctAnswer ? '正確' : '錯誤'
                        }</TableCell>
                      <TableCell>{item.details.answerInfo[index].reactionTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}
    </Box>
  ), []);
  const fetchQuizResultsByID = useCallback(async (id) => {
    const response = await fetch(`http://localhost:5001/api/quizResults/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const result = await response.json();
    return result;
  }, []);
  // 獲取測驗結果數據
  const fetchQuizResults = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/quizResults', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const results = await response.json();
      console.log(results);
      // 將 API 數據轉換為需要的格式
      const formattedData = results.map(result => ({
        name: result.name || '未命名',
        researchCode: result.research_code || '-',
        time: new Date(result.created_at).toLocaleString('zh-TW'),
        correctNtotal: result.answerInfo.filter((q) => q.userAnswer === q.correctAnswer).length + '/' + result.answerInfo.length,
        accuracy: Math.round((result.answerInfo.filter((q) => q.userAnswer === q.correctAnswer).length / result.answerInfo.length) * 100) + '%',
        id: result.id,
        details: {
          wordBank: `${result.grade}`,
          difficulty: result.level,
          questionCount: result.number,
          feedbackMode: getAnswerMode(result.answer_timing),
          additionalSettings: getAdditionalSettings(result)
        }
      }));

      setData(formattedData);
    } catch (error) {
      console.error('獲取數據失敗:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 首次加載時獲取數據
  useEffect(() => {
    fetchQuizResults();
  }, [fetchQuizResults]);

  const getAnswerMode = (timing) => {
    const modes = {
      immediate: '立即反饋',
      delayed: '答題後反饋',
      none: '無反饋'
    };
    return modes[timing] || '未設定';
  };

  const getAdditionalSettings = (result) => {
    const settings = [];
    if (result.start_countdown) settings.push(`倒計時: ${result.start_countdown}秒`);
    if (result.que_intervel) settings.push(`間隔: ${result.que_intervel}秒`);
    if (result.is_retry_incorrect) settings.push('允許重試錯題');
    return settings.join(', ') || '無特殊設置';
  };

  // 使用 useEffect 来处理过滤后数据变化时的逻辑
  useEffect(() => {
    if (filteredData.length > 0 && (page - 1) * ITEMS_PER_PAGE >= filteredData.length) {
      setPage(1);
    }
  }, [filteredData, page]);

  const exportToExcel = useCallback(async (item) => {
    try {
      const result = await fetchQuizResultsByID(item.id);
      
      // 准备基本信息
      const basicInfo = {
        '姓名': item.name,
        '研究代號': item.researchCode,
        '時間': item.time,
        '字庫': result.wordBank,
        '難易度': result.level,
        '題目數': result.number,
        '正確數/總題數': item.correctNtotal,
        '正確率': item.accuracy,
        '反饋模式': result.mode || '未設定',
        '題型': result.question_format,
        '注音類型': result.pronunciation_type,
        '答題時機': result.answer_timing,
        '錯題重試': result.is_retry_incorrect ? '是' : '否',
        '錯題處理': result.error_retry,
        '開始倒數': result.start_countdown,
        '題目間隔': result.que_intervel,
        '允許重試錯題': result.is_retry_incorrect ? '是' : '否',
      };

      // 修改答题详情数据，加入图片和选项信息
      const answerDetails = result.questions.map((question, index) => {
        let imageInfo = '';
        if (result.question_format === '是非題' && result.answerInfo[index].display) {
          imageInfo = result.answerInfo[index].display;
        } else if (result.question_format === '二選一選擇題' && question.options) {
          // 修改这里：确保两个选项都被记录
          const options = [...question.options];
          if (result.answerInfo[index].correctAnswer === 1) {
            options.reverse();
          }
          imageInfo = options.join('\n'); // 使用换行符分隔两个图片URL
        }

        return {
          '題目': question.text,
          '目標字': question.target || question.tar,
          '注音': question.zhuyin,
          '圖片/選項0': result.question_format === '二選一選擇題' ? imageInfo.split('\n')[0] : imageInfo,
          '圖片/選項1': result.question_format === '二選一選擇題' ? imageInfo.split('\n')[1] : '',
          '學生答案': result.answerInfo[index].userAnswer,
          '正確答案': result.answerInfo[index].correctAnswer,
          '結果': result.answerInfo[index].userAnswer === result.answerInfo[index].correctAnswer ? '正確' : '錯誤',
          '反應時間(ms)': result.answerInfo[index].reactionTime
        };
      });

      // 创建工作簿
      const wb = XLSX.utils.book_new();
      
      // 添加基本信息工作表
      const basicWS = XLSX.utils.json_to_sheet([basicInfo]);
      XLSX.utils.book_append_sheet(wb, basicWS, "基本信息");
      
      // 添加答题详情工作表
      const detailsWS = XLSX.utils.json_to_sheet(answerDetails);
      XLSX.utils.book_append_sheet(wb, detailsWS, "答題詳情");
      
      // 导出文件
      XLSX.writeFile(wb, `測驗結果_${item.name}_${item.researchCode}.xlsx`);
    } catch (error) {
      console.error('導出失敗:', error);
      alert('導出失敗，請稍後重試');
    }
  }, [fetchQuizResultsByID]);

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
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>姓名</TableCell>
                  <TableCell>研究代號</TableCell>
                  <TableCell>時間</TableCell>
                  <TableCell>正確數/總題數</TableCell>
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
                      <TableCell sx={{borderBottom: 'none'}}>{item.correctNtotal}</TableCell>
                      <TableCell sx={{borderBottom: 'none'}}>{item.accuracy}</TableCell>
                      <TableCell sx={{borderBottom: 'none'}}>
                        <Button 
                          onClick={() => toggleDetails(index, item.id)}
                          color="primary"
                          sx={{
                            padding: isMediumScreen ? '2px' : '8px'
                          }}
                        >
                          {selectedRow === index ? '隱藏詳情' : '查看詳情'}
                        </Button>
                        <IconButton 
                          aria-label="download"
                          onClick={() => exportToExcel(item)}
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
                          <DownloadIcon />
                        </IconButton>
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
                        <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                          <Collapse in={deleteConfirmation === index} timeout="auto" unmountOnExit>
                            <DeleteConfirmationRow
                              index={index}
                              onConfirm={() => confirmDelete(item)}
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
          )}
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
            padding: '3px',
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
