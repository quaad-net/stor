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
import CircularIndeterminate from './Progress';
import BasicMessageModal from './BasicMessageModal';
import SelectAutoWidth from './SelectAutoWidth';
import imgMap from '../../app/imgMap';
const aiUrl = import.meta.env.VITE_AI_URL;
const apiUrl = import.meta.env.VITE_API_URL;

import './PL2Labels.css';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PL2Labels(props) {
  const [loading, setLoading] = useState(false);
  const [imgCaptured, setImgCaptured] = useState(false);
  const [imgSent, setImgSent] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(<></>);
  const [open, setOpen] = useState(false);
  const [useCam, setUseCam] = useState(false);
  const [warehouse, setWarehouse] = useState(7032);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const warehouseSelections = [
    // name: as it appears to user
    {value: 7032, name: 'Mech NWQ'},
    {value: 5032, name: 'Plumb NWQ'},
    {value: 2032, name: 'Elect NWQ'}
  ]

  const handleClickOpen = () => {
    setOpen(true);
    
  };

  const handleClose = () => {
    setOpen(false);
    if(useCam || imgCaptured){stopStream()};
    setUseCam(false);
    setImgCaptured(false);
    setModalContent(<></>);
    setModalOpen(false);
  };

  function getPackingListImg(){
    const video = document.querySelector('#video');
    const constraints = {
      audio: false,
      video: {facingMode: { ideal: 'environment' }}
    };
    
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        video.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing the camera:', error);
      });
  }

  function captureImg(){

    const video = document.querySelector('#video');
    const canvas = document.querySelector('#canvas');
    const context = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height); 
    setImgCaptured(true);
  }

  async function sendImg(){
    try{
      const canvas = document.querySelector('#canvas');
      const imageData = canvas.toDataURL('image/jpeg');
      canvas.textContent = '';

      await fetch(`${aiUrl}/stor-pl-img`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({img: imageData.split(',')[1], user: props.user.email, token: props.token, warehouse: warehouse})
        }
      )
      .then((res)=>{
        console.log(res)
        return res.json()
      })
      .then((res)=>{
        if(res.message.length > 50){
          const content = res.message.substring(0, 50) + '...';
          setModalContent(<span>{content}</span>);
        }
        else if(res.message == 'Complete'){
          setModalContent(<span>Items have been added to print jobs.</span>)
        }
        else{
          setModalContent(<span>{res.message}</span>);
          console.log(res);
        };
        setModalOpen(true);
      })

      stopStream();
      setUseCam(false);
      setImgCaptured(false);
      setLoading(false);
      setImgSent(true);
    }
    catch(err){
      console.log(err)
      setUseCam(false);
      setImgCaptured(false);
      setLoading(false);
      setImgSent(true);
      if(err.message.length > 50){
        const content = err.message.substring(0, 50) + '...';
        setModalContent(<span>{content}</span>);
      }
      else{
        setModalContent(<span>{err.message}</span>)
      }
      setModalOpen(true)
    }

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
            width={'25px'}
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
                {imgCaptured && !imgSent ? '' : 'PL'} 
              </Typography>
              {imgCaptured && !imgSent ?
                <div style={{marginRight: 20}}>
                  <SelectAutoWidth 
                    onSelectChange={setWarehouse} 
                    menuItems={warehouseSelections} 
                    selectionLabel='Ware'
                    defaultSelection={warehouse} 
                  />
                </div>
                :
                <></>
              }
              {!loading ?
                <>
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
                    setImgSent(false);
                    setUseCam(true);
                    setImgCaptured(false);
                    getPackingListImg();
                  }}>
                    {imgCaptured ? <>RETRY</> : <>USE CAM</>}
                  </Button>
                </>
                :
                <></>
                }
                {imgCaptured ?
                <>
                  <Button autoFocus color="inherit" onClick={()=>{
                    sendImg();
                    setLoading(true);
                  }}>
                    DONE
                  </Button>
                </>
                :
                <></>
                }
                </>
              :
                <CircularIndeterminate size={15}/>
              }
            </Toolbar>
          </AppBar>
          <List>
            <ListItemButton disabled>
              <ListItemText primary={loading ? 'Fetching Data...' : 'Take a snaphot of your packing list or invoice to create labels...'} />
            </ListItemButton>
            <Divider />
          </List>
          <div id='vid-container'{...(imgCaptured ? {style: {display: 'none'}}: {})}>
              <video id="video" width='100%' height='100%' autoPlay={useCam}></video>
          </div>
          {!imgSent ?
            <div id='canvas-container' {...(useCam ? {style: {display: 'none'}}: {style: {width: 'fit-content'}})}>
              <canvas id="canvas"></canvas>
            </div>
            :
            <></>
          }
        </Dialog>
      </Fragment>
      <BasicMessageModal setModalOpen={setModalOpen} modalOpen={modalOpen} modalContent={modalContent} />
    </ThemeProvider>
  );
}