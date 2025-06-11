import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';
import AppBarHideOnScroll from './AppBarHideOnScroll';
import SwipeableEdgeDrawer from './Drawer';
import useToken from '../../app/useToken';
import { useNavigate } from 'react-router-dom';
import useUserData from '../../app/useUserData';
import CustomContentFormModal from './CustomContentFormModal';
import './Inventory.css'
import BasicMessageModal from './BasicMessageModal';
import Alert from '@mui/material/Alert';
import StorToolTip from './StorToolTip';
import Styled from '@emotion/styled';
import OnClickToolTip from './OnClickToolTip';
import imgMap from '../../app/imgMap';

export default function Inventory() {
    const [partListItems, setPartListItems] = React.useState([]);
    const [unfilteredPartListItems, setUnfilteredPartListItems] = React.useState([])
    const [idx, setIdx] = React.useState(0) // Use to maintain detailed view of query record in various components.
    const [ascending, setAscending] = React.useState(false);
    const [updateInventory, setUpdateInventory] = React.useState(false);
    const [authorizedUser, setAuthorizedUser] = React.useState(false);
    const [basicMessageModalOpen, setBasicMessageModalOpen] = React.useState(false);
    const [basicMessageModalContent, setBasicMessageModalContent] = React.useState('');
    const [pagListItems, setPagListItems] = React.useState([]);
    const [pagIdxMax, setPagIdxMax] = React.useState(1);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [usageData, setUsageData] = React.useState({});
    const [filterOn, setfilterOn] = React.useState(false);
    const [sessionOrds, setSessionOrds] = React.useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;
    const { token } = useToken();
    const navigate = useNavigate();
    const { userData } = useUserData();
    const user = JSON.parse(userData);

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

    React.useEffect(()=>{
        inventoryQuery({query: '113-a:113-b', queryType: 'binLoc', noDialog: true});
    },[])
    
    React.useEffect(()=>{

        // onClick, vert will update content in drawer.
        const verts = document.querySelectorAll('.list-vert');
        const partList = document.querySelectorAll('.inventory-list-item');

        // To index use partListItems[Number(vertIdx)].<property>
        // or edit "renderParts" function.
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

    function inventoryQuery({query, queryType, noDialog}){
        try{
            if(!filterOn){
                fetch(`${apiUrl}/${user.email == 'johndoe@quaad.net' ? 
                    'uwm' : user.institution}/inventory/${queryType}/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`, 
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({query: query})
                })
                .then((res)=>{
                    if(res.status == 401){throw new Error('Unauthorized user')}
                    else if(res.status == 404){throw new Error('No match')}
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
                            setBasicMessageModalContent('No match found.')
                            if(!noDialog){setBasicMessageModalOpen(true)}
                        }else{
                            if(res.length > 30){  // Needs to be paginated.
                                setUnfilteredPartListItems(res)
                                setPagIdxMax(Math.ceil((res.length / 30).toFixed(1)));
                                setPagListItems(res);
                                paginate(res, 1); // Function will setPartListItems
                            }
                            else{
                                setPartListItems(res);
                                setUnfilteredPartListItems(res)
                                setPagIdxMax(1);
                                setPagListItems([]);
                            }
                            setIdx(0);
                            getUsageData(res[0].code, res[0].warehouseCode);
                            setBasicMessageModalContent(`Returned ${res.length} record${res.length > 1 ? 's' : ''}.`);
                            if(!noDialog){setBasicMessageModalOpen(true)};
                        }
                    };
                })
                .catch((err)=>{
                    if (err.message=='Invalid syntax'){
                        setBasicMessageModalContent(err.message);
                        setBasicMessageModalOpen(true);
                    }
                    else if(err.message == 'Unauthorized user'){
                        navigate("/lgn");
                    }
                    else if(err.message == 'Cannot run query'){
                        setBasicMessageModalContent('Could not complete query!');
                        setBasicMessageModalOpen(true);
                    }
                    else if(err.message == 'No match'){
                        setBasicMessageModalContent('No match found!');
                        setBasicMessageModalOpen(true);
                    }
                    else{
                        setBasicMessageModalContent('Could not complete query!');
                        setBasicMessageModalOpen(true);
                        console.log(err)
                    }
                })
            }
            else{ // Filter results.
                const modQry = String(query).trim();
                if(modQry == ''){throw new Error('No input')}
                const filteredParts = [];
                const reDescrStr = '.*' + modQry + '.*';
                const reDesc = new RegExp(reDescrStr, 'i');

                function assessFilter(filter, type){
                    // type: code || warehouseCode
                    const fltr = filter.toString().trim();
                    const fltrArr = fltr.split(' ');
                    if(fltrArr.length > 1){
                        const RegExFilterArr =[];
                        fltrArr.forEach((f)=>{
                            if(type == 'partCode'){
                                const reStr =  '^' + f;
                                const re = new RegExp(reStr, 'i');
                                RegExFilterArr.push(re);
                            }
                            else if(type == 'warehouseCode'){
                                const reStr =  '.*' + f + '$';
                                const re = new RegExp(reStr, 'i');
                                RegExFilterArr.push(re);
                            }
                        })
                        return RegExFilterArr
                    }
                    else{
                        if(type == 'partCode'){
                            const reStr = '^' + fltr;
                            const re = new RegExp(reStr, 'i');
                            return [re]
                        }
                        else if(type == 'warehouseCode'){
                            const reStr =  '.*' + fltr;
                            const re = new RegExp(reStr, 'i');
                            return [re]
                        }
                    }
                }

                function assessBinLoc(binLoc){
                    let colonCount = 0;
                    const binLocArr = binLoc.split("")
                    binLocArr.map((str)=>{
                        if(str==':'){
                            colonCount += 1;
                        }
                    })
                    if(colonCount == 1){ // Indicates a range of bin locations.
                        const binLocSplit = binLoc.split(":");
                        const binLocStartAt = binLocSplit[0].trim();
                        const binLocEndAt = binLocSplit[1].trim();
                        return {locCount: 2, gte: binLocStartAt?.toUpperCase(), lte: binLocEndAt?.toUpperCase()}
                    }
                    else{
                        return { locCount: 1, binLoc: binLoc?.toUpperCase()}
                    }
                }

                // Determines if partListItems or pagListItems need to be accessed for filtering results
                if(!pagListItems.length > 0){ 
                    switch(queryType){
                        case 'binLoc':
                            {
                            const locs = assessBinLoc(modQry)
                            partListItems.forEach((part)=>{
                                if(locs.locCount == 2){
                                    if( locs.gte <= part.binLoc && part.binLoc <= locs.lte ){
                                        filteredParts.push(part)
                                    }
                                }
                                else{
                                    const reLoc = new RegExp(locs.binLoc, 'i');
                                    if(reLoc.test(part.binLoc)){
                                        filteredParts.push(part)
                                    }
                                }
                            })
                            break;
                            }
                        case 'partCode':
                            {
                            const fltr = assessFilter(modQry, 'partCode');
                            partListItems.forEach((part)=>{
                                fltr.forEach((f)=>{if(f.test(part.code)){
                                    filteredParts.push(part)
                                }})
                            })
                            break;
                            }
                        case 'descr':
                            {
                            partListItems.forEach((part)=>{
                                if(reDesc.test(part.description)){
                                    filteredParts.push(part)
                                }
                            })
                            break;
                            }
                        case 'ware':
                            {
                            const warehouseFilter = assessFilter(modQry, 'warehouseCode');
                            partListItems.forEach((part)=>{
                                warehouseFilter.forEach((f)=>{if(f.test(part.warehouseCode)){
                                    filteredParts.push(part)
                                }})
                            })
                            break;
                            }
                    }
                    if(filteredParts.length > 30){  // Needs to be paginated.
                        setPagIdxMax(Math.ceil((filteredParts.length / 30).toFixed(1)));
                        setPagListItems(filteredParts);
                        paginate(filteredParts, 1); // Function will setPartListItems
                    }
                    else{
                        setPartListItems(filteredParts);
                        setPagIdxMax(1);
                        setPagListItems([]);
                    }
                    setIdx(0);
                    if(filteredParts.length > 0 ){getUsageData(filteredParts[0].code, filteredParts[0].warehouseCode)}
                    else{setUsageData([])}
                }
                else{ // Accesses pagListItems for filter instead of partListItems
                    switch(queryType){
                        case 'binLoc':
                            {
                            const locs = assessBinLoc(modQry);
                            pagListItems.forEach((part)=>{
                                if(locs.locCount == 2){
                                    if( locs.gte <= part.binLoc && part.binLoc <= locs.lte ){
                                        filteredParts.push(part)
                                    }
                                }
                                else{
                                    const reLoc = new RegExp(locs.binLoc, 'i');
                                    if(reLoc.test(part.binLoc)){
                                        filteredParts.push(part)
                                    }
                                }
                            })
                            break;
                            }
                        case 'partCode':
                            {  
                            const fltr = assessFilter(modQry,'partCode');
                            pagListItems.forEach((part)=>{
                                fltr.forEach((f)=>{if(f.test(part.code)){
                                    filteredParts.push(part)
                                }})
                            })
                            break
                            }
                        case 'descr':
                            {
                            pagListItems.forEach((part)=>{
                                if(reDesc.test(part.description)){
                                    filteredParts.push(part)
                                }
                            })
                            break;
                            }
                        case 'ware':
                            {
                            const warehouseFilter = assessFilter(modQry, 'warehouseCode');
                            pagListItems.forEach((part)=>{
                                warehouseFilter.forEach((f)=>{if(f.test(part.warehouseCode)){
                                    filteredParts.push(part)
                                }})
                            })
                            break;
                            }
                    }
                    if(filteredParts.length > 30){  // Needs to be paginated.
                        setPagIdxMax(Math.ceil((filteredParts.length / 30).toFixed(1)));
                        setPagListItems(filteredParts);
                        paginate(filteredParts, 1); // Function will setPartListItems
                    }
                    else{
                        setPartListItems(filteredParts);
                        setPagIdxMax(1);
                        setPagListItems([]);
                    }
                    setIdx(0);
                    if(filteredParts.length > 0 ){getUsageData(filteredParts[0].code, filteredParts[0].warehouseCode)}
                    else{setUsageData([])}
                }
            }
        }
        catch(err){
            if(err.message == 'No input'){}
            else{console.log(err)}
        }
    }

    function getUsageData(partcode, warehouseCode){

        fetch(`${apiUrl}/${user.email == 'johndoe@quaad.net' ? 
            'uwm' : user.institution}/inventory/usage_analysis/${partcode}-${warehouseCode}`)
        .then((res)=>{
            if(res.status !== 200){
                throw new Error()
            }
            return res.json()
        })
        .then((res)=>{
            setUsageData(res)
        })
        .catch(()=>{
            setUsageData({});
        })
    }

    const itemsPerPage = 30;
    function paginate(items, page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        setCurrentPage(page);
        setPartListItems(items.slice(start, end));
        setIdx(0);
        const firstItem = items.slice(start, end)[0]
        getUsageData(firstItem.code, firstItem.warehouseCode);
    }
    
    function displayPage(page) {
        paginate(pagListItems, page);
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
        getUsageData(items[0].code, items[0].warehouseCode)
    }

    function getScanResult(result){
        //Function accounts for the following variety of scan results:
            // "22-11147,1"  => partCode,min  || vendorPartCode,min
            // "49735,2,1" => partCode,max,min || vendorPartCode,max,min
            // "70-11235-7032" => partCode-warehouseCode
            // "71-00170" = partCode

        let newResult = result.replace(`"`, ``);
        const hasComma = /,/;
        if(hasComma.test(newResult)){
            newResult = newResult.split(',')[0].trim();
        };

        const resultArr = newResult.split('');
        let hyphenCount = 0;
        resultArr.forEach((char)=>{
            if(char == '-'){hyphenCount++};
        })
        switch(hyphenCount){
            case 1:
                inventoryQuery({query: newResult, queryType: 'partCode' })
                break;
            case 2:
                {
                const modResult = newResult.split('-')[0] + '-' + newResult.split('-')[1];
                inventoryQuery({query: modResult, queryType: 'partCode' })
                break;
                }
            default:
                inventoryQuery({query: newResult, queryType: 'descr' })
        }
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
        return <img width='15px' src={imgMap.get('circled-check-red.svg')} />
    }

    function ListItemCompletedCommentCheck(){
        return <img width='15px' src={imgMap.get('comment-blue-2.svg')} />
    }

    const renderParts = partListItems.map((part, index)=>{

        let modPartCode, modDescription, modBinLoc;
        if(part.code.length + part.warehouseCode.length > 20){modPartCode = (part.code +'-' + part.warehouseCode)?.substring(0, 20) + '...'}
        else{modPartCode = part.code + '-' + part.warehouseCode}
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
                        // ':hover': {backgroundColor: 'rgba(255, 255, 255, 0.027) !important'},
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
                    <IconButton disableRipple className='list-vert' id={`list-vert-${index}`} sx={{float: 'right', color: 'white'}}
                        //vert click function
                        onClick={()=>{getUsageData(part.code, part.warehouseCode)}}
                    >
                        <MoreVertIcon sx={{marginTop: '15px', fontSize: 30}}
                        />
                    </IconButton>
                </ListItem>
                <Divider variant="inset" component="li" />  
            </span>
        )
    })

    function GetAvatar(props){

        // Uncomment to return different avatars for various types of parts.
        // const uni = /^3.*$/;
        // const mech = /^7.*$/;
        // const plumb = /^5.*$/;
        // const elec = /^2.*$/;
        const storGold = 'linear-gradient(to right, #bf953f, #b38728, #aa771c)';

        const bg = props.avaBgIndx % 2 === 0;

        // Remove return statement and uncomment conditions below to return different avatars for various
        // types of parts.
        return(
            <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
                <img src={imgMap.get('tool-box.svg')}/>
            </Avatar>
        )

        // if(uni.test(props.partCode)){
            // return(
            //     <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
            //         <MiscellaneousServicesIcon/>
            //     </Avatar>
        //     )
        // }
        // else if(mech.test(props.partCode)){
        //     return(
        //         <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
        //             <PrecisionManufacturingIcon/>
        //         </Avatar>
        //     )

        // }
        // else if(plumb.test(props.partCode)){
        //     return(
        //         <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
        //             <PlumbingIcon/>
        //         </Avatar>
        //     )
        // }
        // else if(elec.test(props.partCode)){
        //     return(
        //         <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
        //             <ElectricBoltIcon/>
        //         </Avatar>
        //     )
        // }
        // else{
        //     return(
        //         <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
        //             <MiscellaneousServicesIcon/>
        //         </Avatar>
        //     )
        // }
    }

    function InventoryDetailContent(props){
        if(!updateInventory){
        // Inventory Detail

        async function copy(){
            await navigator.clipboard.writeText(`
code: ${partListItems[idx]?.code}
descr: ${partListItems[idx]?.description}
mfgNo: ${partListItems[idx]?.mfgNo}
active: ${partListItems[idx]?.active}
lastPO: ${partListItems[idx]?.lastPODate}
binLoc: ${partListItems[idx]?.binLoc}
warehouseCode: ${partListItems[idx]?.warehouseCode}
min: ${partListItems[idx]?.min}
max: ${partListItems[idx]?.max}
        `)
        } 

        return(
            <> 
                <div style={{ 
                        display: 'flex', 
                        minWidth: '350px',
                        minHeight: '100px', 
                        backgroundColor: props.mobileView ? 'transparent' : 'rgba(22, 22, 22, 0.34)',
                        borderRadius: '2px', 
                        marginBottom: '10px'
                        }}>
                    <div style={{width: '25%', height: '100%'}}>
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
                    <div style={{height: '100%', width: '75%', padding: '5px', paddingRight: '10px', borderLeft: props.mobileView ? 'none' : '5px solid black'}}>
                        {partListItems[idx]?.description}<br/>
                            <span className='inventory-switch-view'>
                                <button onClick={()=>{setUpdateInventory(true)}} style={{all: 'unset'}}>
                                    <div style={{color: 'gray'}}>
                                        <img  src={imgMap.get('database-update.svg')} width='15px'/>
                                        Update
                                    </div>
                                </button>
                            </span>
                            &nbsp;|&nbsp;
                            <span className='inventory-copy-details'>
                                <button 
                                    style={{all: 'unset'}}
                                    onClick={()=>{
                                        copy()         
                                    }}
                                >
                                    <OnClickToolTip
                                        toolTipEl={
                                            <div style={{color: 'gray'}}>
                                                <img className='inventory-copy-details' src={imgMap.get('copy.svg')} width='15px'/>
                                                Copy
                                            </div>
                                        }
                                        toolTipTitle='Copied!'
                                    />
                                </button>
                            </span>
                    </div>
                </div>
                <div style={{marginBottom: '10px'}}>
                        <fieldset style={{boxSizing: 'border-box', height: '60px', width: 'fit-content', borderRadius: '5px', borderColor: 'transparent'}}>
                        <legend style={{color: 'white', fontSize: '13px'}}>lastPODate</legend>
                        <span style={{color: 'gray'}}>{partListItems[idx]?.lastPODate === '' || undefined ? '-'  : partListItems[idx]?.lastPODate }</span>
                        </fieldset>
                </div>
                <div style={{marginBottom: '10px'}}>
                    <fieldset style={{boxSizing: 'border-box', height: '60px', width: 'fit-content', borderRadius: '5px', borderColor: 'transparent'}}>
                    <legend style={{color: 'white', fontSize: '13px'}}>active</legend>
                    <span style={{color: 'gray'}}>{partListItems[idx]?.active}</span>
                    </fieldset>
                </div>
                <div style={{marginBottom: '10px'}}>
                    <fieldset style={{boxSizing: 'border-box', height: '60px', width: 'fit-content', borderRadius: '5px', borderColor: 'transparent'}}>
                    <legend style={{color: 'white', fontSize: '13px'}}>mfgNo</legend>
                    <span style={{color: 'gray'}}>{partListItems[idx]?.mfgNo === '' || undefined ? '-'  : partListItems[idx]?.mfgNo }</span>
                    </fieldset>
                </div>
                <div style={{marginBottom: '10px'}}>
                    <fieldset style={{boxSizing: 'border-box', height: '60px', width: 'fit-content', borderRadius: '5px', borderColor: 'transparent'}}>
                        <legend style={{color: 'white', fontSize: '13px'}}>Warehouse - {partListItems[idx]?.warehouseCode}</legend>
                        <span style={{color: 'gray'}}>
                            avail: {partListItems[idx]?.invtAvail === '' || undefined ? '-'  : partListItems[idx]?.invtAvail}&nbsp;
                            | min: {partListItems[idx]?.min === '' || undefined ? '-'  : partListItems[idx]?.min}&nbsp;
                            | max: {partListItems[idx]?.max === '' || undefined ? '-'  : partListItems[idx]?.max }&nbsp;
                        </span>
                    </fieldset>
                </div>
                <div style={{marginBottom: '10px', marginLeft: '15px', paddingBottom: '10px'}}>
                {usageData?.avgDailyUsage != undefined ?
                <fieldset style={{boxSizing: 'border-box', height: 'fit-content', width: 'fit-content', borderRadius: '5px', border: '1px dotted white'}}>
                        <>
                            <legend style={{color: 'white', fontSize: '13px'}}>Usage - 90 Day Avg:&nbsp; 
                                <span style={{color: 'gray'}}>{usageData.avgDailyUsage.toFixed(2)}</span>
                            </legend>
                            <span style={{color: 'gray'}}>suggested min: {
                                usageData.suggestedMin % 1 == 0 ? usageData.suggestedMin  : 
                                (usageData.suggestedMin + 1).toFixed(0)
                                }</span><br/>
                            <span style={{color: 'gray'}}>p1: {usageData.p1Usage},</span>&nbsp;
                            <span style={{color: 'gray'}}>p2: {usageData.p2Usage},</span>&nbsp;
                            <span style={{color: 'gray'}}>p3: {usageData.p3Usage}</span>
                        </>
                </fieldset>
                :
                <></>
                }
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
            if(props.mobileView){return <img src={imgMap.get('database-update.svg')} width='25px' style={{float: 'right'}}/> }
            else{return(<span>Inventory Update<img src={imgMap.get('database-update.svg')} width='25px' style={{marginLeft: '10px'}}/></span>)}
        }
        else{
            if(props.mobileView){return <img src={imgMap.get('info.svg')} width='25px' style={{float: 'right'}}/> }
            else{return(<><span>Inventory Detail<img src={imgMap.get('info.svg')} width='25px' style={{marginLeft: '10px'}}/></span></>)}
        }
    }

    function UpdateInventoryDetails(props){

        //  updateTypes = [
        //     {name: 'Count'}, 
        //     {name: 'Loc'},
        //     {name: 'Pick'},
        //     {name: 'Reord'},

        // ]

        async function submitUserInput(input){
            //takes input obj
            try{
                const parts = [...partListItems];
                const currentPart = parts[idx];
                const now = new Date();

                let userCompletedCount = false
                let userCompletedComment = false;

                if(input.updateType === 'Count'){
                    userCompletedCount = true;
                    if(input?.userComment != undefined && input.userComment?.trim() != '' ){
                        userCompletedComment = true;
                    }
                    const partDetails = {
                        code: currentPart.code,
                        binLoc: currentPart.binLoc,
                        warehouseCode: currentPart.warehouseCode,
                        inventoryCount: input.count,
                        comment: input?.comment.trim() || '',
                        description: currentPart.description,
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
                            if(userCompletedCount){currentPart.completedCount = true};
                            if(userCompletedComment){currentPart.completedComment = true}
                            setPartListItems(parts);
                        }
                        else{
                            if(res.status == 401){setBasicMessageModalContent(`Unauthorized`)}
                            else{setBasicMessageModalContent(`${res.status} Error`)};
                            setBasicMessageModalOpen(true);
                        }
                    })

                }
                else if(input.updateType === 'Pick' || input.updateType === 'Reord' || input.updateType === 'Loc' || input.updateType === 'Other' ){
                    
                    const partDetails = {
                        code: currentPart.code,
                        binLoc: currentPart.binLoc,
                        warehouseCode: currentPart.warehouseCode,
                        taskType: input.updateType,
                        taskValues: input.taskValues,
                        comment: input?.comment.trim() || '',
                        description: currentPart.description,
                        user: user.email,
                        date: now,
                        completed: false
                    }
                    
                    await fetch(`${apiUrl}/${user.email == 'johndoe@quaad.net' ? 
                        'uwm' : user.institution}/inventory_tasks`, {
                        method: 'POST', 
                        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
                        body: JSON.stringify(
                            partDetails
                        )
                    })
                    .then((res)=>{
                        if(res.status == 201){
                            setBasicMessageModalContent('Submitted');
                            setBasicMessageModalOpen(true);
                            setPartListItems(parts);
                            sendConfirmation(partDetails)
                        }
                        else{
                            if(res.status == 401){setBasicMessageModalContent(`Unauthorized`)}
                            else{setBasicMessageModalContent(`${res.status} Error`)};
                            setBasicMessageModalOpen(true);
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                        setBasicMessageModalContent('Could not complete request!');
                        setBasicMessageModalOpen(true);
                    })
                }
                else if(input.updateType === 'Label' ){
                    const partDetails = {
                        code: currentPart.code,
                        binLoc: currentPart.binLoc,
                        description: currentPart.description,
                        min: currentPart.min,
                        max: currentPart.max,
                        comment: input?.comment.trim() || '',
                        user: user.email,
                        date: now,
                        completed: false
                    }
                    await fetch(`${apiUrl}/${user.email == 'johndoe@quaad.net' ? 
                        'uwm' : user.institution}/inventory_tasks_print`, {
                        method: 'POST', 
                        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
                        body: JSON.stringify(
                            partDetails
                        )
                    })
                    .then((res)=>{
                        if(res.status == 201){
                            setBasicMessageModalContent('Submitted');
                            setBasicMessageModalOpen(true);
                            setPartListItems(parts);
                        }
                        else{
                            if(res.status == 401){setBasicMessageModalContent(`Unauthorized`)}
                            else{setBasicMessageModalContent(`${res.status} Error`)};
                            setBasicMessageModalOpen(true);
                        }
                    })
                    .catch((err)=>{
                        console.log(err)
                        setBasicMessageModalContent('Could not complete request!');
                        setBasicMessageModalOpen(true);
                    })
                }
            }
            catch(err){
                console.log(err);
                setBasicMessageModalContent('Could not complete request!');
                setBasicMessageModalOpen(true);
            }
        }

        async function sendConfirmation(partDetails){
            fetch(`${apiUrl}/${user.institution}/notif`, 
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
                    body: JSON.stringify(partDetails)
                }
            )
            .then((res)=>{
                return res.json()
            })
            .then((res)=>{console.log(res)})
            .catch((err)=>{
                console.log(err);
            })
        }

        function PickModalContent(){
            const [displayAlert, setDisplayAlert] = React.useState(false);
            const [alertContent, setAlertContent] = React.useState('');

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

            function PickExposedEL(){
                function ListItem(){
                    return(
                    <li 
                        className='inventory-update-type'
                        style={{textAlign: 'center', width: 'fit-content', listStyle: 'none', margin: '5px', paddingLeft:'5px', paddingRight:'5px'}}
                    ><img src={imgMap.get('square-outlined-small.svg')} width='10px'/>&nbsp;Pick
                    </li>
                    )
                }
                return<ListItem/>
            }

            function PickForm(){
                const [tmpWorkOrder, setTmpWorkOrder] = React.useState(0);
                const [tmpReorderAmt, setTmpReorderAmt] = React.useState(0);
                const [tmpComment, setTmpComment]  = React.useState('');
                const [tmpQtyUsed, setTmpQtyUsed]  = React.useState(0);

                function submitForm(){
                    try{
                        if(Number(tmpWorkOrder) * 0  === 0 && tmpWorkOrder != ''){}
                        else{throw new Error('Please enter a numeric value for Workorder!')};
                        if(Number(tmpQtyUsed) * 0  === 0 && tmpQtyUsed != ''){}
                        else{throw new Error('Please enter a numeric value for Qty Used!')};
                        if(Number(tmpReorderAmt) * 0 == 0){}
                        else{throw new Error('Please enter a numeric value for Reorder Amount!')}
                        submitUserInput({taskValues: JSON.stringify({
                            workorder: tmpWorkOrder, qtyUsed: tmpQtyUsed, reorderAmt:  tmpReorderAmt}), 
                            comment: tmpComment, updateType: 'Pick'}
                        );
                    }
                    catch(err){
                        setAlertContent(err.message);
                        setDisplayAlert(true);
                    }
                }
                
                return(
                    <>  
                        <ErrorAlert/>
                        <div style={{width: '100%', margin: 'auto'}}>
                            <form>
                                <input 
                                    inputMode='numeric'
                                    className='stor-input'
                                    style={{width: '99%', borderLeft: 0, borderTop: 0, borderRight: 0, fontSize: 'medium',
                                        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
                                    }}
                                    type='text' 
                                    placeholder='(#) Workorder' 
                                    required
                                    onChange={(e)=>{
                                        setTmpWorkOrder(e.target.value);
                                    }}
                                />
                                <input
                                    inputMode='numeric'
                                    className='stor-input'
                                    style={{width: '99%', borderLeft: 0, borderTop: 0, borderRight: 0, fontSize: 'medium',
                                        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
                                    }}
                                    type='text' 
                                    placeholder='(#) Qty Used' 
                                    required
                                    onChange={(e)=>{
                                        setTmpQtyUsed(e.target.value);
                                    }}
                                />
                                <input
                                    inputMode='numeric'
                                    className='stor-input'
                                    style={{width: '99%', borderLeft: 0, borderTop: 0, borderRight: 0, fontSize: 'medium',
                                        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
                                    }}
                                    type='text' 
                                    placeholder='(#) Reorder Amount' 
                                    onChange={(e)=>{
                                        setTmpReorderAmt(e.target.value);
                                    }}
                                />
                                <CommentBox setTmpComment={setTmpComment}/>
                                <div style={{width: 'fit-content',margin: 'auto'}}>
                                <FormButton
                                    type='button' 
                                        onClick={(e)=>{
                                            e.preventDefault();
                                            submitForm();
                                        }}>
                                            <img src={imgMap.get('circled-check.svg')} width='30px'/>
                                </FormButton>
                                <FormButton 
                                    type='reset' 
                                    >
                                        <img src={imgMap.get('pulsar-clear.svg')} width='30px'/>
                                </FormButton>
                                </div>
                            </form>
                        </div>
                    </>
                )
            }
            return(<CustomContentFormModal key='inventory-pick-modal' exposedEl={[<PickExposedEL key=''/>]} modalContent={<PickForm/>} setAlertContent={setAlertContent} setDisplayAlert={setDisplayAlert}/>)
        }

        function CountModalContent(){
            const [displayAlert, setDisplayAlert] = React.useState(false);
            const [alertContent, setAlertContent] = React.useState('');

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
                function ListItem(){
                    return(
                    <li 
                        className='inventory-update-type'
                        style={{textAlign: 'center', width: 'fit-content', listStyle: 'none', margin: '5px', paddingLeft:'5px', paddingRight:'5px'}}
                    ><img src={imgMap.get('square-outlined-small.svg')} width='10px'/>&nbsp;Count
                    </li>
                    )
                }
                return<ListItem/>
            }

            function CountForm(){
                const [tmpCount, setTmpCount] = React.useState(0);
                const [tmpComment, setTmpComment]  = React.useState('');

                function submitForm(){
                    try{
                        if(Number(tmpCount) * 0  === 0 && tmpCount != ''){}
                        else{throw new Error('Please enter a numeric value for Count!')};
                        submitUserInput({count: tmpCount, comment: tmpComment, updateType: 'Count'}
                        );
                    }
                    catch(err){
                        setAlertContent(err.message);
                        setDisplayAlert(true);
                    }
                }
                
                return(
                    <>  
                        <ErrorAlert/>
                        <div style={{width: '100%', margin: 'auto'}}>
                            <form>
                                <input 
                                    inputMode='numeric'
                                    className='stor-input'
                                    style={{width: '99%', borderLeft: 0, borderTop: 0, borderRight: 0, fontSize: 'medium',
                                        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
                                    }}
                                    type='text' 
                                    placeholder='(#) Count' 
                                    onChange={(e)=>{
                                        setTmpCount(e.target.value);
                                    }}
                                />
                                <CommentBox setTmpComment={setTmpComment}/>
                                <div style={{width: 'fit-content',margin: 'auto'}}>
                                <FormButton 
                                    type='button' 
                                        onClick={(e)=>{
                                            e.preventDefault();
                                            submitForm();
                                        }}>
                                            <img src={imgMap.get('circled-check.svg')} width='30px'/>
                                </FormButton>
                                <FormButton 
                                    type='reset' 
                                    >
                                        <img src={imgMap.get('pulsar-clear.svg')} width='30px'/>
                                </FormButton>
                                </div>
                            </form>
                        </div>
                    </>
                )
            }
            return(<CustomContentFormModal key='inventory-count-modal' exposedEl={[<CountExposedEL/>]} modalContent={<CountForm/>} setAlertContent={setAlertContent} setDisplayAlert={setDisplayAlert}/>)
        }

        function ReorderModalContent(){
            const [displayAlert, setDisplayAlert] = React.useState(false);
            const [alertContent, setAlertContent] = React.useState('');

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

            function ReordExposedEL(){
                function ListItem(){
                    return(
                    <li 
                        className='inventory-update-type'
                        style={{textAlign: 'center', width: 'fit-content', listStyle: 'none', margin: '5px', paddingLeft:'5px', paddingRight:'5px'}}
                    ><img src={imgMap.get('square-outlined-small.svg')} width='10px'/>&nbsp;Reord
                    </li>
                    )
                }
                return<ListItem/>
            }

            function ReordForm(){
                const [tmpReord, setTmpReord] = React.useState(0);
                const [tmpComment, setTmpComment]  = React.useState('');

                function addToSessionOrd({reorderAmt, comment}){
                    const ords = [...sessionOrds];
                    const currentPart = partListItems[idx];
                    const now = new Date();
                    const partDetails = {
                        ...currentPart, 
                        reorderAmt: reorderAmt,
                        comment: comment?.trim() || '',      
                        date: now,
                        _id: currentPart.code + '-' + currentPart.binLoc + currentPart.warehouseCode
                    }
                    ords.push(partDetails)
                    setSessionOrds(ords);
                }

                function submitForm(){
                    try{
                        if(Number(tmpReord) * 0  == 0 && tmpReord != ''){}
                        else{throw new Error('Please enter a numeric value for Reorder Amount!')};
                        if(document.querySelector('#session-ord').checked){addToSessionOrd({reorderAmt: tmpReord, comment: tmpComment})}
                        else{submitUserInput({taskValues: JSON.stringify({reorderAmt: tmpReord}), comment: tmpComment, updateType: 'Reord'})}
                    }
                    catch(err){
                        setAlertContent(err.message);
                        setDisplayAlert(true);
                    }
                }
                
                return(
                    <>  
                        <ErrorAlert/>
                        <div style={{width: '100%', margin: 'auto'}}>
                            <form>
                                <input 
                                    inputMode='numeric'
                                    className='stor-input'
                                    style={{width: '99%', borderLeft: 0, borderTop: 0, borderRight: 0, fontSize: 'medium',
                                        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
                                    }}
                                    type='text' 
                                    placeholder='(#) Reorder Amount' 
                                    onChange={(e)=>{
                                        setTmpReord(e.target.value);
                                    }}
                                />
                                <CommentBox setTmpComment={setTmpComment}/>
                                <div style={{marginLeft: '20px'}}>
                                    <input 
                                        type='checkbox'
                                        id='session-ord'
                                    />
                                        Add to session?
                                </div>
                                <div style={{width: 'fit-content', margin: 'auto'}}>
                                <FormButton 
                                    type='button' 
                                    onClick={(e)=>{
                                        e.preventDefault();
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
                                </div>
                            </form>
                        </div>
                    </>
                )
            }
            return(<CustomContentFormModal key='inventory-reord-modal' exposedEl={[<ReordExposedEL/>]} modalContent={<ReordForm/>} setAlertContent={setAlertContent} setDisplayAlert={setDisplayAlert}/>)
        }

        function LocationModalContent(){
            const [displayAlert, setDisplayAlert] = React.useState(false);
            const [alertContent, setAlertContent] = React.useState('');

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

            function LocExposedEL(){
                function ListItem(){
                    return(
                    <li 
                        className='inventory-update-type'
                        style={{textAlign: 'center', width: 'fit-content', listStyle: 'none', margin: '5px', paddingLeft:'5px', paddingRight:'5px'}}    
                    ><img src={imgMap.get('square-outlined-small.svg')} width='10px'/>&nbsp;Loc
                    </li>
                    )
                }
                return<ListItem/>
            }

            function LocationForm(){
                const [tmpLoc, setTmpLoc] = React.useState('');
                const [tmpComment, setTmpComment]  = React.useState('');

                function submitForm(){
                    try{
                        if(tmpLoc != ''){}
                        else{throw new Error('Please enter a new BinLoc!')};
                        submitUserInput({taskValues: JSON.stringify({binLoc: tmpLoc}), comment: tmpComment, updateType: 'Loc'})
                    }
                    catch(err){
                        setAlertContent(err.message);
                        setDisplayAlert(true);
                    }
                }
                
                return(
                    <>  
                        <ErrorAlert/>
                        <div style={{width: '100%', margin: 'auto'}}>
                            <form>
                                <input 
                                    className='stor-input'
                                    style={{width: '99%', borderLeft: 0, borderTop: 0, borderRight: 0, fontSize: 'medium',
                                        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
                                    }}
                                    type='text' 
                                    placeholder={`("") BinLoc`} 
                                    onChange={(e)=>{
                                        setTmpLoc(e.target.value);
                                    }}
                                />
                                <CommentBox setTmpComment={setTmpComment}/>
                                <div style={{width: 'fit-content',margin: 'auto'}}>
                                <FormButton 
                                    type='button' 
                                        onClick={(e)=>{
                                            e.preventDefault();
                                            submitForm();
                                        }}>
                                            <img src={imgMap.get('circled-check.svg')} width='30px'/>
                                </FormButton>
                                <FormButton 
                                    type='reset' 
                                    >
                                        <img src={imgMap.get('pulsar-clear.svg')} width='30px'/>
                                </FormButton>
                                </div>
                            </form>
                        </div>
                    </>
                )
            }
            return(<CustomContentFormModal key='inventory-location-modal' exposedEl={[<LocExposedEL/>]} modalContent={<LocationForm/>} setAlertContent={setAlertContent} setDisplayAlert={setDisplayAlert} />)
        }

        function LabelModalContent(){
            const [displayAlert, setDisplayAlert] = React.useState(false);
            const [alertContent, setAlertContent] = React.useState('');

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

            function LabelExposedEL(){
                function ListItem(){
                    return(
                    <li 
                        className='inventory-update-type'
                        style={{textAlign: 'center', width: 'fit-content', listStyle: 'none', margin: '5px', paddingLeft:'5px', paddingRight:'5px'}}
                    ><img src={imgMap.get('square-outlined-small.svg')} width='10px'/>&nbsp;Label
                    </li>
                    )
                }
                return<ListItem/>
            }

            function LabelForm(){
                const [tmpComment, setTmpComment]  = React.useState('');

                function submitForm(){
                    try{
                        submitUserInput({updateType: 'Label', comment: tmpComment});
                    }
                    catch(err){
                        setAlertContent(err.message);
                        setDisplayAlert(true);
                    }
                }
                
                return(
                    <>  
                        <ErrorAlert/>
                        <div style={{width: '100%', margin: 'auto'}}>
                            <form>
                                <CommentBox setTmpComment={setTmpComment}/>
                                <div style={{width: 'fit-content',margin: 'auto'}}>
                                    <div>Add to print jobs.</div>
                                    <FormButton
                                        type='button' 
                                        onClick={(e)=>{
                                            e.preventDefault();
                                            submitForm();
                                        }}>
                                            <img src={imgMap.get('circled-check.svg')} width='30px'/>
                                    </FormButton>
                                    <FormButton 
                                        type='reset' 
                                    >
                                        <img src={imgMap.get('pulsar-clear.svg')} width='30px'/>
                                    </FormButton>
                                </div>
                            </form>
                        </div>
                    </>
                )
            }
            return(<CustomContentFormModal key='inventory-label-modal' exposedEl={[<LabelExposedEL/>]} modalContent={<LabelForm/>} setAlertContent={setAlertContent} setDisplayAlert={setDisplayAlert}/>)
        }

        function OtherModalContent(){
            const [displayAlert, setDisplayAlert] = React.useState(false);
            const [alertContent, setAlertContent] = React.useState('');

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

            function OtherExposedEL(){
                function ListItem(){
                    return(
                    <li 
                        className='inventory-update-type'
                        style={{textAlign: 'center', width: 'fit-content', listStyle: 'none', margin: '5px', paddingLeft:'5px', paddingRight:'5px'}}    
                    ><img src={imgMap.get('square-outlined-small.svg')} width='10px'/>&nbsp;Other
                    </li>
                    )
                }
                return<ListItem/>
            }

            function OtherForm(){
                const [tmpComment, setTmpComment]  = React.useState('');

                function submitForm(){
                    try{
                        if(tmpComment.trim() != ''){}
                        else{throw new Error('Please enter details in Comment!')};
                        submitUserInput({taskValues: JSON.stringify('Other'), comment: tmpComment, updateType: 'Other'})
                    }
                    catch(err){
                        setAlertContent(err.message);
                        setDisplayAlert(true);
                    }
                }
                
                return(
                    <>  
                        <ErrorAlert/>
                        <div style={{width: '100%', margin: 'auto'}}>
                            <form>
                                <CommentBox setTmpComment={setTmpComment}/>
                                <div style={{width: 'fit-content',margin: 'auto'}}>
                                <FormButton 
                                    type='button' 
                                        onClick={(e)=>{
                                            e.preventDefault();
                                            submitForm();
                                        }}>
                                            <img src={imgMap.get('circled-check.svg')} width='30px'/>
                                </FormButton>
                                <FormButton 
                                    type='reset' 
                                    >
                                        <img src={imgMap.get('pulsar-clear.svg')} width='30px'/>
                                </FormButton>
                                </div>
                            </form>
                        </div>
                    </>
                )
            }
            return(<CustomContentFormModal key='inventory-other-modal' exposedEl={[<OtherExposedEL/>]} modalContent={<OtherForm/>} setAlertContent={setAlertContent} setDisplayAlert={setDisplayAlert} />)
        }

        function CommentBox(props){
            return(
                <textarea 
                {...(props?.commentBoxId ? {id: props.commentBoxId} : {})}
                onChange={(e)=>{
                    props.setTmpComment(e.target.value)
                }}
                className={`inventory-comment-box`}
                maxLength={250}
                placeholder={'(...) Comment'}
                style={{
                    resize: 'none', 
                    border: 'none', 
                    width: '200px',
                    padding: '12px',
                    paddingRight: '20px',
                    fontFamily: `Inter, system-ui, Avenir, Helvetica, Arial, sans-serif`, 
                    fontSize: 'medium',
                    backgroundColor: 'transparent',
                    color: 'white',
                    msOverflowStyle: 'none', 
                    scrollbarWidth: 'none', 
                    '::WebkitScrollbar': {display: 'none'}
                }} 
                rows="3" 
                cols="28" 
                >
                </textarea>
            )
        }

        function CompletedCountCheck(){
            return <img width='20px' src={imgMap.get('circled-check-red.svg')}/>
        }

        function CompletedCommentCheck(){
            return <img width='20px' src={imgMap.get('comment-blue-2.svg')}/> 
        }
    
        if(partListItems.length > 0){
        return(
            <div style={{width: props?.mobileView ? '100%' : 400, margin: 'auto'}}>
                <div 
                    style={{...(props?.mobileView ? 
                        {margin: 'auto', width: 'fit-content', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '10px'} : {float: 'right', width: '45px'})}}
                > 
                    <IconButton disableRipple className='inventory-prev' sx={{color: 'white', marginRight: '25px', 
                    }} 
                    onClick={()=>{
                        setIdxPrev();
                    }}>
                        <StorToolTip 
                            toolTipEl={
                                <img src={imgMap.get('left-circled-arrow.svg')} width='35px'/>
                            }
                            toolTipTitle='Previous'
                        />
                    </IconButton>
                    <IconButton 
                        disableRipple
                        sx={{color: 'white', marginRight: '25px', 
                        }} 
                        onClick={()=>{setUpdateInventory(false)}}
                    > 
                        <StorToolTip 
                            toolTipEl={
                                <img src={imgMap.get('pulsar-circled-info.svg')} width='35px'/>
                            }
                            toolTipTitle='Info'
                        />
                    </IconButton>
                    <IconButton disableRipple className='inventory-next' sx={{color: 'white'}} onClick={()=>{
                        setIdxNext();
                    }}>
                        <StorToolTip 
                            toolTipEl={
                                <img src={imgMap.get('right-circled-arrow.svg')} width='35px'/>
                            }
                            toolTipTitle='Next'
                        />
                    </IconButton>
                </div>  
                <br/>
                <div style={{ ...(props.mobileView ? {margin: 'auto', width: 'fit-content'} : {})}}>
                    <div style={{display: 'flex'}}>
                        <CountModalContent/>
                        <PickModalContent/>
                        <ReorderModalContent/>
                    </div>
                    <div style={{display:'flex', marginLeft: '35px'}}>
                        <LocationModalContent/>
                        <LabelModalContent/>
                        <OtherModalContent/>
                    </div>
                </div>
                <div id='inventory-update-type-divider' style={{...(props.mobileView ? {margin: 'auto'}: {}), border: '1px solid white', width: '80%', marginTop: '5px'}}></div>
                <div style={{display: 'flex', marginTop: '10px'}}>
                    <div style={{width: '25%', overflow: 'auto', scrollbarWidth: 'thin'}}>
                        <div style={{
                            ...(props?.mobileView ? {width: '25%', paddingLeft: '10px'} : {})}}><strong>Code:&nbsp;{props?.mobileView ? <br/> : <></>}</strong> 
                            <span style={{color: 'gray'}}>{partListItems[idx]?.code.length > 10 ? partListItems[idx]?.code.substring(0, 10) + '...' : partListItems[idx]?.code}</span>&nbsp; 
                            {partListItems[idx]?.completedCount ? <CompletedCountCheck/>:''}
                            {partListItems[idx]?.completedComment ? <CompletedCommentCheck/>:''}
                        </div>
                    </div>
                    <div style={{width: '75%'}}>
                        <div style={{maxWidth:'230px', lineBreak: 'loose', ...(props?.mobileView ? 
                                {paddingLeft: '10px'} : {})}} ><strong>Bin Location:</strong>&nbsp;
                                <span style={{color: 'gray'}}>
                                    {partListItems[idx]?.binLoc.length > 15 ? partListItems[idx]?.binLoc.substring(0, 15) + '...' : partListItems[idx]?.binLoc}
                                </span>
                            </div>
                        <div style={{maxWidth:'230px', lineBreak: 'loose', ...(props?.mobileView ? 
                            {paddingLeft: '10px'} : {})}}><strong>Description:</strong>&nbsp; 
                            <span style={{color: 'gray'}}>
                                {partListItems[idx]?.description.length > 30 ? 
                                partListItems[idx]?.description.substring(0, 30) + '...' :  partListItems[idx]?.description}
                            </span>
                        </div>
                    </div>
                </div>
                <br/>
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
                        resultCount={partListItems.length}
                        partListItems={partListItems}
                        pagIdxMax={pagIdxMax}
                        setPagListItems={setPagListItems}
                        pagListItems={pagListItems}
                        setPagIdxMax={setPagIdxMax}
                        displayPage={displayPage}
                        currentPage={currentPage}
                        setfilterOn={setfilterOn}
                        filterOn={filterOn}
                        setPartListItems={setPartListItems}
                        unfilteredPartListItems={unfilteredPartListItems}
                        paginate={paginate}
                        setIdx={setIdx}
                        getUsageData={getUsageData}
                        sessionOrds={sessionOrds}
                        setSessionOrds={setSessionOrds}
                    />
                    {renderParts}
                    <SwipeableEdgeDrawer 
                        mainContentHeader={<MainContentHeader mobileView={true}/>}
                        InventoryDetailContent={<InventoryDetailContent mobileView={true}/>}
                        listSelectionDetail={partListItems[idx]}
                        resultCount={partListItems.length}
                        updateInventory={updateInventory}
                    />
                </List>
                <div className='inventory-desktop-tablet-content' style={{position: 'absolute', marginLeft: '400px', top: '100px', color: 'white'}}>
                    <h1 style={{margin: '0', padding: '0'}}><MainContentHeader/>
                    </h1>
                    <InventoryDetailContent/>
                </div>
                <BasicMessageModal setModalOpen={setBasicMessageModalOpen} modalOpen={basicMessageModalOpen} modalContent={basicMessageModalContent} />
            </>
        )
    }
    else return <></>
}