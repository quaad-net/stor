import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Collapse } from '@mui/material';
import useToken from '../../app/useToken';
import BasicDialogModal from './BasicDialogModal';
import BasicMessageModal from './BasicMessageModal'
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import useUserData from '../../app/useUserData';
import imgMap from '../../app/imgMap';
// import InputAdornment from '@mui/material/InputAdornment';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PrintJobs(props) {
    const [open, setOpen] = React.useState(false);
    const [tasksListItems, setTasksListItems] = React.useState([]);
    const [unfilteredTasks, setUnfilteredTasks] = React.useState([]);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [taskToDelete, setTaskToDelete] = React.useState({})
    const [basicMessageOpen, setBasicMessageOpen] = React.useState(false);
    const [basicMessageContent, setBasicMessageContent] = React.useState('')
    const [userFilter, setUserFilter] = React.useState('')
    const [deleteAllModalOpen, setDeleteAllModalOpen] = React.useState(false);
    const { token } = useToken();
    const { userData } = useUserData();
    const user = JSON.parse(userData);
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
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

    async function getTasks(){

        fetch(`${apiUrl}/${user.institution}/inventory_tasks_print/get-all`, 
            {
                method: 'POST', 
                headers: 
                    {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
            }   
        )
        .then((res)=>{
            if(res.status !== 200){
                console.log(res.status);
                if(res.status == 401){throw new Error('Unauthorized')}
                else{throw new Error()};
            }
            return res.json()
        })
        .then((res)=>{ 
            setTasksListItems(res);
            setUnfilteredTasks(res);
        })
        .catch((err)=>{
            console.log(err)
            if(err?.message == 'Unauthorized'){setBasicMessageContent('Unauthorized')}
            else{setBasicMessageContent('Could not complete operation!')};
            setBasicMessageOpen(true);
        })
    }

    async function deleteTask(taskId){
     
            fetch(`${apiUrl}/${user.institution}/inventory_tasks_print/delete/${taskId}`,
                {
                    method: 'POST',
                    headers: {Authorization: `Bearer ${token}`}
                }
            )
            .then((res)=>{
                if(res.status == 200){}
                else{
                    throw new Error()
                };
                
                const updatedTaskslist = [];
                tasksListItems.map((task)=>{
                    if(task._id != taskId){
                        updatedTaskslist.push(task)
                    }
                })
                setTasksListItems(updatedTaskslist);

                const updatedUnfilteredTasks = [];
                unfilteredTasks.map((task)=>{
                    if(task._id != taskId){
                        updatedUnfilteredTasks.push(task)
                    }
                })
                setUnfilteredTasks(updatedUnfilteredTasks);
                setTaskToDelete({});
            })
            .catch((err)=>{
                console.log(err);
                setBasicMessageContent('Could not complete operation!');
                setBasicMessageOpen(true);
            })
    }

    async function deleteAllTasks(){
     
        const  ids = [];
        tasksListItems.forEach((task)=>{
            ids.push(task._id)
        })
        await fetch(`${apiUrl}/${user.institution}/inventory_tasks_print/delete-all`,
            {
                method: 'POST',
                headers: {
                    "Content-Type" : 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ids: ids}),
            }
        )
        .then((res)=>{
            if(res.status == 200){}
            else{
                throw new Error()
            };
            setTasksListItems([]);
            setUnfilteredTasks([]);
            setTaskToDelete({});
        })
        .catch((err)=>{
            console.log(err);
            setBasicMessageContent('Could not complete operation!');
            setBasicMessageOpen(true);
        })
    }

    function filterByUser(user){
        const userTasks = [];
        const reStr = '^' + user;
        const reUser = new RegExp(reStr, 'i')
        tasksListItems.forEach((task)=>{
            if(reUser.test(task.user)){
                userTasks.push(task)
            }
        setTasksListItems(userTasks);
        setUserFilter(user);
        })
    }

    function unfilter(){
        setTasksListItems(unfilteredTasks);
        setUserFilter('');
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
                        setModalOpen(false);
                        deleteTask(taskToDelete.id);
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
                    All items will be removed...this cannot be undone.
                    Continue?
                </span>
                <div style={{width: 'fit-content', margin: 'auto'}}>
                    <IconButton autoFocus disableRipple onClick={()=>{
                        setDeleteAllModalOpen(false);
                        deleteAllTasks();
                        getTasks();
                    }}><span style={{fontSize: '15px'}}><img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;Ok</span>
                    </IconButton>
                    <IconButton disableRipple onClick={()=>{setDeleteAllModalOpen(false)}}>
                        <span style={{fontSize: '15px'}}><img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;Cancel </span>
                    </IconButton>
                </div>
            </>
        )
    }

    function TaskItem(props){
        const [itemOpen, setItemOpen] = React.useState(false);
        return(
            <>
                <ListItemButton sx={{display: 'block'}} onClick={()=>{setItemOpen(!itemOpen)}}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setItemOpen(!itemOpen)}
                    >
                        {itemOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                    <div style={{fontSize: '13px', color: 'gray'}}><span style={{color: 'goldenrod'}}>{props?.task.code}</span> | {props?.task.date}</div>
                    <div style={{fontSize: '13px', color: 'gray'}}>@{props?.task.user.split('@')[0]}</div>
                    <IconButton disableRipple  onClick={()=>{
                            setTaskToDelete({id: props?.task._id, index: props?.index})
                            setModalOpen(!modalOpen)   
                        }}>
                        <input type='checkbox' readOnly
                        />
                        <span style={{fontSize: '15px'}}>Complete?</span>
                    </IconButton>
                    <br/>
                    <Collapse in={itemOpen} timeout="auto" unmountOnExit>
                        <div><strong>binLoc:</strong><span style={{color: 'gray'}}> {props?.task.binLoc}</span></div>
                        <div><strong>description:</strong><span style={{color: 'gray'}}> {props?.task.description}</span></div>
                        {/* <div style={{lineBreak: 'anywhere'}}><strong>details:</strong><span style={{color: 'gray'}}> {props?.task.taskValues}</span></div> */}
                        <div><strong>comment:</strong> <span style={{color: 'gray'}}>{props?.task.comment}</span></div>
                        <br/>
                        <IconButton disableRipple size='small' onClick={()=>{
                            props.printPrintJobs([{
                                code: props?.task.code,
                                description: props?.task.description,
                                binLoc: props?.task.binLoc,
                                min: props?.task.min,
                                max: props?.task.max
                            }])
                        }}><span style={{fontSize: '12px'}}><img src={imgMap.get('pulsar-print.svg')} width='20px'/></span></IconButton>
                    </Collapse>
                </ListItemButton>
                <Divider />
            </>
        )
    }

    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <React.Fragment>
                    <IconButton 
                        disableRipple 
                        onClick={()=>{
                            handleClickOpen();
                            getTasks();
                        }}>
                        <span style={{fontSize: '15px'}}><img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;Print Jobs </span>
                    </IconButton>
                    <Dialog
                    sx={{'& .MuiAppBar-root': {backgroundColor: {}}, '& .MuiPaper-root': {backgroundColor: 'black'}}}
                    fullScreen
                    open={open}
                    onClose={handleClose}
                    slots={{transition: Transition}}
                    >
                    <AppBar 
                        sx={{ position: 'relative' }}>
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
                            PRINT <span>&nbsp;&#40;{tasksListItems?.length}&#41;</span>
                        </Typography>
                        {/* {userFilter != '' ? 
                        <IconButton disableRipple onClick={unfilter}>
                            <FilterListOffIcon fontSize='20px'/>
                        </IconButton> : <></>}
                        <StyledTextfield
                            variant='outlined'
                            label="Filter by User"
                            id="outlined-start-adornment"
                            size='small'
                            sx={{ m: 1, width: '150px', marginTop: '15px'}}
                            slotProps={{
                                input: {
                                startAdornment: <InputAdornment position="start"><img src={imgMap.get('user-small.svg)} width='20px'/></InputAdornment>,
                                },
                            }}
                            onKeyDown={(e)=>{
                                // e.preventDefault();
                                document.querySelector('#outlined-start-adornment').focus();
                                if (e.key === 'Enter'){filterByUser(e.target.value)

                                }}}
                        /> */}
                        </Toolbar>
                    </AppBar>
                    <List>
                        {tasksListItems.length > 1 ?
                        <>
                            <ListItemButton 
                            >
                                <IconButton 
                                    size='small'
                                    disableRipple
                                    sx={{marginLeft: '10px', marginRight: '0'}}
                                    onClick={()=>{
                                        props.printPrintJobs(tasksListItems)
                                    }}
                                >
                                    <img src={imgMap.get('pulsar-print.svg')} width='20px' style={{marginRight: '5px'}}/>
                                    <span style={{color: 'gray', fontSize: '12px'}}></span>
                                </IconButton> |
                                <IconButton 
                                    disableRipple
                                    onClick={()=>{
                                    setDeleteAllModalOpen(true);
                                    }}>
                                        <span style={{fontSize: '15px'}}>Remove All?</span>
                                </IconButton>
                            </ListItemButton>
                            <Divider/>
                        </>
                        : <></>
                        }
                        {tasksListItems?.map((task, index)=>{
                            return (
                                <TaskItem task={task} key={index} index={index} printPrintJobs={props.printPrintJobs}/>
                            )
                        })}
                    </List>
                    </Dialog>
                </React.Fragment>
            </ThemeProvider>
            <BasicDialogModal modalOpen={modalOpen} setModalOpen={setModalOpen} modalContent={<ModalContent/>}/>
            <BasicDialogModal modalOpen={deleteAllModalOpen} setModalOpen={setDeleteAllModalOpen} modalContent={<DeleteAllModalContent/>}/>
            <BasicMessageModal modalOpen={basicMessageOpen} setModalOpen={setBasicMessageOpen} modalContent={basicMessageContent}/>
        </>
    );
}
