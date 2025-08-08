import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Build, Preview, List } from '@mui/icons-material';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <AppBar position="static" sx={{ mb: 3, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          🍳 upliance.ai Form Builder
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<Build />}
            onClick={() => navigate('/create')}
            variant={isActive('/create') ? 'outlined' : 'text'}
            sx={{ 
              borderColor: isActive('/create') ? 'white' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Create
          </Button>
          
          <Button
            color="inherit"
            startIcon={<Preview />}
            onClick={() => navigate('/preview')}
            variant={isActive('/preview') ? 'outlined' : 'text'}
            sx={{ 
              borderColor: isActive('/preview') ? 'white' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Preview
          </Button>
          
          <Button
            color="inherit"
            startIcon={<List />}
            onClick={() => navigate('/myforms')}
            variant={isActive('/myforms') ? 'outlined' : 'text'}
            sx={{ 
              borderColor: isActive('/myforms') ? 'white' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            My Forms
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;