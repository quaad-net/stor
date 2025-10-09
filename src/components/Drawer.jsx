import { useState, useEffect } from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import imgMap from '../../app/imgMap';
import './Drawer.css';

const drawerBleeding = 56;

const darkTheme = createTheme({
    palette: {
    mode: 'dark',
    },
});

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: grey[100],
  ...theme.applyStyles('dark', {
    backgroundColor: (theme.vars || theme).palette.background.default,
  }),
}));

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: 'rgb(22, 22, 22)',
  ...theme.applyStyles('dark', {
    backgroundColor:  'rgb(22, 22, 22)' 
  }),
}));

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
  ...theme.applyStyles('dark', {
    backgroundColor: grey[900],
  }),
}));

function SwipeableEdgeDrawer(props) {
  
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  useEffect(()=>{
    
    const verts = document.querySelectorAll('.list-vert'); 
    verts.forEach((vert)=>{
        vert.addEventListener('click', ()=>{
        setOpen(true)
        });
    })
    return verts.forEach((vert)=>{
      vert.addEventListener('click', ()=>{
        setOpen(true)
      });
    })
  })

  function ReturnedResults(){
    //Modify to show number of returned results in drawer.
    if(open && props.updateInventory){
      return (
        <>
          <span>&nbsp;</span>
        </>
      )
    }
    else{
      return(
        <>
        <span>&nbsp;</span>
        </>
      )
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />
      <SwipeableDrawer 
        className='inventory-mobile-drawer'
        // container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        keepMounted
      >
        <StyledBox
          className='inventory-mobile-drawer-styled-box'
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'collaspe',
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography sx={{ p: 2, color: 'text.secondary' }}> <ReturnedResults/></Typography>
        </StyledBox>
        <StyledBox sx={{ px: 2, pb: 2, height: '100%', overflow: 'auto' }}>
          <div 
            {...!props.updateInventory ? {
              style: {
                backgroundColor: 'rgba(255, 255, 255, 0.044)',
                background: `url(${imgMap.get('open-hex-2.svg')}) no-repeat`,
                backgroundPosition: '75px 75px',
                backgroundSize: '300px',
                backgroundAttachment: 'scroll',
              }
            }: {}}
          >
            {props.resultCount > 0 ? props.InventoryDetailContent : <></>}
          </div>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
    </ThemeProvider>
  );
}

export default SwipeableEdgeDrawer;
