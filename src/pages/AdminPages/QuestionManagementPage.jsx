import React, { useState, useCallback } from 'react';
import { 
  Button, 
  Typography,
  Box,
  Snackbar,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as XLSX from 'xlsx';

const QuestionManagementPage = () => {
  const [data, setData] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
  const [workbook, setWorkbook] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [displayMode, setDisplayMode] = useState('basic'); // 'basic' 或 'detail'

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        setWorkbook(wb);
        const sheetName = wb.SheetNames[0];
        const worksheet = wb.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log('工作表名稱:', wb.SheetNames);
        console.log('原始數據:', jsonData);

        if (jsonData.length === 0) {
          throw new Error('Excel 文件中沒有數據');
        }

        setSheetNames(wb.SheetNames);
        setData(jsonData);
        setCurrentSheetIndex(0);
        setSnackbarMessage(`成功載入 ${jsonData.length} 筆數據！`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('處理 Excel 檔案時發生錯誤:', error);
        setSnackbarMessage(error.message || '檔案格式錯誤，請確認上傳的是正確的 Excel 檔案');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    if (file) {
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const handleSheetChange = (event, newIndex) => {
    if (workbook && newIndex >= 0 && newIndex < sheetNames.length) {
      const worksheet = workbook.Sheets[sheetNames[newIndex]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
      setCurrentSheetIndex(newIndex);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // 計算基本信息的欄位分組
  const getBasicInfoColumns = useCallback((headers) => {
    const allColumns = headers.filter(header => !['學號', '姓名', '班級'].includes(header));
    const midPoint = Math.ceil(allColumns.length / 2);
    return {
      firstHalf: allColumns.slice(0, midPoint),
      secondHalf: allColumns.slice(midPoint)
    };
  }, []);

  // 添加一個新的輔助函數來檢查和處理可能的base64圖片
  const renderCell = (cell) => {
    // 檢查是否為 base64 圖片
    if (typeof cell === 'string') {
      // 檢查是否符合 base64 圖片格式：data:image/[type];base64,
      if (cell.match(/^data:image\/(jpeg|jpg|png|gif);base64,/)) {
        return (
          <img 
            src={cell} 
            alt="題目圖片" 
            style={{ 
              maxWidth: '25px', 
              maxHeight: '25px', 
              objectFit: 'contain' 
            }} 
          />
        );
      }
    }
    return cell;
  };

  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      {/* 上傳按鈕區域 */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column',  // 改為垂直排列
        gap: 2
      }}>
        {/* 第一列：上傳按鈕和已載入數據提示 */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2
        }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            上傳 Excel 檔案
            <input
              type="file"
              hidden
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
          </Button>
          {data.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              已載入 {data.length} 筆資料
            </Typography>
          )}
        </Box>

        {/* 第二列：工作表切換標籤 */}
        {sheetNames.length > 0 && (
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            width: '100%'
          }}>
            <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
              當前工作表：
            </Typography>
            <Tabs 
              value={currentSheetIndex}
              onChange={handleSheetChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                flex: 1,
                minHeight: '40px',
                '& .MuiTab-root': { minHeight: '40px' }
              }}
            >
              {sheetNames.map((name, index) => (
                <Tab 
                  key={index}
                  label={name}
                  sx={{
                    textTransform: 'none',
                    minHeight: '40px'
                  }}
                />
              ))}
            </Tabs>
          </Box>
        )}
      </Box>

      {/* 顯示數據表格 */}
      {data.length > 0 && (
        <Box sx={{ 
          mt: 3, 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          {displayMode === 'basic' ? (
            // 基本信息模式：單一表格
            <Box sx={{ width: '100%', overflow: 'auto' }}>
              <table style={{ 
                width: '100%',
                tableLayout: 'fixed',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((header, index) => (
                      <th key={index} style={{ 
                        padding: '12px 16px',
                        backgroundColor: '#f0f0f0',
                        borderBottom: '1px solid #e0e0e0'
                      }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <td key={cellIndex} style={{ 
                          padding: '12px 16px',
                          borderBottom: '1px solid #e0e0e0'
                        }}>
                          {renderCell(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          ) : (
            // 答題詳情模式：完整表格
            <Box sx={{ width: '100%', overflow: 'auto' }}>
              <table style={{ 
                width: '100%',
                tableLayout: 'fixed',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr>
                    {Object.keys(data[0]).map((header, index) => (
                      <th key={index} style={{ 
                        padding: '12px 16px',
                        backgroundColor: '#f0f0f0',
                        borderBottom: '1px solid #e0e0e0'
                      }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <td key={cellIndex} style={{ 
                          padding: '12px 16px',
                          borderBottom: '1px solid #e0e0e0'
                        }}>
                          {renderCell(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QuestionManagementPage;