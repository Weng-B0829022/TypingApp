import React, { useState, useRef, useEffect } from 'react';
import QuestionManagementPage from './AdminPages/QuestionManagementPage';
import DashboardPage from './AdminPages/DashboardPage';
import useApi from '../api/useApi';
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
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LibraryAdd as LibraryAddIcon
} from '@mui/icons-material';
import { QueryClient, QueryClientProvider } from 'react-query';

const drawerWidth = 240;

const AdminPage = () => {
  const { data, isCharacterLoading, errorCharacter, refetch } = useApi('api/characters', { enabled: false });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('a');
  const [password, setPassword] = useState('a');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
    } catch (err) {
      setError('帳號或密碼錯誤');
      setUsername('')
      setPassword('')
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (false) {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            管理頁面
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="名稱"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密碼"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : '登入'}
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex' , height:'100vh'}}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `100%` },
          ml: { sm: `100%` },
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
        sx={{ flexGrow: 1, p: 0, width: { sm: `100%`} ,backgroundColor: '#bbbbbb'}}
      >
        <Container maxWidth={false} sx={{ mt: 8, mb: 0, width:'100%', padding: 0 }}>
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'questions' && (isCharacterLoading ? <div>Loading...</div> : <QuestionManagementPage data = {data}/>)}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminPage;