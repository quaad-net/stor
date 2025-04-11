import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Slide from '@mui/material/Slide';
import { styled, alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import BasicModal from './BasicModal';
import ShowInstitution from './Institution';
import SelectAutoWidth from './SelectAutoWidth';
import FullScreenScanner from './FullScreenScanner';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Tasks from './Tasks';
import Labels from './Labels';

function HideOnScroll(props) {
  const { children, window } = props;
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

  const [queryType, setQueryType] = React.useState('binLoc');

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

    function AppBarTools(){
        const [query, setQuery] = React.useState('');
        const [anchorEl, setAnchorEl] = React.useState(null);
        const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);    
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

        const queryTypeSelections = [
          {value: 'binLoc', name: 'Loc'},
          {value: 'partCode', name: 'Code'},
          {value: 'descr', name: 'Descr'}
        ]

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
          </Menu>
        );
    
        const mobileMenuId = 'primary-search-account-menu-mobile';

        // Used for mobile menu modal.
        const modalBtnProps = {
          size: 'large',
          ariaLabel: 'show more',
          ariaControls: {mobileMenuId},
          ariaHasPopUp: 'true',
          color: 'inherit',
          // onClick: ()=>{}
        }

        function ModalMobileMenu(){ 
          return(
            <>
              <div style={{width: '250px', margin: 'auto'}}>
                <img src='stor-logo.svg' width='25px' style={{float: 'right'}}/>
                <div>
                  <div style={{display: 'flex'}}>
                    <IconButton
                      disableRipple
                      size="large" 
                      aria-label="sort" 
                      color="inherit" 
                      onClick={props.sort}>
                      <img src='/pulsar-sort.svg' width='25px'/>
                      <span style={{fontSize: '15px'}}>Sort</span>
                    </IconButton>
                    <IconButton
                      size="large"
                      aria-label="update inventory"
                      color="inherit"
                      onClick={()=>{
                        props.setUpdateInventory(true);
                      }}
                        >
                      <img src='/database-update.svg' width='25px' />
                      <span style={{fontSize: '15px'}}>Update</span>
                    </IconButton>
                  </div>
                  <div style={{display: 'flex'}}>
                    <IconButton 
                      disableRipple
                      size="large" 
                      aria-label="inventory details" 
                      color="inherit"
                      onClick={()=>{props.setUpdateInventory(false)}}
                    >
                      <img src='/info.svg' width='25px' />
                      <span style={{fontSize: '15px'}}>Details</span>
                    </IconButton>
                    <FullScreenScanner getScanResult={props.getScanResult} btnDescription={<span style={{fontSize: '15px'}}>Scan</span>}/>
                  </div>
                  <div style={{display: 'flex'}}>
                    <Tasks btnDescription={<span style={{fontSize: '15px'}}>Tasks</span>}/>
                    <Labels mobileView={true} queryRes={props?.partListItems}/>
                  </div>
                </div>
                <ShowInstitution btnDescription={<span style={{fontSize: '15px'}}>User</span>} mobileView={true}/>
              </div>
            </>
          )
       }

        return(
            <Box sx={{flexGrow: 1}}>
            <Toolbar className='inventory-appbar-tools'>
                <img id='stor-logo-header-logo' src='/stor-logo.svg' width='25px' style={{marginRight: '10px'}}/>
                <Search>
                  <SearchIconWrapper>
                      <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                      className='inventory-list-searchbox'
                      placeholder='Query...'
                      inputProps={{ 'aria-label': 'search' }}
                      
                      onKeyDown={(e)=>{
                        if(e.key === "Enter"){
                          setQuery(e.target.value.trim())
                          props.inventoryQuery({query: e.target.value?.trim(), queryType: queryType});
                        }
                      }}
                  />
                </Search>
                <SelectAutoWidth 
                  onSelectChange={setQueryType} 
                  menuItems={queryTypeSelections} 
                  selectionLabel='Type'
                  defaultSelection={queryType} 
                />
                <Box sx={{ flexGrow: 1}} />
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <ShowInstitution/>
                  <Tasks/>
                  <Labels queryRes={props?.partListItems}/>
                  <IconButton 
                    disableRipple
                    size="large" 
                    aria-label="sort" 
                    color="inherit" 
                    onClick={props.sort}>
                    <img src='/pulsar-sort.svg' width='25px'/>
                  </IconButton>
                  <IconButton
                    disableRipple
                    size="large"
                    aria-label="update inventory"
                    color="inherit"
                    onClick={()=>{props.setUpdateInventory(true)}}
                      >
                      <img src='/database-update.svg' width='25px' />
                  </IconButton>
                  <IconButton 
                    disableRipple
                    size="large" 
                    aria-label="inventory details" 
                    color="inherit" 
                    onClick={()=>{props.setUpdateInventory(false)}}
                  >
                    <img src='/info.svg' width='25px' />
                  </IconButton>
                  <FullScreenScanner getScanResult={props.getScanResult}/>
                </Box>
                {/*Mobile menubar */}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <BasicModal modalBtnProps={modalBtnProps} modalContent={<ModalMobileMenu/>}/>
                </Box>  
            </Toolbar>
              {/* {renderMobileMenu} */}
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
