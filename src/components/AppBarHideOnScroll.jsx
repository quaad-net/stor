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
import MoreModal from './MoreModal';
import ShowInstitution from './Institution';
import SelectAutoWidth from './SelectAutoWidth';
import FullScreenScanner from './FullScreenScanner';
import Tasks from './Tasks';
import Labels from './Labels';
import Pag from './Pag';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import FilterListIcon from '@mui/icons-material/FilterList';
import SyntaxHelper from './SyntaxHelper';
import SessionReorder from './SessionReorder';
import imgMap from '../../app/imgMap';

function HideOnScroll(props) {
  const { children, window } = props;
  // Will default to window.
  // IFr 
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
    // IFr
  window: PropTypes.func,
};

export default function AppBarHideOnScroll(props) {

  const [queryType, setQueryType] = React.useState('binLoc');


    function AppBarTools(){
        const [query, setQuery] = React.useState('');
        const [anchorEl, setAnchorEl] = React.useState(null);
        const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);    
        const isMenuOpen = Boolean(anchorEl);
    
        const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
        };
    
        const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
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
          
        const StyledInputBase = styled(InputBase)(({ theme }) => ({
            color: 'inherit',
            '& .MuiInputBase-input': {
                padding: theme.spacing(1, 1, 1, 0),
                paddingLeft: '5px',
                transition: theme.transitions.create('width'),
                width: '100%',
                [theme.breakpoints.up('md')]: {
                width: '20ch',
                },
            },
        }));

        const menuId = 'primary-search-account-menu';

        const queryTypeSelections = [
          //Name : as it appears to user
          {value: 'binLoc', name: 'Loc'},
          {value: 'partCode', name: 'Code'},
          {value: 'descr', name: 'Descr'},
          props.filterOn ? {value: 'ware', name: 'Ware'} : {}
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

        // For mobile menu modal.
        const modalBtnProps = {
          ariaLabel: 'show more',
          ariaControls: {mobileMenuId},
          ariaHasPopUp: 'true',
          color: 'inherit',
        }

        function ModalMobileMenu(){ 
          return(
            <>
              <div style={{width: 'fit-content', height: '200px', margin: 'auto', overflowY: 'auto', scrollbarWidth: 'thin'}}>
                <div style={{width: 'fit-content', margin: 'auto'}}>
                  <SyntaxHelper mobileMenu />
                  <span style={{color: 'gray'}}>QryHelp</span>
                </div>
                <div style={{width: 'fit-content', margin:'auto'}}>-----</div>
                <IconButton
                  disableRipple
                  size="large" 
                  aria-label="sort" 
                  color="inherit" 
                  onClick={props.sort}>
                  <img src={imgMap.get('pulsar-sort.svg')} width='25px'/>
                  <span style={{fontSize: '15px'}}>Sort</span>
                </IconButton><br/>
                <Pag pagIdxMax={props?.pagIdxMax} 
                  displayPage={props?.displayPage} 
                  currentPage={props?.currentPage} 
                  btnDescription={<span style={{fontSize: '15px'}}>Page</span>} 
                />
                <IconButton
                  disableRipple
                  size="large"
                  aria-label="update inventory"
                  color="inherit"
                  onClick={()=>{
                    props.setUpdateInventory(true);
                  }}
                    >
                  <img src={imgMap.get('database-update.svg')} width='25px' />
                  <span style={{fontSize: '15px'}}>Update</span>
                </IconButton><br/>
                <IconButton 
                  disableRipple
                  size="large" 
                  aria-label="inventory details" 
                  color="inherit"
                  onClick={()=>{props.setUpdateInventory(false)}}
                >
                  <img src={imgMap.get('info.svg')} width='25px' />
                  <span style={{fontSize: '15px'}}>Details</span>
                </IconButton><br/>
                <Tasks btnDescription={<span style={{fontSize: '15px'}}>Tasks</span>}/>
                <Labels mobileView={true} queryRes={props?.partListItems} pagListItems={props?.pagListItems}/>
                {props.sessionOrds.length > 0 ?
                <>
                <SessionReorder 
                  sessionOrds={props.sessionOrds} 
                  setSessionOrds={props.setSessionOrds}
                  btnDescription={<span style={{fontSize: '15px'}}>Orders</span>}
                />
                </>
                :
                <></>
                }
                <ShowInstitution btnDescription={<span style={{fontSize: '15px'}}>User</span>} mobileView={true}/>
              </div>
            </>
          )
       }

        return(
            <Box sx={{flexGrow: 1}}>
            <Toolbar className='inventory-appbar-tools'>
                <SyntaxHelper />
                <Search>
                  <StyledInputBase
                      className='inventory-list-searchbox'
                      placeholder={props.filterOn? 'Filter...' : 'Query...'}
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
                <IconButton size='small' onClick={()=>{
                  if(props.filterOn){ //User is turning filter off on click.
                    if(props.unfilteredPartListItems.length > 30){  // Needs to be paginated.
                      props.setPagIdxMax(Math.ceil((props.unfilteredPartListItems.length / 30).toFixed(1)));
                      props.setPagListItems(props.unfilteredPartListItems);
                      props.paginate(props.unfilteredPartListItems, 1); // Function will setPartListItems
                    }
                    else{
                        props.setPartListItems(props.unfilteredPartListItems);
                        props.setPagIdxMax(1);
                        props.setPagListItems([]);
                    }
                    props.setIdx(0);
                    props.getUsageData(props.unfilteredPartListItems[0].code, props.unfilteredPartListItems[0].warehouseCode);
                  };
                  props.setfilterOn(!props.filterOn);
                }}>
                  {props.filterOn ? <FilterListOffIcon sx={{color: 'white'}}/> : <FilterListIcon sx={{color: 'white'}}/>}
                </IconButton>
                <FullScreenScanner getScanResult={props.getScanResult} qrImgWidth='20px'/>
                {/* Tablet and desktop menu items. */}
                <Box sx={{ flexGrow: 1}} />
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  {props?.pagIdxMax > 1 ?
                  <div>
                    <Pag pagIdxMax={props?.pagIdxMax} displayPage={props?.displayPage} currentPage={props?.currentPage} />
                    <div style={{fontSize: '10px', textAlign: 'center'}}>Page</div>
                  </div>
                  :
                  <></>
                  }
                  <div>
                    <IconButton 
                      disableRipple
                      size="large" 
                      aria-label="sort" 
                      color="inherit" 
                      onClick={props.sort}>
                      <img src={imgMap.get('pulsar-sort.svg')} width='25px'/>
                    </IconButton>
                    <div style={{fontSize: '10px', textAlign: 'center'}}>Sort</div>
                  </div>
                  <div>
                    <Tasks/>
                    <div style={{fontSize: '10px', textAlign: 'center'}}>Tasks</div>
                  </div>
                  <div>
                    <Labels queryRes={props?.partListItems} pagListItems={props?.pagListItems}/>
                    <div style={{fontSize: '10px', textAlign: 'center'}}>Label</div>
                  </div>
                  <div>
                    <IconButton
                      disableRipple
                      size="large"
                      aria-label="update inventory"
                      color="inherit"
                      onClick={()=>{props.setUpdateInventory(true)}}
                        >
                        <img src={imgMap.get('database-update.svg')} width='25px' />
                    </IconButton>
                    <div style={{fontSize: '10px', textAlign: 'center'}}>Update</div>
                  </div>
                  <div>
                    <IconButton 
                      disableRipple
                      size="large" 
                      aria-label="inventory details" 
                      color="inherit" 
                      onClick={()=>{props.setUpdateInventory(false)}}
                    >
                      <img src={imgMap.get('info.svg')} width='25px' />
                    </IconButton>
                    <div style={{fontSize: '10px', textAlign: 'center'}}>Info</div>
                  </div>
                  {props.sessionOrds.length > 0 ?
                  <div>
                    <SessionReorder 
                      sessionOrds={props.sessionOrds} 
                      setSessionOrds={props.setSessionOrds}
                    />
                    <div style={{fontSize: '10px', textAlign: 'center'}}>Orders</div>
                  </div>
                  :
                  <></>
                  }
                  <div>
                    <ShowInstitution/>
                    <div style={{fontSize: '10px', textAlign: 'center'}}>User</div>
                  </div>
                </Box>
                {/*Mobile Menu */}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <MoreModal modalBtnProps={modalBtnProps} modalContent={<ModalMobileMenu/>}/>
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
