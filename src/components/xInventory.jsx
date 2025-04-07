import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';
import AppBarHideOnScroll from './AppBarHideOnScroll';
import SwipeableEdgeDrawer from './Drawer';
import useToken from '../../app/useToken';
import { useNavigate } from 'react-router-dom';
import useUserData from '../../app/useUserData';
import BasicModalSelection from './BasicModalSelection';
import './Inventory.css'

export default function Inventory() {
    const [partListItems, setPartListItems] = React.useState([]);
    const [idx, setIdx] = React.useState(0) // Use to maintain detailed view of query record in various components.
    const [ascending, setAscending] = React.useState(false);
    const [updateInventory, setUpdateInventory] = React.useState(false);
    const [authorizedUser, setAuthorizedUser] = React.useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const { token } = useToken();
    const navigate = useNavigate();
    const { userData } = useUserData();

    // React.useEffect(()=>{
    //   const atMedia = window.matchMedia("(min-width:501px) and (max-width: 899px)")
      
    //   function updateTabletView(){
    //     setTabletView(atMedia.matches)
    //   }
    //   atMedia.addEventListener('change', updateTabletView);

    //   return atMedia.removeEventListener('change', updateTabletView);
    // },[])

    React.useEffect(()=>{
        inventoryQuery({query: '110-a:110-b', queryType: 'binLoc'})
    },[])
    
    React.useEffect(()=>{

        // onClick, vert will update content in drawer.
        const verts = document.querySelectorAll('.list-vert');
        const partList = document.querySelectorAll('.inventory-list-item');

        verts.forEach((vert)=>{
            const vertIdx = vert.getAttribute('id').replace('list-vert-', '');
            vert.addEventListener('click', ()=>{
                setIdx(Number(vertIdx));
                partList.forEach((item)=>{
                    item.style.backgroundColor = 'rgb(22, 22, 22)';
                })
                const li = document.querySelector(`.inventory-li-${vertIdx}`);
                li.style.backgroundColor = 'rgba(255, 255, 255, 0.027)';
            });
        })

        return verts.forEach((vert)=>{
            const vertIdx = vert.getAttribute('id').replace('list-vert-', '');
            vert.removeEventListener('click', ()=>{
                setIdx(Number(vertIdx));
                partList.forEach((item)=>{
                    item.style.backgroundColor = 'rgb(22, 22, 22)';
                })
                const li = document.querySelector(`.inventory-li-${vertIdx}`);
                li.style.backgroundColor = 'rgba(255, 255, 255, 0.027)';
            });
        })
    })

    function inventoryQuery({query, queryType}){

        if(query === ''){throw new Error('Invalid syntax')}
        
        fetch(`${apiUrl}/inventory/${queryType}/${query}`, {
            method: 'POST',
            headers: {Authorization: `Bearer ${token}`}
        })
        .then((res)=>{
            if(res.status == 401){throw new Error('Unauthorized user')}
            else if(res.status == 404){throw new Error('Cannot run query')}
            else if(res.status == 400){throw new Error('Invalid syntax')}
            else if(res.status == 500){throw new Error('Something went wrong')}
            else{
                setAuthorizedUser(true)
                return res.json()
            }
        })
        .then((res)=>{
            if(res.message == 'Invalid query format'){throw new Error('Invalid syntax')}
            else{
                if(res.length == 0){
                    alert('No match found');
                }else{
                    setPartListItems(res);
                }
            };
        })
        .catch((err)=>{
            if (err.message=='Invalid syntax'){alert(err.message)}
            else if(err.message == 'Unauthorized user'){
                navigate("/lgn");
            }
            else if(err.message == 'Cannot run query'){alert('Could not complete query!')}
            else{
                alert('Something went wrong!')
                console.log(err)
            }
        })
    }

    function sort(){

        const items = [...partListItems];
        if(ascending){
            items.sort((a, b) => {
                const item1 = a.binLoc;
                const item2 = b.binLoc;
                if(item1 !== item2){
                    if (item1 < item2) {
                    return -1;
                    }
                    if (item1 > item2) {
                    return 1;
                    }
                    return 0;
                }
                else{
                    const item3 = a.code;
                    const item4 = b.code;

                    if (item3 < item4) {
                    return -1;
                    }
                    if (item3 > item4) {
                    return 1;
                    }
                    return 0;
                }
            });
        }
        else{
            items.sort((b, a) => {
                const item1 = a.binLoc;
                const item2 = b.binLoc;
                if(item1 !== item2){
                    if (item1 < item2) {
                    return -1;
                    }
                    if (item1 > item2) {
                    return 1;
                    }
                    return 0;
                }
                else{
                    const item3 = a.code;
                    const item4 = b.code;

                    if (item3 < item4) {
                    return -1;
                    }
                    if (item3 > item4) {
                    return 1;
                    }
                    return 0;
                }
            });
        }
        setAscending(!ascending);
        setPartListItems(items);
        setIdx(0);
        removeActiveSelection();
    }

    function getScanResult(result){
        inventoryQuery({query: result, queryType: 'partCode' });
    }


    function setIdxNext(){
    
        if(partListItems[ idx + 1 ] !== undefined){
            setIdx(idx + 1);
            removeActiveSelection();
            highlightActiveSelection(idx + 1)
            
        }
        else{
            setIdx(0);
            removeActiveSelection();
            highlightActiveSelection(0)
        }
    }

    function setIdxPrev(){
        if(partListItems[idx - 1] !== undefined){
            setIdx(idx - 1);
            removeActiveSelection();
            highlightActiveSelection(idx - 1)
        }
        else{
            setIdx(partListItems.length - 1);
            removeActiveSelection();
            highlightActiveSelection(partListItems.length - 1);
        }
    }

    function removeActiveSelection(){
        const partList = document.querySelectorAll('.inventory-list-item');
        partList.forEach((item)=>{
            item.style.backgroundColor = 'rgb(22, 22, 22)';
        })
    }

    function highlightActiveSelection(index){
        document.querySelector(`.inventory-li-${index}`).style.backgroundColor ='rgba(255, 255, 255, 0.027)'
    }

    function ListItemCompletedCountCheck(){
        return <img width='15px' src='/circled-check-red.svg' />
    }

    function ListItemCompletedCommentCheck(){
        return <img width='15px' src='/comment-blue-2.svg' />
    }

    const renderParts = partListItems.map((part, index)=>{

        let modPartCode, modDescription, modBinLoc;
        if(part.code.length > 15){modPartCode = (part.code)?.substring(0, 15) + '...'}
        else{modPartCode = part.code}
        if(part.description.length > 27){modDescription = (part.description)?.substring(0, 27) + '...'}
        else{modDescription = part.description}
        if(part.binLoc.length > 20){modBinLoc = (part.binLoc)?.substring(0, 20) + '...'}
        else{modBinLoc = part.binLoc}
        return(
            <span key={`key-${index}-${part.code}-${part.binLoc}`}>
                <ListItem
                    alignItems="flex-start" 
                    className={`inventory-list-item ${index == partListItems.length -1 ? 'last-list-item' : ''}
                    ${index === idx ? 'inventory-list-active' : ''} inventory-li-${index}`} 
                    sx={{marginTop: '0', 
                        ':hover': {backgroundColor: 'rgba(255, 255, 255, 0.005) !important'},
                    }} 
                    >
                    <GetAvatar partCode={part.code} avaBgIndx={index}/>
                    <ListItemText
                    primary={
                        <Typography
                        component="span"    
                        sx={{ color: 'white', display: 'block' }}
                        >
                            <span className='inventory-list-part-code'>
                                {modPartCode} 
                                {part?.completedCount ? <ListItemCompletedCountCheck/> : '' } 
                                {part?.completedComment ? <ListItemCompletedCommentCheck/> : ''}
                            </span>
                        </Typography>
                    }
                    secondary={
                        <React.Fragment>
                        <Typography
                            component="span"
                            variant="body2"
                            sx={{ color: 'gray', display: 'inline' }}
                        >
                            <span className='inventory-list-binloc'>{modBinLoc}</span>
                            <span className='inventory-list-description' style={{color: 'gray'}}><br/>{modDescription}</span>
                        </Typography>
                        </React.Fragment>
                    }
                    />
                    <IconButton className='list-vert' id={`list-vert-${index}`} sx={{float: 'right', color: 'white'}}>
                        <MoreVertIcon sx={{marginTop: '15px', fontSize: 30}}/>
                    </IconButton>
                </ListItem>
                <Divider variant="inset" component="li" />  
            </span>
        )
    })

    function GetAvatar(props){

        const uni = /^3.*$/;
        const mech = /^7.*$/;
        const plumb = /^5.*$/;
        const elec = /^2.*.$/;
        const storGold = 'linear-gradient(to right, #bf953f, #b38728, #aa771c)'

        const bg = props.avaBgIndx % 2 === 0;

        if(uni.test(props.partCode)){
            return(
                <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
                    <MiscellaneousServicesIcon/>
                </Avatar>
            )
        }
        else if(mech.test(props.partCode)){
            return(
                <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
                    <PrecisionManufacturingIcon/>
                </Avatar>
            )

        }
        else if(plumb.test(props.partCode)){
            return(
                <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
                    <PlumbingIcon/>
                </Avatar>
            )
        }
        else if(elec.test(props.partCode)){
            return(
                <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
                    <ElectricBoltIcon/>
                </Avatar>
            )
        }
        else{
            return(
                <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
                    <MiscellaneousServicesIcon/>
                </Avatar>
            )
        }
    }


    function InventoryDetailContent(props){
        if(!updateInventory){
        // Inventory Detaiil
        return(
            <> 
                <div style={{ 
                        display: 'flex', 
                        minWidth: '350px',
                        minHeight: '100px', 
                        backgroundColor: props.mobileView ? 'transparent' : 'rgba(22, 22, 22, 0.34)',
                        // backgroundColor: 'rgba(22, 22, 22, 0.34)', 
                        borderRadius: '2px', 
                        marginBottom: '10px'
                        }}>
                    <div style={{width: '25%', height: '100%', width: '25%',}}>
                        <div style={{padding: '5px'}}>
                            <span style={{color: props.mobileView ? 'white' : 'gold'}}>{partListItems[idx]?.code}</span><br/>
                            <span 
                                style={{
                                    display: 'block', 
                                    width: '100%', 
                                    borderBottom: props.mobileView ? '1px solid gold' : '1px solid white'
                                }}>&nbsp;</span><span>{partListItems[idx]?.binLoc}    
                            </span>
                        </div>
                    </div>
                    <div style={{height: '100%', width: '75%', padding: '5px', paddingRight: '10px', borderLeft: props.mobileView ? 'none' : '5px solid black'}}>{partListItems[idx]?.description} </div>
                </div>
                <div style={{display: 'flex'}}>
                    <div style={{marginBottom: '10px'}}>
                        <fieldset style={{boxSizing: 'border-box', height: '60px', width: 'fit-content', borderRadius: '5px', borderColor: 'transparent'}}>
                        <legend style={{color: 'white', fontSize: '13px'}}>active</legend>
                        <span style={{color: 'white', fontSize: '25px'}}>{partListItems[idx]?.active}</span>
                        </fieldset>
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <fieldset style={{boxSizing: 'border-box', height: '60px', width: 'fit-content', borderRadius: '5px', borderColor: 'transparent'}}>
                        <legend style={{color: 'white', fontSize: '13px'}}>fy14Expn</legend>
                        <span style={{color: 'white', fontSize: '25px'}}>{partListItems[idx]?.fy14Expn}</span>
                        </fieldset>
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <fieldset style={{boxSizing: 'border-box', height: '60px', width: 'fit-content', borderRadius: '5px', borderColor: 'transparent'}}>
                        <legend style={{color: 'white', fontSize: '13px'}}>invtAvail</legend>
                        <span style={{color: 'white', fontSize: '25px'}}>{partListItems[idx]?.invtAvail === '' || undefined ? '-'  : partListItems[idx]?.invtAvail}</span>
                        </fieldset>
                    </div>
                </div>
                <div style={{marginBottom: '10px'}}>
                        <fieldset style={{boxSizing: 'border-box', height: '60px', width: 'fit-content', borderRadius: '5px', borderColor: 'transparent'}}>
                        <legend style={{color: 'white', fontSize: '13px'}}>lastPODate</legend>
                        <span style={{color: 'white', fontSize: '25px'}}>{partListItems[idx]?.lastPODate === '' || undefined ? '-'  : partListItems[idx]?.lastPODate }</span>
                        </fieldset>
                </div>
                <div style={{marginBottom: '10px'}}>
                    <fieldset style={{boxSizing: 'border-box', height: '60px', width: 'fit-content', borderRadius: '5px', borderColor: 'transparent'}}>
                    <legend style={{color: 'white', fontSize: '13px'}}>min</legend>
                    <span style={{color: 'white', fontSize: '25px'}}>{partListItems[idx]?.min === '' || undefined ? '-'  : partListItems[idx]?.min }</span>
                    </fieldset>
                </div>
                <div style={{marginBottom: '10px'}}>
                    <fieldset style={{boxSizing: 'border-box', height: '60px', width: 'fit-content', borderRadius: '5px', borderColor: 'transparent'}}>
                    <legend style={{color: 'white', fontSize: '13px'}}>max</legend>
                    <span style={{color: 'white', fontSize: '25px'}}>{partListItems[idx]?.max === '' || undefined ? '-'  : partListItems[idx]?.max }</span>
                    </fieldset>
                </div>
                <div style={{marginBottom: '10px'}}>
                    <fieldset style={{boxSizing: 'border-box', height: '60px', width: 'fit-content', borderRadius: '5px', borderColor: 'transparent'}}>
                    <legend style={{color: 'white', fontSize: '13px'}}>vendorNo</legend>
                    <span style={{color: 'white', fontSize: '25px'}}>{partListItems[idx]?.vendorNo === '' || undefined ? '-'  : partListItems[idx]?.vendorNo }</span>
                    </fieldset>
                </div>
                <div style={{marginBottom: '10px'}}>
                    <fieldset style={{boxSizing: 'border-box', height: '60px', width: 'fit-content', borderRadius: '5px', borderColor: 'transparent'}}>
                    <legend style={{color: 'white', fontSize: '13px'}}>mfgNo</legend>
                    <span style={{color: 'white', fontSize: '25px'}}>{partListItems[idx]?.mfgNo === '' || undefined ? '-'  : partListItems[idx]?.mfgNo }</span>
                    </fieldset>
                </div>
            </>
        )
        }
        else{
            return(
                <>
                    <br/>
                    <div>
                        <UpdateInventoryDetails {...(props.mobileView ? {mobileView: true}: {})}
                        />
                    </div>
                </>)
        }
    }

    function MainContentHeader(props){
        if(updateInventory){
            if(props.mobileView){return <img src='/database-update.svg' width='25px' style={{float: 'right'}}/> }
            else{return(<span>Inventory Update<img src='/database-update.svg' width='25px' style={{marginLeft: '10px'}}/></span>)}
        }
        else{
            if(props.mobileView){return <img src='/info.svg' width='25px' style={{float: 'right'}}/> }
            else{return(<><span>Inventory Detail<img src='/info.svg' width='25px' style={{marginLeft: '10px'}}/></span></>)}
        }
    }

    function UpdateInventoryDetails(props){

        const [userComment, setUserComment] = React.useState('');
        const [userUpdate, setUserUpdate] = React.useState(null);
        const [userQty, setUserQty] = React.useState('');
        const [userPick, setUserPick] = React.useState('');
        const [userBinLoc, setUserBinLoc] = React.useState('');
        const [updateType, setUpdateType] = React.useState('Count');
        const [workorder, setWorkorder] = React.useState('');
        const [reorder, setReorder] = React.useState(false);
        const [reorderAmt, setReorderAmt] = React.useState(0);
        const [displayFormModal, setDisplayFormModal] = React.useState(false);
        const [formModalContent, SetFormModalContent] = React.useState(null);
        
        const updateTypes = [
            {name: 'Count', onclick: ()=>{}}, 
            {name: 'BinLoc', onclick: ()=>{}},
            {name: 'Pick', onclick: ()=>{}},
            {name: 'Reorder', onclick: ()=>{}},

        ]

        function submitUserInput(){

            const parts = [...partListItems];
            const currentPart = parts[idx];
            const user = JSON.parse(userData);
            const now = new Date();

            let userCompletedCount = false
            let userCompletedComment = false;

            if(updateType === 'Count'){
                if(Number(userUpdate) * 0 === 0){
                    userCompletedCount = true;
                    if(userComment?.trim() != ''){
                        userCompletedComment = true;
                    }
                    const partDetails = {
                        code: currentPart.code,
                        binLoc: currentPart.binLoc,
                        inventoryCount: Number(userUpdate),
                        comment: userComment?.trim() || '',
                        description: currentPart.description,
                        user: user.email,
                        date: now
                    } 
                    console.log(partDetails)
                    // fetch(`${apiUrl}/inventory_count`, {
                    //     method: 'POST', 
                    //     headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
                    //     body: JSON.stringify(partDetails)
                    // })
                    // .then((res)=>{
                    //     if(res.status == 201){
                    //         if(userCompletedCount){currentPart.completedCount = true};
                    //         if(userCompletedComment){currentPart.completedComment = true}
                    //         setPartListItems(parts);
                    //     }
                    //     else{
                    //         alert(`${res.status} Error`)
                    //     }
                    // })
                }
                else{alert('Please enter a number.')}
            }else if(updateType === 'BinLoc'){
                if(userUpdate?.trim() !== undefined && userUpdate?.trim() !== ''){
                    const partDetails = {
                        code: currentPart.code,
                        binLoc: currentPart.binLoc,
                        taskType: updateType,
                        taskValue: userUpdate.trim(),
                        comment: userComment?.trim() || '',
                        description: currentPart.description,
                        user: user.email,
                        date: now,
                        completed: false
                    } 
                    console.log(partDetails);
                    // fetch(`${apiUrl}/inventory_tasks`, {
                    //     method: 'POST', 
                    //     headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
                    //     body: JSON.stringify(partDetails)
                    // })
                    // .then((res)=>{
                    //     if(res.status == 201){
                    //         setPartListItems(parts);
                    //         alert('Submitted!')
                    //     }
                    //     else{
                    //         alert(`${res.status} Error`)
                    //     }
                    // })
                }
                else{alert('Please enter a location.')}
            }
            else if(updateType === 'Pick' || updateType === 'Reorder'){
                const partDetails = {
                    code: currentPart.code,
                    binLoc: currentPart.binLoc,
                    taskType: updateType,
                    // taskValue: userUpdate,
                    taskValue: {
                        ...(updateType === 'Pick' ? {workorder: workorder} : {}),
                        reorder: reorder,
                        reorderAmt: reorderAmt
                    },
                    comment: userComment?.trim() || '',
                    description: currentPart.description,
                    user: user.email,
                    date: now,
                    completed: false
                } 
                console.log(partDetails)
                // fetch(`${apiUrl}/inventory_tasks`, {
                //     method: 'POST', 
                //     headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
                //     body: JSON.stringify(partDetails)
                // })
                // .then((res)=>{
                //     if(res.status == 201){
                //         setPartListItems(parts);
                //         alert('Submitted!');
                //     }
                //     else{
                //         alert(`${res.status} Error`)
                //     }
                // })
            }
        }

        function ReorderModalContent(){
            const [reorderAmtDisplayed, setReorderAmtDisplayed] = React.useState(false)
            return(
                <>
                    <input type='checkbox' name='reorder' id='inventory-reorder' onChange={()=>{
                        setReorder(!reorder);
                        setReorderAmtDisplayed(!reorderAmtDisplayed);
                        }}/>
                    <label htmlFor='inventory-reorder'>Reorder?</label>
                    <input 
                        style={{display: reorderAmtDisplayed ? 'block' : 'none'}} 
                        id='inventory-reorder-amt' 
                        type='number' 
                        placeholder='Reorder Amt' 
                        onChange={(e)=>{setReorderAmt(e.target.value)}} 
                    />
                </>
            )
        }

        function PickModalContent(){
            const [reorderAmtDisplayed, setReorderAmtDisplayed] = React.useState(false)
            return(
                <>
                    <input type='text' placeholder='Workorder' required  onChange={(e)=>{setWorkorder(e.target.value)}}/>
                    <input type='checkbox' name='reorder' id='inventory-reorder' onChange={()=>{
                        setReorder(!reorder);
                        setReorderAmtDisplayed(!reorderAmtDisplayed);
                        }}/>
                    <label htmlFor='inventory-reorder'>Reorder?</label>
                    <input 
                        style={{display: reorderAmtDisplayed ? 'block' : 'none'}} 
                        id='inventory-reorder-amt' 
                        type='number' 
                        placeholder='Reorder Amt' 
                        onChange={(e)=>{setReorderAmt(e.target.value)}} 
                    />
                </>
            )
        }

        const ExposedELs = [<PickExposedEL/>, <ReorderExposedEL/>];
        const additionalContent = ExposedELs;

        function PickExposedEL(){
            const pick =             
            {
                name: 'Pick', 
                // onclick: ()=>{
                //     SetFormModalContent(<PickModalContent/>);
                //     setDisplayFormModal(true);
                // }
            }
            
            function ListItem(){
                return(
                <li
                    style={{marginBottom: '20px', paddingRight: '25px', listStyle: 'square'}}
                    onClick={()=>{
                        setUpdateType(pick.name);
                        SetFormModalContent(<PickModalContent/>);
                        setDisplayFormModal(true);
        
                    }} 
                >        {pick.name}
                </li>
                )
            }
            // return(<CustomContentFormModal modalContent={formModalContent} exposedEl={[<ListItem/>]} />)
            return<ListItem/>
        }

        function ReorderExposedEL(){
            // const [modalOpen, setModalOpen]  = React.useState(false)
            const reorder =             
            {
                name: 'Reorder', 
                // onclick: ()=>{
                //     SetFormModalContent(<ReorderModalContent/>);
                //     setDisplayFormModal(true);
                // }
            }
            
            function ListItem(){
                return(
                <li
                    style={{marginBottom: '20px', paddingRight: '25px', listStyle: 'square'}}
                    onClick={()=>{
                        setUpdateType(reorder.name);
                        SetFormModalContent(<ReorderModalContent/>)
                        setDisplayFormModal(true);
        
                    }} 
                >        {reorder.name}
                </li>
                )
            }
            // return(<CustomContentFormModal modalContent={formModalContent} exposedEl={[<ListItem/>]} />)
            return <ListItem/>
        }

        function CompletedCountCheck(){
            return <img width='20px' src='/circled-check-red.svg'/>
        }

        function CompletedCommentCheck(){
            return <img width='20px' src='/comment-blue-2.svg'/> 
        }
    
        if(partListItems.length > 0){
        return(
            <div style={{width: props?.mobileView ? '100%' : 400, margin: 'auto'}}>
                {/* <form> */}
                <div 
                    // style={{...(props?.mobileView ? 
                    // {width: '75px', float: 'right', overflow: 'hidden', textOverflow: 'ellipsis'} : {})}}
                    style={{...(props?.mobileView ? 
                        {margin: 'auto', width: 'fit-content', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '10px'} : {float: 'right', width: '30px'})}}
                > 
                    <IconButton className='inventory-prev' sx={{color: 'white', marginRight: '25px', 
                    // ...(props?.mobileView ? {marginBottom: '20px'} : {})
                    }} 
                    onClick={()=>{
                        setIdxPrev();
                    }}>
                        <img src='/left-circled-arrow.svg' width='35px'/>
                    </IconButton>
                    <IconButton sx={{color: 'white', marginRight: '25px', 
                        // ...(props?.mobileView ? {marginBottom: '20px'} : {})
                        }} onClick={submitUserInput}>
                        <img src='/circled-check.svg' width='35px'/>
                    </IconButton>
                    <IconButton className='inventory-next' sx={{color: 'white'}} onClick={()=>{
                        setIdxNext();
                    }}>
                        <img src='/right-circled-arrow.svg' width='35px'/>
                    </IconButton>
                </div>  
                <br/>
                <div style={{display: 'flex', ...(props.mobileView ? {margin: 'auto', width: 'fit-content'} : {})}}>
                    <fieldset 
                        style={{
                            paddingLeft: 0,
                            width: '75px', 
                            height: 'fit-content', 
                            borderRadius: '5px',
                            ...(props?.mobileView ? {marginLeft: '10px'} : {}),
                        }}>
                        <legend>
                            <BasicModalSelection selectionName={updateType} setUpdateType={setUpdateType} selections={updateTypes}
                            />
                        </legend>
                        <input 
                            maxLength={updateType === 'BinLoc' ? 25 : 10}
                            style={{      
                                border: 'none', 
                                fontFamily: `"DM Sans", sans-serif`, 
                                fontSize: 'large',
                                backgroundColor: 'transparent',
                                color: 'white',
                                width: '75px',
                                maxWidth: '100px',
                                height: 'fit-content',
                                paddingLeft: '10px',
                            }}
                            name="inventory-user-update-input" 
                            id='inventory-user-update-input'
                            onChange={(e)=>{setUserUpdate(e.target.value)}}
                        />
                    </fieldset>
                    <fieldset 
                        style={{
                            display: updateType === 'Pick' ? 'block' : 'none',
                            paddingLeft: 0,
                            width: '75px',
                            height: 'fit-content', 
                            borderRadius: '5px',
                            ...(props?.mobileView ? {marginLeft: '10px'} : {}),
                        }}>
                        <legend>WkOrdr
                        </legend>
                        <input 
                            maxLength={25}
                            type='number'
                            style={{    
                                border: 'none', 
                                fontFamily: `"DM Sans", sans-serif`, 
                                fontSize: 'large',
                                backgroundColor: 'transparent',
                                color: 'white',
                                width: '75px',
                                maxWidth: '100px',
                                height: 'fit-content',
                                paddingLeft: '10px',
                            }}
                            name="inventory-user-workorder-input" 
                            id='inventory-user-workorder-input'
                            onChange={(e)=>{setWorkorder(e.target.value)}}
                        />
                    </fieldset>
                    <fieldset 
                        style={{
                            display: updateType === 'Pick' ? 'block' : 'none',
                            paddingLeft: 0,
                            width: '75px',
                            height: 'fit-content', 
                            borderRadius: '5px',
                            ...(props?.mobileView ? {marginLeft: '10px'} : {}),
                        }}>
                        <legend>ReOrQty
                        </legend>
                        <input 
                            maxLength={10}
                            type='number'
                            style={{    
                                border: 'none', 
                                fontFamily: `"DM Sans", sans-serif`, 
                                fontSize: 'large',
                                backgroundColor: 'transparent',
                                color: 'white',
                                width: '75px',
                                maxWidth: '100px',
                                height: 'fit-content',
                                paddingLeft: '10px',
                            }}
                            name="inventory-user-reorder-input" 
                            id='inventory-user-reorder-input'
                            onChange={(e)=>{setReorder(e.target.value)}}
                        />
                    </fieldset>
                </div>
                <div style={{display: 'flex', marginTop: '10px'}}>
                    <div style={{width: '25%', overflow: 'auto', scrollbarWidth: 'thin'}}>
                        <div style={{
                            ...(props?.mobileView ? {width: '25%', paddingLeft: '10px'} : {})}}><strong>Part Code:{props?.mobileView ? <br/> : <></>}</strong> {partListItems[idx]?.code}&nbsp; 
                            {partListItems[idx]?.completedCount ? <CompletedCountCheck/>:''}
                            {partListItems[idx]?.completedComment ? <CompletedCommentCheck/>:''}
                        </div>
                    </div>
                    <div style={{width: '75%'}}>
                        <div style={{maxWidth:'230px', lineBreak: 'loose', ...(props?.mobileView ? 
                                {paddingLeft: '10px'} : {})}} ><strong>Bin Location:</strong> {partListItems[idx]?.binLoc}
                            </div>
                        <div style={{maxWidth:'230px', lineBreak: 'loose', ...(props?.mobileView ? 
                            {paddingLeft: '10px'} : {})}}><strong>Description:</strong> {partListItems[idx]?.description}
                        </div>
                    </div>
                </div>

                <br/>
                <fieldset style={{
                    borderRadius: '5px', 
                    height: '115px', 
                    maxHeight: '115px', 
                    width: '300px', 
                    maxWidth: '300px',
                    ...(props?.mobileView ? {margin: 'auto'} : {}),
                    }}>
                    <legend>Comment</legend>
                    <textarea 
                        className='inventory-comment-box'
                        maxLength={250}
                        placeholder={'...'}
                        style={{
                            resize: 'none', 
                            border: 'none', 
                            fontFamily: `"DM Sans", sans-serif`, 
                            fontSize: 'large',
                            backgroundColor: 'transparent',
                            color: 'white',
                            scrollbarWidth: 'thin',
                            msOverflowStyle: 'none', 
                            scrollbarWidth: 'none', 
                            '::WebkitScrollbar': {display: 'none'}
                        }} 
                        rows="3" 
                        cols="28" 
                        onChange={(e)=>{
                            setUserComment(e.target.value)
                        }}
                        >
                    </textarea>
                </fieldset>
                <br/>
                {/* <CustomContentFormModal open={displayFormModal} modalContent={formModalContent}/> */}
                {/* <button type='submit' style={{all: 'unset', margin: '10px'}}>Submit</button>
                <button type='reset' style={{all: 'unset', margin: '10px'}}>Clear</button> */}
                {/* </form> */}
            </div>
            
        )
        }
        else{return <></>}
    }
    if(authorizedUser){
        return (
            <>
                <List className='inventory-list' sx={{height:'100%', bgcolor: 'rgb(22, 22, 22)', marginTop: '0', paddingTop: '0' }}>
                    <AppBarHideOnScroll 
                        inventoryQuery={inventoryQuery} 
                        sort={sort} 
                        setUpdateInventory={setUpdateInventory} 
                        updateInventory={updateInventory}
                        getScanResult={getScanResult}
                    />
                    {renderParts}
                    <SwipeableEdgeDrawer 
                        mainContentHeader={<MainContentHeader mobileView={true}/>}
                        InventoryDetailContent={<InventoryDetailContent mobileView={true}/>}
                        listSelectionDetail={partListItems[idx]}
                        resultCount={partListItems.length}
                        updateInventory={updateInventory}
                        // UpdateInventoryDetails={<UpdateInventoryDetails mobileView={true}/>}
                    />
                </List>
                <div className='inventory-desktop-tablet-content' style={{position: 'absolute', marginLeft: '400px', top: '100px', color: 'white'}}>
                    <h1 style={{margin: '0', padding: '0'}}><MainContentHeader/>
                    </h1>
                    <InventoryDetailContent/>
                </div>
            </>
        )
    }
    else return <></>
}