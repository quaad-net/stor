import { Fragment, forwardRef, useEffect, useState } from 'react';
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
import { ThemeProvider, createTheme } from '@mui/material';
import imgMap from '../../app/imgMap';
const aiUrl = import.meta.env.VITE_AI_URL;

import './PL2Labels.css'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PL2Labels(props) {
  const [open, setOpen] = useState(false);
  const [useCam, setUseCam] = useState(false);
  const [imgCaptured, setImgCaptured] = useState(false);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
    
  };

  const handleClose = () => {
    setOpen(false);
    if(useCam || imgCaptured){stopStream()};
    setUseCam(false);
    setImgCaptured(false);
  };

  function getPackingListImg(){
    const video = document.querySelector('#video');
    navigator.mediaDevices.getUserMedia({ video: true, facingMode: 'environment' })
      .then((stream) => {
        video.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing the camera:', error);
      });
  }

  function captureImg(){

    const canvas = document.querySelector('#canvas');
    const context = canvas.getContext('2d');
  
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setImgCaptured(true);
  }

  function sendImg(){
    const canvas = document.querySelector('#canvas');
    canvas.toBlob((blob) => {
      const newImg = document.createElement("img");
      const url = URL.createObjectURL(blob);
      newImg.src = url;
      document.querySelector('#img-src').appendChild(newImg); // For testing only.
      // WIP
      // Send caputured PL image to image server...
      // Make call to server process image...

      fetch(`${aiUrl}/stor-pl-img`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({imgUri: `getImgUri`})
      })
      .then((res)=>{return res.text()})
      .then((res)=>{console.log(res)})

      URL.revokeObjectURL(url);
    });
  }

  function stopStream(){
    try{
    const video = document.querySelector('#video');
    const stream = video.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });

    video.srcObject = null;
    }
    catch(err){
      console.log(err)
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
    <Fragment>
      <IconButton
        disableRipple
        size="large" 
        aria-label="PL" 
        color="inherit" 
        onClick={handleClickOpen}>
        <img 
          src= {imgMap.get('pulsar-purchase-order.svg')} 
          width={props?.qrImgWidth  || '25px'}
        />
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
              PL
            </Typography>
            {useCam ? 
            <>
              <Button id="capture" autoFocus color="inherit" onClick={()=>{
                captureImg();
                setUseCam(false);
              }}>
                CAPTURE
              </Button>
            </>
            :
            <></>
            }
            {!useCam ?
            <>
              <Button autoFocus color="inherit" onClick={()=>{
                setUseCam(true);
                setImgCaptured(false);
                getPackingListImg();
              }}>
                USE CAM
              </Button>
            </>
            :
            <></>
            }
            {imgCaptured ?
            <>
              <Button autoFocus color="inherit" onClick={()=>{
                sendImg();
              }}>
                DONE
              </Button>
            </>
            :
            <></>
            }
          </Toolbar>
        </AppBar>
        <List>
          <ListItemButton>
            <ListItemText primary='Take a snaphot of your packing list to create labels for its items...' />
          </ListItemButton>
          <Divider />
        </List>
        <div id='vid-container'{...(imgCaptured ? {style: {display: 'none'}}: {})}>
            <video id="video" width='100%' height='100%' autoPlay={useCam}></video>
        </div>
        <div id='canvas-container' {...(useCam ? {style: {display: 'none'}}: {})}>
          <canvas id="canvas"></canvas>
        </div>
        <div id='img-src' style={{display: 'none'}}>
        </div>
      </Dialog>
    </Fragment>
    </ThemeProvider>
  );
}