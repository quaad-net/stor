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
import { Scanner } from '@yudiel/react-qr-scanner';
import { ThemeProvider, createTheme } from '@mui/material';
import imgMap from '../../app/imgMap';
import Alert from '@mui/material/Alert';
import BasicMessageModal from './BasicMessageModal';
import CustomContentFormModal from './CustomContentFormModal';
import useUserData from '../../app/useUserData';
import Styled from '@emotion/styled';
import useToken from '../../app/useToken';

import './FullScreenScanner.css'
import CircularIndeterminate from './Progress';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function QuickCount(props) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [scanResult, setScanResult] = useState('- - - -');
  const [prompt, setPrompt] = useState("Scan a location QR.");
  const [location, setLocation] = useState("");
  const [partDescr, setPartDescr] = useState("");
  const [binLoc, setBinLoc] = useState("");
  const [basicMessageModalOpen, setBasicMessageModalOpen] = useState(false);
  const [basicMessageModalContent, setBasicMessageModalContent] = useState("");
  const { token } = useToken();
  const [parts, setParts] = useState([]);
  const [activePart, setActivePart] = useState({});
  const [completedCount, setCompletedCount] = useState(false);

  const { userData } = useUserData();
  const user = JSON.parse(userData);

  // // Temp
  // const locQR = 'locQR/32/100'
  // const tmpDescription = 'Zurn AquaVantage Closet Repair Kit P6000-ECA-WS First Supply#: ZURP6000ECAWS'

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setScanResult('- - - -');
    setLocation("");
    setPartDescr("");
    setBinLoc("");
    setCompletedCount(false);
    setOpen(false);
  };

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  function getPart(code){
    // Note: Location scanned should have only unique part codes.

    // Function should account for the following variety of scan results:
        // "22-11147,1"  => partCode,min  || vendorPartCode,min
        // "49735,2,1" => partCode,max,min || vendorPartCode,max,min
        // "70-11235-7032" => partCode-warehouseCode
        // "71-00170" = partCode

    parts.map((p)=>{
      if (p.code == code){
        setScanResult(p.code);
        setPartDescr(p.description);
        setBinLoc(p.binLoc);
        setActivePart(p);
        setCompletedCount(false);
        return
      }
    })
  }

  function getScanResult(result){
    try{
      // locQR format: locQR/warehouseCode/row-section
      const locQR = /locQR/;
      if(!locQR.test(result)){
        if(location != '' && parts.length > 0){
          if(scanResult != result){getPart(result)} // Indicates a new part code has been scanned.
        }
      }
      else{
        const newLoc = result.replace('locQR/', '');
        if(location != newLoc){ // Indicates a new location has been scanned.
          setScanResult('- - - -');
          setPartDescr("");
          setBinLoc("");
          setCompletedCount(false);
          setLocation(newLoc);
          setLoading(true);
          inventoryQuery(result); // Must query using original (unmodified) result.
        }
      }
    }
    catch(err){
      setLoading(false);
      console.log(err);
    }
  }

  function inventoryQuery(query){
    const locQR = /locQR/;
    const queryType = 'locQR';
    if(locQR.test(query.toString().trim())){
        query = query.replace('locQR/', '') + '-';
    }
    fetch(
        `${apiUrl}/${user.email == 'johndoe@quaad.net' ? 
            'uwm' : user.institution}/inventory/${queryType}/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
        },
        body: JSON.stringify({query: query})
    })
    .then((res)=>{
      return res.json();
    })
    .then((res)=>{setParts(res);setLoading(false)})
    .catch((err)=>{setLocation('Error...Retry scanning location.'); setLoading(false); console.log(err)})
  }

  async function submitUserInput(input){
      
      try{
          setBasicMessageModalOpen(false);
          const now = new Date();
          const partDetails = {
              ...activePart,
              inventoryCount: input.count,
              comment: '',
              user: user.email,
              date: now
          } 
          fetch(`${apiUrl}/${user.email == 'johndoe@quaad.net' ? 
              'uwm' : user.institution}/inventory_count`, {
              method: 'POST', 
              headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
              body: JSON.stringify(partDetails)
          })
          .then((res)=>{
              if(res.status == 201){
                setCompletedCount(true)
              }
              else{
                  if(res.status == 401){setBasicMessageModalContent(`Unauthorized`)}
                  else{setBasicMessageModalContent(`${res.status} Error`)};
                  setBasicMessageModalOpen(true);
              }
          })
      }
      catch(err){
          console.log(err);
          setBasicMessageModalContent('Could not complete request!');
          setBasicMessageModalOpen(true);
      }
  }

  function CountModalContent(){
    const [displayAlert, setDisplayAlert] = useState(false);
    const [alertContent, setAlertContent] = useState('');

    function ErrorAlert(){
        return(
            <Alert 
                sx={{
                    display: displayAlert ? 'block' : 'none', 
                    backgroundColor: 'transparent', 
                    color: 'whitesmoke'
                }} 
                variant='standard' 
                severity="error">{alertContent}
            </Alert>
        )
    }

    function CountExposedEL(){
        return(
          <Button color="inherit">
            COUNT
          </Button>
        )
    }

    function CountForm(){
      const [tmpCount, setTmpCount] = useState(0);
      const [loading, setLoading] = useState(false);

      useEffect(()=>{document.querySelector('#quick-count-input').focus()},[])

      const FormButton = Styled.button`
          all: unset;
          fontSize: small; 
          color: white;
          width: fit-content; 
          textAlign: center; 
          margin: 10px;
          marginTop: 5px; 
          marginBottom: 5px;
          &:hover {cursor: pointer}
      `
      function submitForm(){
          try{
            if(Number(tmpCount) * 0  === 0 && tmpCount != ''){}
            else{throw new Error('Please enter a numeric value for Count!')};
            submitUserInput({count: tmpCount})
            .then(()=>{setLoading(false)})
          }
          catch(err){
              setLoading(false);
              setAlertContent(err.message);
              setDisplayAlert(true);
          }
      }
      
      return(
        <>  
          <ErrorAlert/>
          <div style={{width: '100%', margin: 'auto'}}>
              <form id='quick-count-form'>
                  <input 
                      inputMode='numeric'
                      maxLength={4}
                      id='quick-count-input'
                      className='stor-input'
                      style={{width: '99%', borderLeft: 0, borderTop: 0, borderRight: 0, fontSize: 'medium',
                          fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
                      }}
                      type='text' 
                      placeholder='(#) Count' 
                      onChange={(e)=>{
                          setTmpCount(e.target.value);
                            if(e.key === 'Enter'){
                              e.preventDefault();
                              setLoading(true);
                              submitForm();
                            }
                      }}
                  />
                  <div style={{width: 'fit-content',margin: 'auto'}}>
                  {!loading ?
                  <>
                      <FormButton 
                        type='button' 
                        onClick={(e)=>{
                            e.preventDefault();
                            setLoading(true);
                            submitForm();
                        }}
                      >
                        <img src={imgMap.get('circled-check.svg')} width='30px'/>
                      </FormButton>
                      <FormButton 
                          type='reset' 
                          >
                              <img src={imgMap.get('pulsar-clear.svg')} width='30px'/>
                      </FormButton>
                  </>
                  :
                    <CircularIndeterminate size={30} />
                  }
                  </div>
              </form>
          </div>
        </>
      )
    }
    return(<CustomContentFormModal 
      key='quick-count-modal' 
      exposedEl={[<CountExposedEL/>]} 
      modalContent={<CountForm/>} 
      setAlertContent={setAlertContent} 
      setDisplayAlert={setDisplayAlert}/>
    )
  }

  function NewScan(props){

    function Cam(){
        return (
            <>
              <Scanner 
                onScan={(result)=>{
                    getScanResult(result[0].rawValue);
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
          aria-label="quick count" 
          color="inherit" 
          onClick={handleClickOpen}>
          <img 
            src= {imgMap.get('1-2-3.svg')} 
            width={props?.iconWidth  || '25px'}
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
              <Typography sx={{ ml: 2, flex: 1}} variant="h6" component="div">
                QuickCount
              </Typography>
              {loading? <CircularIndeterminate size={30}/>
              :
                <>
                {scanResult == '- - - -' || location == ""? 
                  <>
                    {/* <Button color="inherit" onClick={()=>{
                      getPart('70-19202')
                    }}>
                      SCANPART
                    </Button>
                    <Button color="inherit" onClick={()=>{
                      // setLocation(locQR.split("/")[1] + "/" + locQR.split("/")[2]);
                      getScanResult(locQR);
                    }}>
                      SCANLOC
                    </Button> */}
                  </>
                : 
                  <CountModalContent/>
                }
                </>
              }
            </Toolbar>
          </AppBar>
          <List>
            <ListItemButton>
              <ListItemText primary={completedCount ? scanResult + ' ✓' : scanResult} secondary= {location == "" ? prompt : (binLoc != ''? location + " | " + binLoc : location) } />
            </ListItemButton>
            <Divider />
          </List>
          <div style={{textAlign: 'center'}}>
            {
            partDescr != "" ? 
            partDescr.length > 35 ? partDescr.substring(0, 30) + "..." : partDescr :
            "..."
            }
            <br/><br/>
          </div>
          <div className='fullscreen-scanner'>
          <NewScan displayCam={true}/>
          </div>
        </Dialog>
      </Fragment>
      <BasicMessageModal setModalOpen={setBasicMessageModalOpen} modalOpen={basicMessageModalOpen} modalContent={basicMessageModalContent} />
    </ThemeProvider>
  );
}