import * as React from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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
    backgroundColor:  'rgb(22, 22, 22)' // grey[800]
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
  
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  React.useEffect(()=>{
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

  function SkeletonContent(){
    if(!props.updateInventory){
    return(
      <div style={{padding: '5px'}}>
        <div><strong>{props.listSelectionDetail?.description}</strong></div><br/>
        <div><strong>code:</strong> {props.listSelectionDetail?.code}</div>
        <div><strong>binLoc:</strong> {props.listSelectionDetail?.binLoc}</div>
        <div><strong>active:</strong> {props.listSelectionDetail?.active}</div>
        <div><strong>fy14Expn:</strong> {props.listSelectionDetail?.fy14Expn}</div>
        <div><strong>invtAvail:</strong> {props.listSelectionDetail?.invtAvail}</div>
        <div><strong>lastPODate:</strong> (props.listSelectionDetail?.lastPODate)</div>
        <div><strong>min:</strong> {props.listSelectionDetail?.min}</div>
        <div><strong>max:</strong> {props.listSelectionDetail?.max}</div>
        <div><strong>vendorName:</strong> {props.listSelectionDetail?.vendorName}</div>
        <div><strong>vendorNo:</strong> {props.listSelectionDetail?.vendorNo}</div>
        <div><strong>mfgNo:</strong> {props.listSelectionDetail?.mfgNo}</div>
      </div>
    )
    }
    else{
      return(<div>{props.updateInventoryCounts}</div>)
    }
  }

  function ReturnedResults(){
    return(
      <span>Returned {props.resultCount} Results</span>
    )
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
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography sx={{ p: 2, color: 'text.secondary' }}> <ReturnedResults/></Typography>
        </StyledBox>
        <StyledBox sx={{ px: 2, pb: 2, height: '100%', overflow: 'auto' }}>
          <div style={{backgroundColor: 'rgba(255, 255, 255, 0.044)'}}>{
            props.resultCount > 0 ? <SkeletonContent/> : <></>}
          </div>
        </StyledBox>
      </SwipeableDrawer>
    </Root>
    </ThemeProvider>
  );
}

// SwipeableEdgeDrawer.propTypes = {
//     // for iframe Only
//   window: PropTypes.func,
// };

export default SwipeableEdgeDrawer;
