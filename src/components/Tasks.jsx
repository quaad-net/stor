import { Fragment, forwardRef, useState } from 'react';
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
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import useUserData from '../../app/useUserData';
import CircularIndeterminate from './Progress';
import imgMap from '../../app/imgMap';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const sampleTasks = [

    {_id: '6820f585014834ae5ed9b45e', code: '58-11887', binLoc: '113-A-C', warehouseCode: 7032, taskType: 'Loc', 
        comment: '', completed: false, date: '2025-05-11T19:07:49.504Z', description: 'Sloan Handle Cup',
        taskValues: "{\"binLoc\":\"100-A-A\"}", user: "jane.k@quaad.net"
    },
    {_id: '6820f566014834ae5ed9b45d', code: '59-12451S', binLoc: '113-A-C', warehouseCode: 5032, taskType: 'Pick',
        comment: '', completed: false, date: '2025-05-11T19:07:49.504Z', description: `Sloan Regal 2" Plastic Handle Repair Kit White 23928  S5302305 (First Supply #SLO5302305)`,
        taskValues: `{"workorder":"82345","qtyUsed":"7","reorderAmt":"8"}`, user: "john.l@quaad.net"
    },
    {_id: '6820f551014834ae5ed9b45c', code: '59-11124', binLoc: '113-A-B', warehouseCode: 5032, taskType: 'Other',
        comment: 'Find new supplier.', completed: false, date: '2025-05-11T19:07:49.504Z', description: 'Lift Rod 50994',
        taskValues: "Other", user: "mary.m@quaad.net"
    },
    {_id: '6820f4fe014834ae5ed9b45b', code: '58-00450', binLoc: '113-A-A', warehouseCode: 5032, taskType: 'Loc',
        comment: 'Grouping with same brand.', completed: false, date: '2025-05-11T19:07:49.504Z', description: 'Zurn AquaVantage Closet Rebuild Kit P6000-ECA-WS-RK First Supply#: ZURP6000ECAWSRK', 
        taskValues: `{"binLoc":"119-C-A"}`, user: "matt.n@quaad.net"
    }
]

export default function Tasks(props) {
    const [open, setOpen] = useState(false);
    const [tasksListItems, setTasksListItems] = useState([]);
    const [unfilteredTasks, setUnfilteredTasks] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState({})
    const [basicMessageOpen, setBasicMessageOpen] = useState(false);
    const [basicMessageContent, setBasicMessageContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [userFilter, setUserFilter] = useState('')
    const { token } = useToken();
    const { userData } = useUserData();
    const user = JSON.parse(userData);
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

        if(user.email != 'johndoe@quaad.net'){
            fetch(`${apiUrl}/${user.institution}/inventory_tasks/get-all`, 
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
                if(err?.message == 'Unauthorized'){setBasicMessageContent('Unauthorized')}
                else{setBasicMessageContent('Could not complete operation!')};
                setBasicMessageOpen(true);
                console.log(err);
            })
        }
        else{
            setTasksListItems(sampleTasks);
            setUnfilteredTasks(sampleTasks);
        }
    }

    async function deleteTask(taskId){
        if(user.email != 'johndoe@quaad.net'){
            fetch(`${apiUrl}/${user.institution}/inventory_tasks/delete/${taskId}`,
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
        else{ // With sample data...
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
        }
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
        const [loading, setLoading] = useState(false);

        return(
            <>
                <span>
                    Task will be removed...this cannot be undone.
                    Continue?
                </span>
                <div style={{width: 'fit-content', margin: 'auto'}}>
                    {!loading ?
                    <>
                        <IconButton autoFocus disableRipple onClick={()=>{
                            setLoading(true);
                            deleteTask(taskToDelete.id)
                            .then(()=>{
                                setLoading(false);
                                setModalOpen(false);
                            })
                            .catch(()=>{
                                setLoading(false);
                                setModalOpen(false);
                            })
                        }}><span style={{fontSize: '15px'}}><img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;Ok</span>
                        </IconButton>
                        <IconButton disableRipple onClick={()=>{setModalOpen(false)}}>
                            <span style={{fontSize: '15px'}}><img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;Cancel </span>
                        </IconButton>
                    </>
                    :
                    <>
                        <br/>
                        <CircularIndeterminate size={30}/>
                    </>
                    }
                </div>
            </>
        )
    }

    function TaskItem(props){
        const [itemOpen, setItemOpen] = useState(false);
        
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
                        <div><strong>binLoc:</strong><span style={{color: 'gray'}}> {props?.task.binLoc} | {props?.task.warehouseCode}</span></div>
                        <div><strong>description:</strong><span style={{color: 'gray'}}> {props?.task.description}</span></div>
                        <div style={{lineBreak: 'anywhere'}}><strong>details:</strong><span style={{color: 'gray'}}> {props?.task.taskValues}</span></div>
                        <div><strong>comment:</strong> <span style={{color: 'gray'}}>{props?.task.comment}</span></div>
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
                        aria-label="tasks"
                        color="inherit"
                        onClick={()=>{
                            handleClickOpen();
                            setLoading(true);
                            getTasks()
                            .then(()=>{setLoading(false)})
                            .catch(()=>{setLoading(false)})
                        }}
                    >
                        <img src={imgMap.get('checklist.svg')} width='25px' />
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
                        sx={{ position: 'fixed'}}>
                        <Toolbar>
                        {!loading ?
                        <>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                        </>
                        :
                        <CircularIndeterminate size={30}/>
                        }
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            TASKS<span>&nbsp;&#40;{tasksListItems?.length}&#41;</span>
                        </Typography>
                        {userFilter != '' ? 
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
                                startAdornment: <InputAdornment position="start"><img src={imgMap.get('user-small.svg')} width='20px'/></InputAdornment>,
                                },
                            }}
                            onKeyDown={(e)=>{if (e.key === 'Enter'){filterByUser(e.target.value)}}}
                        />
                        </Toolbar>
                    </AppBar>
                    <br/><br/>
                    <List>
                        {tasksListItems?.map((task, index)=>{
                            return (
                                <TaskItem task={task} key={index} index={index}/>
                            )
                        })}
                    </List>
                    </Dialog>
                </Fragment>
            </ThemeProvider>
            <BasicDialogModal modalOpen={modalOpen} setModalOpen={setModalOpen} modalContent={<ModalContent/>}/>
            <BasicMessageModal modalOpen={basicMessageOpen} setModalOpen={setBasicMessageOpen} modalContent={basicMessageContent}/>
        </>
    );
}