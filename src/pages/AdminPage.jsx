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
          { text: '統計資料', icon: <DashboardIcon />, page: 'dashboard' },
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
            {currentPage === 'dashboard' ? '統計資料' : '題目管理'}
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
        sx={{ flexGrow: 1, pt: 4, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Container maxWidth="lg" sx={{ mt: 4 , mb: 0 }}>
          {currentPage === 'dashboard' && <DashboardPage/>}
          {currentPage === 'questions' && <QuestionManagementPage/>}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminPage;