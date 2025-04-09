import * as React from 'react';
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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Collapse } from '@mui/material';
import useToken from '../../app/useToken';
import BasicDialogModal from './BasicDialogModal';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Tasks(props) {
    const [open, setOpen] = React.useState(false);
    const [tasksListItems, setTasksListItems] = React.useState([]);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [taskToDelete, setTaskToDelete] = React.useState({})
    const { token } = useToken();
    const apiUrl = import.meta.env.VITE_API_URL;

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

    React.useEffect(()=>{
        getTasks(); 
    }, [open])

    async function getTasks(){
        try{
        fetch(`${apiUrl}/inventory_tasks/get-all`, 
            {
                method: 'POST', 
                headers: {Authorization: `Bearer ${token}`}
            }   
        )
        .then((res)=>{return res.json()})
        .then((res)=>{ 
            setTasksListItems(res)
        })
        }
        catch(err){
            alert('Could not fetch records!');
            console.log(err);
        }
    }

    async function deleteTask(taskId, index){
        try{
            fetch(`${apiUrl}/inventory_tasks/delete/${taskId}`,
                {
                    method: 'POST',
                    headers: {Authorization: `Bearer ${token}`}
                }
            )
            .then((res)=>{
                if(res.status == 200){}
                else{
                    console.log(res)
                    throw new Error()
                };
                const updatedTasklist = [];
                tasksListItems.map((task, idx)=>{
                    if(idx != index){
                        updatedTasklist.push(task)
                    }
                    setTasksListItems(updatedTasklist);
                    setTaskToDelete({});
                })
            })
        }
        catch(err){
            console.log(err);
            alert('Could not delete task!');
        }
    }

    function ModalContent(){
        return(
            <>
                <span>
                    Task will be removed...this cannot be undone.
                    Continue?
                </span>
                <div style={{width: 'fit-content', margin: 'auto'}}>
                    <IconButton disableRipple onClick={()=>{
                        setModalOpen(false);
                        deleteTask(taskToDelete.id, taskToDelete.index);
                    }}><span style={{fontSize: '15px'}}><img src='square-outlined-small.svg' width='10px' />&nbsp;Ok</span>
                    </IconButton>
                    <IconButton disableRipple onClick={()=>{setModalOpen(false)}}>
                        <span style={{fontSize: '15px'}}><img src='square-outlined-small.svg' width='10px' />&nbsp;Cancel </span>
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
                    <div style={{width: '150px'}}>{props?.task.taskType}</div>
                    <div style={{fontSize: '13px', color: 'gray'}}>{props?.task.code} | {props?.task.date}</div>
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
                        <div style={{lineBreak: 'anywhere'}}><strong>details:</strong><span style={{color: 'gray'}}> {props?.task.taskValues}</span></div>
                        <div><strong>Comment:</strong> <span style={{color: 'gray'}}>{props?.task.comment}</span></div>
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
                        size="large"
                        aria-label="tasks"
                        color="inherit"
                        onClick={handleClickOpen}
                    >
                        <img src='/checklist.svg' width='25px' />
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
                            TASKS
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleClose}>
                            {/* save */}
                        </Button>
                        </Toolbar>
                    </AppBar>
                    <List>
                        {tasksListItems.map((task, index)=>{
                            return (
                                <TaskItem task={task} key={index} index={index}/>
                            )
                        })}
                    </List>
                    </Dialog>
                </React.Fragment>
            </ThemeProvider>
            <BasicDialogModal modalOpen={modalOpen} setModalOpen={setModalOpen} modalContent={<ModalContent/>}/>
        </>
    );
}