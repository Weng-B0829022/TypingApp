import React, { useState } from 'react';
import QuestionManagementPage from './AdminPages/QuestionManagementPage';
import DashboardPage from './AdminPages/DashboardPage';
import { 
  Box, 
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
  Paper,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LibraryAdd as LibraryAddIcon
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

const drawerWidth = 240;

const AdminPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const drawer = (
    <div>
      <Toolbar sx={{ backgroundColor: '#26A69A' }}>
        <Typography variant="h6" noWrap sx={{ color: 'white' }}>
          管理介面
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {[
          { text: '儀表板', icon: <DashboardIcon />, page: 'dashboard' },
          { text: '題目管理', icon: <LibraryAddIcon />, page: 'questions' }
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => setCurrentPage(item.page)}
              selected={currentPage === item.page}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#E0F2F1',
                  '&:hover': {
                    backgroundColor: '#B2DFDB',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: currentPage === item.page ? '#26A69A' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const renderDashboard = () => (
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

  const renderQuestions = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        題目管理
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" sx={{ mr: 2 }}>
          新增題目
        </Button>
        <Button variant="contained" color="secondary">
          刪除題目
        </Button>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#26A69A'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {currentPage === 'dashboard' ? '儀表板' : '題目管理'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {currentPage === 'dashboard' ? <DashboardPage/> : <QuestionManagementPage/>}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminPage;