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
// import PaginationRounded from './PaginationRounded';

import './Inventory.css'

export default function Inventory() {
    const [partListItems, setPartListItems] = React.useState([]);
    const [idx, setIdx] = React.useState(0) // Use to maintain detailed view of query record in various components.
    const [ascending, setAscending] = React.useState(false);
    const [updateInventory, setUpdateInventory] = React.useState(false);
    // const [tabletView, setTabletView] = React.useState(false)
    const apiUrl = import.meta.env.VITE_API_URL;
    const { token } = useToken();
    const navigate = useNavigate();

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
                navigate("/")
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


    function DesktopTabletContent(){
        if(!updateInventory){
        // Inventory Detaiil
        return(
          <div style={{padding: '5px', maxWidth: 400}}>
            <br/>
            <div style={{fontSize: 'large'}}><strong>{partListItems[idx]?.description}</strong></div><br/>
            <div><strong>code:</strong> {partListItems[idx]?.code}</div>
            <div><strong>binLoc:</strong> {partListItems[idx]?.binLoc}</div>
            <div><strong>active:</strong> {partListItems[idx]?.active}</div>
            <div><strong>fy14Expn:</strong> {partListItems[idx]?.fy14Expn}</div>
            <div><strong>invtAvail:</strong> {partListItems[idx]?.invtAvail}</div>
            <div><strong>lastPODate:</strong> {partListItems[idx]?.lastPODate}</div>
            <div><strong>min:</strong> {partListItems[idx]?.min}</div>
            <div><strong>max:</strong> {partListItems[idx]?.max}</div>
            <div><strong>vendorName:</strong> {partListItems[idx]?.vendorName}</div>
            <div><strong>vendorNo:</strong> {partListItems[idx]?.vendorNo}</div>
            <div><strong>mfgNo:</strong> {partListItems[idx]?.mfgNo}</div>
          </div>
        )
        }
        else{
            return(
                <>
                    <br/>
                    <div>
                        <UpdateInventoryCounts 
                        />
                    </div>
                </>)
        }
    }

    function DeskTopTabletHeader(){
        if(updateInventory){
            return(<span>Inventory Update</span>)
        }
        else{
            return(<span>Inventory Detail</span>)
        }
    }

    function ReturnedResults(){
        return(
          <div style={{marginLeft: '70px', color: 'rgba(128, 128, 128, 0.255)'}}>Returned {partListItems?.length} Results</div>
        )
      }

    function UpdateInventoryCounts(props){

        const [userComment, setUserComment] = React.useState('');
        const [userQty, setUserQty] = React.useState('');

        React.useEffect(()=>{
            const focusOnCommentImg = document.querySelector('.inventory-focus-on-comment');
            const commentBox = document.querySelector('.inventory-comment-box');
            focusOnCommentImg.addEventListener('click', ()=>{
                commentBox.focus()
            })
            return focusOnCommentImg.addEventListener('click', ()=>{
                commentBox.focus()
            })
        }, [])

        function submitUserInput(){

            const parts = [...partListItems];
            const currentPart = parts[idx];
            let resStatus;

            let userCompletedCount = false
            let userCompletedComment = false;
            if(Number(userQty) * 0 === 0){
                userCompletedCount = true;
                if(userComment?.trim() != ''){
                    userCompletedComment = true;
                }
                const partDetails = {
                    code: currentPart.code,
                    binLoc: currentPart.binLoc,
                    inventoryCount: Number(userQty),
                    comment: userComment?.trim(),
                    description: currentPart.description
                } 

                //POST codemark
                fetch(`${apiUrl}/inventorycount`, {
                    method: 'POST', 
                    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
                    body: JSON.stringify(partDetails)
                })
                .then((res)=>{
                    if(res.status == 201){
                        currentPart.completedCount = true;
                        if(userCompletedComment){currentPart.completedComment = true}
                        setPartListItems(parts);
                    }
                    else{
                        alert(`${res.status} Error`)
                    }
                })
            }
            else{alert('Please enter a number.')}
        }

        function CompletedCountCheck(){
            return <img width='20px' src='/circled-check-red.svg'/>
        }

        function CompletedCommentCheck(){
            return <img width='20px' src='/comment-blue-2.svg'/> 
        }
    
        if(partListItems.length > 0){
        return(
            <div style={{width: props?.mobileView ? '100%' : 400}}>
                <div style={{...(props?.mobileView ? 
                    {width: '75px', float: 'right', overflow: 'hidden', textOverflow: 'ellipsis'} : {})}}
                > 
                    <IconButton className='inventory-prev' sx={{color: 'white', marginRight: '25px', 
                    ...(props?.mobileView ? {marginBottom: '20px'} : {})}} onClick={()=>{
                        setIdxPrev();
                    }}>
                        <img src='/left-circled-arrow.svg' width='35px'/>
                    </IconButton>
                    <IconButton sx={{color: 'white', marginRight: '25px', 
                        ...(props?.mobileView ? {marginBottom: '20px'} : {})}} onClick={submitUserInput}>
                        <img src='/circled-check.svg' width='35px'/>
                    </IconButton>
                    <IconButton className='inventory-next' sx={{color: 'white'}} onClick={()=>{
                        setIdxNext();
                    }}>
                        <img src='/right-circled-arrow.svg' width='35px'/>
                    </IconButton>
                </div>  
                <br/>
                <div>
                    <fieldset 
                        style={{
                            width: 'fit-content', 
                            height: 'fit-content', 
                            borderRadius: '5px',
                            ...(props?.mobileView ? {marginLeft: '10px'} : {}),
                        }}>
                        <legend>Qty Avail</legend>
                        <input 
                            maxLength={10}
                            style={{      
                                border: 'none', 
                                fontFamily: `"DM Sans", sans-serif`, 
                                fontSize: 'large',
                                backgroundColor: 'transparent',
                                color: 'white',
                                width: '75px',
                                maxWidth: '100px',
                                height: 'fit-content'
                            }}
                            name="inventory-user-qty-input" 
                            id='inventory-user-qty-input'
                            onChange={(e)=>{setUserQty(e.target.value)}}
                        />
                    </fieldset>
                    <IconButton className='inventory-focus-on-comment' sx={{marginLeft: '5px'}} disableRipple onClick={()=>{
                    }} >
                        <img src='/round-message.svg' width='25px'/>
                    </IconButton>
                </div>
                <div style={{fontSize: '20px', 
                    ...(props?.mobileView ? {width: '200px', paddingLeft: '10px'} : {})}}><strong>Part Code:{props?.mobileView ? <br/> : <></>}</strong> {partListItems[idx]?.code}&nbsp; 
                    {partListItems[idx]?.completedCount ? <CompletedCountCheck/>:''}
                    {partListItems[idx]?.completedComment ? <CompletedCommentCheck/>:''}
                </div>
                <br/>
                <div style={{...(props?.mobileView ? 
                    {width: '300px', paddingLeft: '10px'} : {})}} ><strong>Bin Location:</strong> {partListItems[idx]?.binLoc}
                </div>
                <div style={{...(props?.mobileView ? 
                    {width: '300px', paddingLeft: '10px'} : {})}}><strong>Description:</strong> {partListItems[idx]?.description}
                </div>
                <br/>
                <fieldset style={{
                    borderRadius: '5px', 
                    height: '115px', 
                    maxHeight: '115px', 
                    width: '300px', 
                    maxWidth: '300px',
                    ...(props?.mobileView ? {marginLeft: '10px'} : {}),
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
            </div>
            
        )
        }
        else{return <></>}
    }

    return (
        <>
            <List className='inventory-list' sx={{height:'100%', bgcolor: 'rgb(22, 22, 22)', marginTop: '0', paddingTop: '0' }}>
                <AppBarHideOnScroll 
                    inventoryQuery={inventoryQuery} 
                    sort={sort} 
                    setUpdateInventory={setUpdateInventory} 
                    updateInventory={updateInventory}
                />
                {renderParts}
                <SwipeableEdgeDrawer 
                    listSelectionDetail={partListItems[idx]}
                    resultCount={partListItems.length}
                    updateInventory={updateInventory}
                    updateInventoryCounts={<UpdateInventoryCounts mobileView={true}/>}
                />
            </List>
            <div className='inventory-desktop-tablet-content' style={{position: 'absolute', marginLeft: '400px', top: '100px', color: 'white'}}>
                <h1 style={{margin: '0', padding: '0'}}><DeskTopTabletHeader/>
                </h1>
                <DesktopTabletContent/>
            </div>
        </>
    );
}