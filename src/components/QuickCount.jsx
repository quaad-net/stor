import './FullScreenScanner.css'
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import BasicMessageModal from './BasicMessageModal';
import Button from '@mui/material/Button';
import CircularIndeterminate from './Progress';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider} from '@mui/material';
import CustomContentFormModal from './CustomContentFormModal';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import { Fragment, forwardRef, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import imgMap from '../../app/imgMap';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { Scanner } from '@yudiel/react-qr-scanner';
import Slide from '@mui/material/Slide';
import Styled from '@emotion/styled';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {unparse} from 'papaparse';
import useToken from '../../app/useToken';
import useUserData from '../../app/useUserData';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const download = (data, filename) => {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
}

function jsonToCsv(objArray) {
    const csv = unparse(objArray);
    return csv
}

export default function QuickCount(props) {
  const [activePart, setActivePart] = useState({});
  const apiUrl = import.meta.env.VITE_API_URL;
  const [basicMessageModalContent, setBasicMessageModalContent] = useState("");
  const [basicMessageModalOpen, setBasicMessageModalOpen] = useState(false);
  const [binLoc, setBinLoc] = useState("");
  const [completedCount, setCompletedCount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const [partDescr, setPartDescr] = useState("");
  const [parts, setParts] = useState([]);
  const [prompt, setPrompt] = useState("Scan a location QR.");
  const [scanResult, setScanResult] = useState('- - - -');
  const { token } = useToken();
  const { userData } = useUserData();
  const user = JSON.parse(userData);

  // // For Scan Emulation Only
  // const locQR = 'locQR/32/100'

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

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

  async function getCounts(){
    fetch(`${apiUrl}/${user.email == 'johndoe@quaad.net' ? 
        'uwm' : user.institution}/inventory_count_records`, {
        method: 'POST', 
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
    })
    .then((res)=>{
      if(res.status != 200){throw new Error(res.status)}
      return res.json()
    })
    .then((res)=>{
      const csv = jsonToCsv(res);
      download(csv, 'inventory_count_records')
    })
    .catch((err)=>{
      setBasicMessageModalContent(<span>{err.message} Error</span>);
      setBasicMessageModalOpen(true);
    })
  }

  function getPart(code){
    // Note: Location scanned should have only unique part codes.

    // Function should account for the following variety of scan results:
        // 22-11147,1  => partCode,min  || vendorPartCode,min
        // 70-11235-7032 => partCode-warehouseCode
        // "71-00170" => partCode with quotations

    let matched = false;
    let newResult = code.replaceAll(`"`, ``);  
    const hasComma = /,/;
    if(hasComma.test(newResult)){
        newResult = newResult.split(',')[0].trim();
    };

    const resultArr = newResult.split('');
    let hyphenCount = 0;
    resultArr.forEach((char)=>{
        if(char == '-'){hyphenCount++};
    })
    
    if(hyphenCount == 2){newResult = newResult.split('-')[0] + '-' + newResult.split('-')[1]}

    parts.map((p)=>{
      if (p.code == newResult){
        matched = true;
        setScanResult(p.code);
        setPartDescr(p.description);
        setBinLoc(p.binLoc);
        setActivePart(p);
        setCompletedCount(false);
        return
      }
    })

    if(!matched){
      setBasicMessageModalContent(
        <span>
            No matching record for<br/>
            <span style={{color: 'gold', borderBottom: '1px dotted gray'}}>{code}</span>
        </span>
      );
      setBasicMessageModalOpen(true);
    }
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
            <img src={imgMap.get('1-2-3.svg')} width='30px'/>
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
              <form id='quick-count-form' onSubmit={(e)=>{e.preventDefault()}}>
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
                      }}
                      onKeyDown={(e)=>{
                        console.log(e.key)
                        if(e.key==='Enter'){
                          if(completedCount){setCompletedCount(false)}
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
                            if(completedCount){setCompletedCount(false)}
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
                constraints={{audio: true, facingMode: {ideal: 'environment' }}}
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
            src= {imgMap.get('pulsar-layers.svg')} 
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
                QUICKCOUNT
              </Typography>
              <IconButton disableRipple onClick={getCounts}>
                  <SaveAltIcon fontSize='20px'/>
              </IconButton>
              {loading? <CircularIndeterminate size={30}/>
              :
                <>
                {scanResult == '- - - -' || location == ""? 
                  <>
                    {/* Scan Emulation */}
                    {/* <Button color="inherit" onClick={()=>{
                      getPart('70-19170') 
                    }}>
                      SCANPART
                    </Button>
                    <Button color="inherit" onClick={()=>{
                      getScanResult(locQR);
                    }}>
                      SCANLOC
                    </Button> */}
                    {/* End Scan Emulation */}
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
              <ListItemText 
                primary={completedCount ? scanResult + ' ✓' : scanResult}
                secondary= {location == "" ? prompt : (binLoc != ''? location + " | " + binLoc : location) } 
              />
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