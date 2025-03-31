import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';

// import Switch from '@mui/material/Switch';
import ReorderSwitch from './ReorderSwitch';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { Typography } from '@mui/material';

import FullScreenScanner from './FullScreenScanner';

import useToken from '../../app/useToken';
import { BorderBottom, Update } from '@mui/icons-material';

import './InventoryPickActions.css';
import { css } from '@emotion/react';
import { styled } from '@mui/material';


export default function InventoryPickActions(props) {

  const [open, setOpen] = React.useState(false);
  const [partCode, setPartCode] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [qty, setQty] = React.useState('');
  const [unit, setUnit]  = React.useState('')
  const [reorder, setReorder] = React.useState(false);
  const [reorderAmt, setReorderAmt] = React.useState('');
  const [warehouse, setWarehouse] = React.useState('');
  const [workorder, setWorkorder] = React.useState('');
  const [qrScanResult, setQrScanResult] = React.useState('');
  // const [editedParts, setEditedParts] = React.useState({});
  const [isEditing, setIsEditing] = React.useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useToken();

  const partCodeInput = document.querySelector('#dial-part-code');
  const descriptionInput = document.querySelector('#dial-description');
  const qtyInput = document.querySelector('#dial-quantity');
  const unitInput = document.querySelector('#dial-unit');
  const warehouseInput = document.querySelector('#dial-warehouse');
  const workorderInput = document.querySelector('#dial-workorder');

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: 'white'
    },
    // '& .MuiInput-underline:after': {
    //   borderBottomColor: 'red',
    // },
    '& .MuiOutlinedInput-root': {
      // '& fieldset': {
      //   borderColor: 'gray',
      // },
      // '&:hover fieldset': {
      //   borderColor: 'gold',
      // },
      '&.Mui-focused fieldset': {
        borderColor: 'gold',
      },
    },
  });

  function modifyPartDetails(){
    if(description.length > 75){
      setDescription(description.substring(0, 75) + '...')
    }
  }

  const partDetails = {
    partCode: partCode,
    description: description,
    qty: qty,
    unit: unit,
    reorder: reorder,
    reorderAmt: reorderAmt,
    warehouse: warehouse,
    workorder: workorder
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false)
    setPartCode('')
    setDescription('')
    setQty('')
    setUnit('')
    setReorder(false)
    setReorderAmt('')
    setWarehouse('')
    setWorkorder('')
    setQrScanResult('')
    setIsEditing(false)
  };

  const fetchPartDetails = (partCode) =>{
    fetch(`${apiUrl}/parts/${partCode}`, 
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      } 
    )
    .then((res)=>{ 
        if(res.status !== 200){throw new Error(res.status)}
        else{return res.json()}
    })
    .then((res)=>{
        document.querySelector('#dial-description').value = res.description;
        setDescription(res.description);
        document.querySelector('#dial-warehouse').value = res.warehouseCode;
        setWarehouse(res.warehouseCode);
    })
    .catch((err)=>{console.log(err)})
  }

  function addFocusOutListener(){
    const partCode = document.querySelector('#dial-part-code')
    partCode.addEventListener('focusout', ()=>{
        if(partCode !=''){fetchPartDetails(partCode)}
    })
  }

  function removeFocusOutListener(){
    const partCode = document.querySelector('#dial-part-code')
    partCode.removeEventListener('focusout', ()=>{
      if(partCode !=''){fetchPartDetails(partCode)}
    })
  }

  function editPartDetails(index){
    // Sets current data into input boxes for user to edit.

    const parts = [...props.partInfo];
    const partEdit = parts[index];
    setPartCode(partEdit.part);
    setDescription(partEdit.description);
    setQty(partEdit.qty);
    setUnit(partEdit.unit);
    setWarehouse(partEdit.warehouse);
    setWorkorder(partEdit.workorder);
    setIsEditing(true);
  }

  function submitEdit(index){
    const parts = [...props.partInfo];
    const partEdit = parts[index];
    modifyPartDetails();
    partEdit.part = partCode;
    partEdit.description = description;
    partEdit.qty = qty;
    partEdit.unit = unit;
    partEdit.warehouse = warehouse;
    partEdit.workorder = workorder;
    partEdit.reorder = reorder;
    partEdit.reorderAmt = reorderAmt;
    props.setIsEditing(true);
    props.setPartInfo(parts);
    handleClose();
  }

  function getScanResult(scanResult){
    document.querySelector('#dial-part-code').value = scanResult;
    setPartCode(scanResult);
    fetchPartDetails(scanResult)
  }

  async function submitPicks(){
    await fetch(`${apiUrl}/pick`, {
        method: "POST",
        body: JSON.stringify(props.partInfo),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then((res)=>{
        return res.json();
        }
    ) 
    .then((res)=>{
      alert(res.message);
      handleClose();
      props.setPartInfo([])
    }) 
}

  function FloatingActionButtons() {

    function PrevNext(){

      const Prev =  () => {
        return(
          <Fab size='small' aria-label="previous" className='test-fab'>
            <ArrowLeftIcon onClick={props.setIdxPrev}/>
          </Fab>
        )
      }

      const Next =  () => {
        return(
          <Fab size='small' aria-label="next">
            <ArrowRightIcon onClick={props.setIdxNext} />
          </Fab>
        )
      }

      return(
        <>
          <Prev/>
          <Next/>
        </>
      )

    
    }

    function RemoveEdit(){

      const Edit =() =>{
        return(
          <Fab size='small' aria-label="edit" onClick={()=>{
            handleClickOpen();
            editPartDetails(props.idx);
          }}>
            <EditIcon />
          </Fab>
        )
      }

      const Remove =() =>{
        return(
          <Fab size='small' color="secondary" aria-label="edit">
            <RemoveIcon />
          </Fab>
        )
      }

      if(props.partInfo.length > 0){
        return(
          <>
            <Edit/>
          </>
        )
      }
      else{return<></>}

    }

    function SubmitCheck(){
      return(
        <Fab size='small' aria-label="submit picks" onClick={submitPicks}>
          <CheckIcon/>
        </Fab>
      )
    }

    return (
      <Box sx={{ '& > :not(style)': { m: 1 } }}>
        {props.multiParts ? <><PrevNext/><RemoveEdit/></> : <RemoveEdit/>}
        <Fab size='small' aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </Fab>
        {props.partInfo.length > 0 ? <SubmitCheck/> : <></>}
      </Box>
    );
  }

  function PickUpdate(){
    return(
      <Button style={{color: 'whitesmoke', backgroundColor: 'transparent'}} type="button" onClick={(e)=>{
        e.preventDefault();
        submitEdit(props.idx);
      }}>Update</Button>
    )
  }

  function PickAdd(){
    return(
      <Button style={{color: 'whitesmoke', backgroundColor: 'transparent'}} type="submit">Add</Button>
    )
  }

  function ReorderToggle(){

    return(
    <img className='ip-reorderToggle' src={reorder ? '/added-to-cart-sm-outline.svg' : '/cart-sm-outline.svg'} 
      style={{ width: '25px', float: 'right', marginLeft: '10px'}}
      onClick={()=>{
        setReorder(!reorder);
      }} 

    />)
  }
  
  return (
    <ThemeProvider theme={darkTheme}>
      <React.Fragment>
        <FloatingActionButtons/>
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth='xs'
          slotProps={{
            paper: {
              style: { borderRadius: 20, border: '1px solid white' },
              component: 'form',
              onSubmit: (event) => {
                event.preventDefault();
                props.setIsEditing(false);
                modifyPartDetails();
                props.addPartHist(partDetails);
                handleClose();
              },
            },
          }}
        >
          <DialogTitle sx={{backgroundColor: 'rgb(22, 22, 22)', marginBottom: '0', height: '15px'}}>
            <ReorderToggle/>
            <FullScreenScanner getScanResult={getScanResult}/>
          </DialogTitle>
          <DialogContent sx={{backgroundColor: 'rgb(22, 22, 22)'}}> 
            <DialogContentText>
            </DialogContentText>
            <div style={{width: '200px', margin: 'auto'}}>
              <TextField
                // sx={inputStyle}
                slotProps={
                  {
                    htmlInput: {maxLength: 20},                 
                    inputLabel: {shrink: true},
                  }
                }
                autoFocus
                required
                margin="dense"
                id="dial-part-code"
                name="partCode"
                label="Part Code"
                type="text"
                variant="outlined"
                size='small'
                defaultValue={partCode}
                onChange={(e) =>{ 
                  setPartCode(e.target.value.trim())
                }}
                onKeyDown={(e)=>{
                  if(e.key === 'Enter'){
                    e.preventDefault();
                    if(partCode != ''){fetchPartDetails(partCode)};
                  }
                }}
              />
              <TextField
                slotProps={
                  {
                    htmlInput: {maxLength: 75},                 
                    inputLabel: {shrink: true}
                  }
                }
                required
                margin="dense"
                id="dial-description"
                name="description"
                label="Description"
                type="text"
                defaultValue={description}
                variant="outlined"
                size='small'
                onChange={(event) => setDescription(event.target.value.trim())}
              />
              <TextField
                slotProps={
                  {
                    htmlInput: {maxLength: 6},              
                    inputLabel: {shrink: true}
                  }
                }
                required
                margin="dense"
                id="dial-quantity"
                name="quantity"
                label="Quantity"
                type="text"
                defaultValue={qty}
                variant="outlined"
                size='small'
                onChange={(event) => setQty(event.target.value.trim())}
              />
              <TextField
                slotProps={
                  {
                    htmlInput: {maxLength: 6},                 
                    inputLabel: {shrink: true}
                  }
                }
                margin="dense"
                id="dial-unit"
                name="unit"
                label="Unit"
                type="text"
                defaultValue={unit}
                variant="outlined"
                size='small'
                onChange={(event) => setUnit(event.target.value.trim())}
              />
              <TextField
                slotProps={
                  {
                    htmlInput: {maxLength: 20},                 
                    inputLabel: {shrink: true}
                  }
                }
                margin="dense"
                id="dial-warehouse"
                name="warehouse"
                label="Warehouse"
                type="text"
                defaultValue={warehouse}
                variant="outlined"
                size='small'
                onChange={(event) => setWarehouse(event.target.value.trim())}
              />
              <TextField
                slotProps={
                  {
                    htmlInput: {maxLength: 20},                 
                    inputLabel: {shrink: true}
                  }
                }
                required
                margin="dense"
                id="dial-workorder"
                name="workorder"
                label="Workorder"
                type="text"
                defaultValue={workorder}
                variant="outlined"
                size='small'
                onChange={(event) => setWorkorder(event.target.value.trim())}
              />
              <div>
                <div>
                  <TextField
                    sx={{...(reorder ? {} : {display: 'none'})}}
                    slotProps={
                      {
                        htmlInput: {maxLength: 10},                 
                        inputLabel: {shrink: true}
                      }
                    }
                    margin="dense"
                    id="dial-reorder-qty"
                    name="reorder"
                    label="Reorder Quantity"
                    type="text"
                    variant="outlined"
                    size='small'
                    onChange={(event) => setReorderAmt(event.target.value.trim())} 
                  />
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions sx={{backgroundColor: 'rgb(22, 22, 22)'}}>
            <div style={{margin: 'auto'}}>
              {isEditing ? <PickUpdate/> : <PickAdd/>}
              <Button style={{color: 'whitesmoke', marginLeft: '5px', backgroundColor: 'transparent'}} onClick={handleClose}>Cancel</Button>
            </div>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </ThemeProvider>
  );
}