import { Fragment, forwardRef, memo, useEffect, useState, useMemo} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Scanner } from '@yudiel/react-qr-scanner';
import { ThemeProvider, createTheme } from '@mui/material';
import imgMap from '../../app/imgMap';

import './FullScreenScanner.css'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenScanner = memo(function FullScreenScanner(props) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [scanResult, setScanResult] = useState('0000000');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  useEffect(()=>{
    // Will automatically use scan result if a location or login QR has been scanned.
    // Else scanned result is shown to user to take action.
    const locQR = /locQR/
    const login = /@/
    if(locQR.test(scanResult) || login.test(scanResult) ){
      if(props?.setLoading != undefined){props.setLoading(true)}
      props.getScanResult(scanResult)
      setScanResult("0000000");
      handleClose();
    }
  },[scanResult])

  function NewScan(props){

    function Cam(){
        return (
            <>
              <Scanner 
                onScan={(result)=>{
                  setScanResult(result[0].rawValue)
                }}
                onError={(error)=>{console.log(error)}}
                styles={{ width: '100%'}}
                constraints={{facingMode: {ideal: 'environment' }}}
                formats={['any']}
              />
            </>
          )
    }

    return(
        <>{props.displayCam ? <Cam/> : <></>}</>
    )
  }

  return (
    <ThemeProvider theme={darkTheme}>
    <Fragment>
      <IconButton
        disableRipple
        size="large" 
        aria-label="query by qr-scan" 
        color="inherit" 
        onClick={handleClickOpen}>
        {useMemo(()=>{
          return (
            <img 
              src={imgMap.get('pulsar-qr.svg')} 
              width={props?.qrImgWidth  || '25px'}
            />
          )
        })}
        {props?.btnDescription || <></>}
      </IconButton>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        slots={{transition: Transition}}
        sx={{'& .MuiPaper-root': {backgroundColor: 'black'}}}
      >
        <AppBar sx={{ position: 'relative'}}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              QR Scanner
            </Typography>
            <Button autoFocus color="inherit" onClick={()=>{
              if(props?.setLoading != undefined){props.setLoading(true)};
              props.getScanResult(scanResult);
              setScanResult("0000000");
              handleClose();
            }}>
              USE RESULT
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItemButton>
            <ListItemText primary={scanResult} secondary="Scan Result" />
          </ListItemButton>
          <Divider />
        </List>
        <div className='fullscreen-scanner'>
        <NewScan displayCam={true}/>
        </div>
      </Dialog>
    </Fragment>
    </ThemeProvider>
  );
})

export default FullScreenScanner