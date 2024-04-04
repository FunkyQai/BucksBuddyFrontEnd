import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { logout } from '../actions/auth';
import { connect } from 'react-redux';
import axios from "axios";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem, InputBase } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const Navbar = ({ logout }) => {

  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [search, setSearch] = useState('');

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePortfolios = () => {
    navigate('/home');
  };

  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const searchAsset = async () => {
    try {
      await axios.get('http://localhost:8000/public/asset/', { params: { symbol: search } });
      navigate(`/asset-info/${search}`);
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <AppBar position="static" sx={{bgcolor: '#30798f'}}>
      <Container maxWidth="xl">
        <Toolbar >

          <Typography
            variant="h5"
            noWrap
            component="a"
            onClick={handlePortfolios}
            onMouseOver={(e) => e.target.style.cursor = 'pointer'}
            sx={{
              mr: 2,
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
             BucksBuddy 
          </Typography>
          

          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>

            <Button sx={{ my: 2, color: 'white', display: 'block', fontFamily: 'inherit', textTransform: 'none', fontSize: "1em" }} onClick={handlePortfolios}>
              Portfolios
            </Button>

            <Search onSubmit={searchAsset}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search asset"
                aria-label="Search"
                value={search}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && searchAsset()}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>

            <IconButton onClick={handleOpenUserMenu} sx={{ "margin": "5px" }}>
              <AccountCircle sx={{ fontSize: 35, color: "white" }} />
            </IconButton>

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleResetPassword} >
                <Typography>Reset Password</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography>
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(Navbar);