import { Fragment, forwardRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import Slide from '@mui/material/Slide';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Collapse } from '@mui/material';
import BasicDialogModal from './BasicDialogModal';
import BasicMessageModal from './BasicMessageModal'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import {unparse} from 'papaparse';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import useStoredOrds from '../../app/useStoredOrds';
import imgMap from '../../app/imgMap';

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

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function SessionReorder(props) {
    const [open, setOpen] = useState(false);
    const [ordersListItems, setOrdersListItems] = useState([]);
    const [unfilteredOrders, setUnfilteredOrders] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState({})
    const [basicMessageOpen, setBasicMessageOpen] = useState(false);
    const [basicMessageContent, setBasicMessageContent] = useState('');
    const [orderFilter, setOrderFilter] = useState('');
    const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
    const { storedOrds, setStoredOrds } = useStoredOrds();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        props.setSessionOrds(unfilteredOrders);
        setStoredOrds(unfilteredOrders);
        setOpen(false);
    };

    const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    });

    const StyledTextfield = styled(TextField)({
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: '#B2BAC2',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#B2BAC2',
          },
        },
        '& #outlined-start-adornment-label':{
            color: 'gray',
            '&.Mui-focused': {
                color: 'whitesmoke'
            }
        }
    });

    function setOrders(){
        setOrdersListItems(props.sessionOrds);
        setUnfilteredOrders(props.sessionOrds);
    }

    async function deleteOrder(orderId){
        try{
            if(orderId){
                const updatedOrderslist = [];
                ordersListItems.map((order)=>{
                    if(order._id != orderId){
                        updatedOrderslist.push(order)
                    }
                })
                setOrdersListItems(updatedOrderslist);

                const updatedUnfilteredOrders = [];
                unfilteredOrders.map((order)=>{
                    if(order._id != orderId){
                        updatedUnfilteredOrders.push(order)
                    }
                })
                setUnfilteredOrders(updatedUnfilteredOrders);
                setOrderToDelete({});
            }
            else{
                // Will account for filtered items by only removing items that are still present in list.
                const updatedOrderslist = [];
                const updatedOrdersMap = new Map();
                const updatedUnfilteredOrders = [];
                ordersListItems.map((order)=>{
                    updatedOrdersMap.set(order._id, order._id)

                })
                // If true, item in not present in UI list.
                unfilteredOrders.map((order)=>{
                    if(updatedOrdersMap.get(order._id) == undefined){updatedUnfilteredOrders.push(order)}
                })
                setOrdersListItems(updatedUnfilteredOrders);
                setUnfilteredOrders(updatedUnfilteredOrders);
                setOrderFilter('');
            }
        }
        catch(err){
            console.log(err);
            setBasicMessageContent('Could not complete operation!');
            setBasicMessageOpen(true);
        }
    }

    function downloadOrds(){
        try{
            const items = [...unfilteredOrders];
            items.sort((a, b)=>{

                const item1 = a.warehouseCode;
                const item2 = b.warehouseCode;

                const item3 = a.binLoc;
                const item4 = b.binLoc;

                const item5 = a.code;
                const item6 = b.code;

                if(item1 !== item2){
                    if (item1 < item2) {
                    return -1;
                    }
                    if (item1 > item2) {
                    return 1;
                    }
                    return 0;
                }
                else if(item3 !== item4){
                    if (item3 < item4) {
                    return -1;
                    }
                    if (item3 > item4) {
                    return 1;
                    }
                    return 0;
                }
                else{
                    if (item5 < item6) {
                    return -1;
                    }
                    if (item5 > item6) {
                    return 1;
                    }
                    return 0;
                }
            });

            const csv = jsonToCsv(items);
            download(csv, 'stor-orders');
        }
        catch(err){
            console.log(err)
        }
    }

    function filterByPartCode(partCode){
        const matching = [];
        const reStr = '^' + partCode;
        const reCode = new RegExp(reStr, 'i')
        ordersListItems.forEach((order)=>{
            if(reCode.test(order.code)){
                matching.push(order)
            }
        setOrdersListItems(matching);
        setOrderFilter(partCode);
        })
    }

    function unfilter(){
        setOrdersListItems(unfilteredOrders);
        setOrderFilter('');
    }

    function ModalContent(){
        return(
            <>
                <span>
                    Item will be removed...this cannot be undone.
                    Continue?
                </span>
                <div style={{width: 'fit-content', margin: 'auto'}}>
                    <IconButton autoFocus disableRipple onClick={()=>{
                        deleteOrder(orderToDelete.id);
                        setModalOpen(false);
                    }}><span style={{fontSize: '15px'}}><img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;Ok</span>
                    </IconButton>
                    <IconButton disableRipple onClick={()=>{setModalOpen(false)}}>
                        <span style={{fontSize: '15px'}}><img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;Cancel </span>
                    </IconButton>
                </div>
            </>
        )
    }

    function DeleteAllModalContent(){
        return(
            <>
                <span>
                    All items displayed will be removed...this cannot be undone.
                    Continue?
                </span>
                <div style={{width: 'fit-content', margin: 'auto'}}>
                    <IconButton autoFocus disableRipple onClick={()=>{
                        deleteOrder();
                        setDeleteAllModalOpen(false);
                    }}><span style={{fontSize: '15px'}}><img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;Ok</span>
                    </IconButton>
                    <IconButton disableRipple onClick={()=>{setDeleteAllModalOpen(false)}}>
                        <span style={{fontSize: '15px'}}><img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;Cancel </span>
                    </IconButton>
                </div>
            </>
        )
    }

    function OrderItem(props){
        const [itemOpen, setItemOpen] = useState(false);
        const [newReorderAmt, setNewReorderAmt] = useState(0);
        
        return(
            <>
                <ListItemButton className='reord-list-item' disableRipple sx={{display: 'block', '&:hover':{cursor: 'default'}}}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setItemOpen(!itemOpen)}
                    >
                        {itemOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                    <div style={{width: '150px'}}>Order Qty:&nbsp; 
                        {itemOpen ? 
                        <input 
                            type='number' 
                            defaultValue={props?.order.reorderAmt} 
                            style={{width: '50px'}}
                            onChange={(e)=>{setNewReorderAmt(e.target.value)}}
                            onKeyDown={(e)=>{if(e.key === 'Enter'){
                                if(Number(newReorderAmt)){

                                    const updatedOrds = [];
                                    unfilteredOrders.forEach((ord)=>{
                                        if(ord._id != props.order._id){updatedOrds.push(ord)}
                                        else{updatedOrds.push({...props.order, reorderAmt: Number(newReorderAmt)})}
                                    })
                                    setUnfilteredOrders(updatedOrds);

                                    const newListItems = [];
                                    ordersListItems.map((ord)=>{
                                        if(ord._id != props.order._id){newListItems.push(ord)}
                                        else{newListItems.push({...props.order, reorderAmt: Number(newReorderAmt)})}
                                    })
                                    setOrdersListItems(newListItems);
                                }
                            }}}
                        />
                        :
                        <span style={{color: 'gray'}}>{props?.order.reorderAmt}</span>
                        }
                    </div>
                    <div style={{fontSize: '15px', color: 'gray'}}><span style={{color: 'goldenrod'}}>{props?.order.code}</span></div>
                    <IconButton disableRipple  onClick={()=>{
                            setOrderToDelete({id: props?.order._id, index: props?.index});
                            setModalOpen(true);
                        }}>
                        <input type='checkbox' readOnly
                        />
                        <span style={{fontSize: '15px'}}>Remove?</span>
                    </IconButton>
                    <br/>
                    <Collapse in={itemOpen} timeout="auto" unmountOnExit>
                        <div><strong>binLoc:</strong><span style={{color: 'gray'}}> {props?.order.binLoc} | {props?.order.warehouseCode}</span></div>
                        <div><strong>description:</strong><span style={{color: 'gray'}}> {props?.order.description}</span></div>
                        <div><strong>comment:</strong> <span style={{color: 'gray'}}>{props?.order.comment}</span></div>
                    </Collapse>
                </ListItemButton>
                <Divider />
            </>
        )
    }

    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <Fragment>
                    <IconButton
                        disableRipple
                        size="large"
                        aria-label="orders"
                        color="inherit"
                        onClick={()=>{
                            handleClickOpen();
                            setOrders();
                        }}
                    >
                        <img src={imgMap.get('pulsar-cart.svg')} width='25px' />
                        {props?.btnDescription || <></>}
                    </IconButton>
                    <Dialog
                    sx={{'& .MuiAppBar-root': {backgroundColor: {}}, '& .MuiPaper-root': {backgroundColor: 'black'}}}
                    fullScreen
                    open={open}
                    onClose={handleClose}
                    slots={{transition: Transition}}
                    >
                    <AppBar 
                        sx={{ position: 'fixed' }}>
                        <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <PlaylistAddCheckRoundedIcon />
                        </IconButton>
                        {ordersListItems.length > 0 ?
                        <IconButton disableRipple onClick={()=>{setDeleteAllModalOpen(true)}}>
                            <DeleteSweepOutlinedIcon  fontSize='20px'/>
                        </IconButton>
                        :
                        <></>
                        }
                        <IconButton disableRipple onClick={downloadOrds}>
                            <SaveAltIcon fontSize='20px'/>
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        </Typography>
                        <span style={{color:'gray'}}>&#40;{ordersListItems?.length}&#41;</span>
                        {orderFilter != '' ? 
                        <IconButton disableRipple onClick={unfilter}>
                            <FilterListOffIcon fontSize='20px'/>
                        </IconButton> : <></>}
                        <StyledTextfield
                            variant='outlined'
                            label="Filter by Part"
                            id="outlined-start-adornment"
                            size='small'
                            sx={{ m: 1, width: '150px', marginTop: '15px'}}
                            slotProps={{
                                input: {
                                startAdornment: <InputAdornment position="start"><img src={imgMap.get('tool-box.svg')} width='20px'/></InputAdornment>,
                                },
                            }}
                            onKeyDown={(e)=>{if (e.key === 'Enter'){filterByPartCode(e.target.value)}}}
                        />
                        </Toolbar>
                    </AppBar>
                    <br/><br/>
                    <List>
                        {ordersListItems?.map((order, index)=>{
                            return (
                                <OrderItem order={order} key={index} index={index}/>
                            )
                        })}
                    </List>
                    </Dialog>
                </Fragment>
            </ThemeProvider>
            <BasicDialogModal modalOpen={modalOpen} setModalOpen={setModalOpen} modalContent={<ModalContent/>}/>
            <BasicMessageModal modalOpen={basicMessageOpen} setModalOpen={setBasicMessageOpen} modalContent={basicMessageContent}/>
            <BasicDialogModal modalOpen={deleteAllModalOpen} setModalOpen={setDeleteAllModalOpen} modalContent={<DeleteAllModalContent/>}/>
        </>
    );
}