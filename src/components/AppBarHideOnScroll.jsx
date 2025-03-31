import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Slide from '@mui/material/Slide';

import { styled, alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import QrCodeIcon from '@mui/icons-material/QrCode';
// import PaginationRounded from './PaginationRounded';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function HideOnScroll(props) {
  const { children, window } = props;
  // Normally won't need to set the window ref as useScrollTrigger.
  // Will default to window.
  // For iframe only.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children ?? <div />}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element,
    // For iframe only
  window: PropTypes.func,
};

export default function AppBarHideOnScroll(props) {

    const darkTheme = createTheme({
      palette: {
        mode: 'dark',
      },
    });

    function AppBarTools(){
        const [query, setQuery] = React.useState('');
        const [anchorEl, setAnchorEl] = React.useState(null);
        const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
        const [binLocQuery, setBinLocQuery] = React.useState(true);
    
        const isMenuOpen = Boolean(anchorEl);
        const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    
        const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        };
    
        const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
        };
    
        const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
        };
    
        const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
        };

        const Search = styled('div')(({ theme }) => ({
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: alpha(theme.palette.common.white, 0.15),
            '&:hover': {
              backgroundColor: alpha(theme.palette.common.white, 0.25),
            },
            marginRight: theme.spacing(2),
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
              marginLeft: theme.spacing(3),
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
            '& .MuiInputBase-input': {
                padding: theme.spacing(1, 1, 1, 0),
                // vertical padding + font size from searchIcon
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                transition: theme.transitions.create('width'),
                width: '100%',
                [theme.breakpoints.up('md')]: {
                width: '20ch',
                },
            },
        }));

        const menuId = 'primary-search-account-menu';
        const renderMenu = (
          <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
              }}
              id={menuId}
              keepMounted
              transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
              }}
              open={isMenuOpen}
              onClose={handleMenuClose}
          >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>My account</MenuItem>
          </Menu>
        );
    
        const mobileMenuId = 'primary-search-account-menu-mobile';
        const renderMobileMenu = (
        <ThemeProvider theme={darkTheme}>
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >   
            {/* add click function <MenuItem onClick={onclick}> */}
            <MenuItem>
              <IconButton 
                size="large" 
                aria-label="sort" 
                color="inherit" 
                onClick={props.sort}>
                <SwapVertIcon/>
              </IconButton>
              {/* <span>Sort</span> */}
            </MenuItem>
            <MenuItem> 
            <IconButton
              size="large"
              aria-label="update inventory"
              color="inherit"
              onClick={()=>{props.setUpdateInventory(true)}}
                >
                <WarehouseIcon/>
            </IconButton>
            {/* <span>Update Inventory</span> */}
            </MenuItem>
            <MenuItem>
              <IconButton 
                size="large" 
                aria-label="quick inventory update" 
                color="inherit" 
              >
                <QrCodeIcon />
              </IconButton>
            </MenuItem>
            <MenuItem>
              <IconButton 
                size="large" 
                aria-label="inventory details" 
                color="inherit"
                onClick={()=>{props.setUpdateInventory(false)}}
              >
                <FormatListBulletedIcon />
              </IconButton>
            </MenuItem>
        </Menu>
        </ThemeProvider>
        );

        return(
            <Box sx={{flexGrow: 1}}>
            <Toolbar className='inventory-appbar-tools'>
                <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                STOR
                </Typography>
                <Search>
                  <SearchIconWrapper>
                      <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                      className='inventory-list-searchbox'
                      placeholder="Search…"
                      inputProps={{ 'aria-label': 'search' }}
                      
                      onKeyDown={(e)=>{
                        if(e.key === "Enter"){
                          setQuery(e.target.value.trim())
                          props.inventoryQuery({query: e.target.value?.trim(), queryType: binLocQuery ? 'binLoc': 'partCode'});
                        }
                      }}
                  />
                </Search>
                <input type='checkbox' 
                  defaultChecked={binLocQuery}
                  name='querytype' 
                  id='query-type' 
                  onClick={()=>setBinLocQuery(!binLocQuery)}/>
                <label htmlFor='querytype'>BinLoc</label>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  {/* <PaginationRounded/> */}
                  <IconButton 
                    size="large" 
                    aria-label="sort" 
                    color="inherit" 
                    onClick={props.sort}>
                      <SwapVertIcon/>
                  </IconButton>
                  <IconButton
                    size="large"
                    aria-label="warehouse"
                    color="inherit"
                    onClick={()=>{props.setUpdateInventory(true)}}
                      >
                      <WarehouseIcon/>
                  </IconButton>
                  <IconButton 
                    size="large" 
                    aria-label="quick inventory update" 
                    color="inherit" 
                  >
                    <QrCodeIcon />
                  </IconButton>
                  <IconButton 
                    size="large" 
                    aria-label="inventory details" 
                    color="inherit" 
                    onClick={()=>{props.setUpdateInventory(false)}}
                  >
                    <FormatListBulletedIcon />
                  </IconButton>
                </Box>
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <IconButton
                      size="large"
                      aria-label="show more"
                      aria-controls={mobileMenuId}
                      aria-haspopup="true"
                      onClick={handleMobileMenuOpen}
                      color="inherit"
                  >
                      <MoreIcon />
                  </IconButton>
                </Box>  
            </Toolbar>
              {renderMobileMenu}
              {renderMenu}
            </Box>
        )
    }
    
  return (
    <React.Fragment >
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar sx={{backgroundColor: 'rgb(22, 22, 22)'}}>
          <AppBarTools/>
        </AppBar>
      </HideOnScroll>
      {/* Utility to hide app bar */}
      <Toolbar />
      <Container>
        <Box sx={{ my: 2 }}>
        </Box>
      </Container>
      {/* End utility */}
    </React.Fragment>
  );
}
