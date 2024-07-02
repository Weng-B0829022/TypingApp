import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Box 
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

// 模擬數據
const userStats = {
  totalUsers: 1000,
  activeUsers: 750,
  averageScore: 85
};

const questionStats = {
  totalQuestions: 500,
  categories: ['字形', '詞義', '句型', '閱讀理解']
};

const pieData = [
  { name: '簡單', value: 30 },
  { name: '中等', value: 50 },
  { name: '困難', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const DashboardPage = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>
            用戶統計
          </Typography>
          <Typography>總用戶數：{userStats.totalUsers}</Typography>
          <Typography>活躍用戶：{userStats.activeUsers}</Typography>
          <Typography>平均分數：{userStats.averageScore}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>
            題目統計
          </Typography>
          <Typography>總題目數：{questionStats.totalQuestions}</Typography>
          <Typography variant="subtitle1">題目類別：</Typography>
          <List dense>
            {questionStats.categories.map((category, index) => (
              <ListItem key={index}>
                <ListItemText primary={category} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" gutterBottom>
            難度分佈
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <Box mt={2}>
            {pieData.map((entry, index) => (
              <Typography key={index} variant="body2">
                {entry.name}: {entry.value}%
              </Typography>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default DashboardPage;