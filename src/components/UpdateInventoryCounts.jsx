// import { IconButton } from '@mui/material';
// import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
// import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
// import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
// import { useEffect } from 'react';


// export default function UpdateInventoryCounts(props){

//     function updateCompletedCounts(){
//         const parts = [...props?.partListItems];
//         const currentPart = parts[props?.idx];
//         currentPart.completedCount = true;
//         props.setPartListItems(parts);
        
//     }

//     function CompletedCountCheck(){
//         return <img width='20px' src='/circled-check-red.svg'/>
//     }

//     if(props.partListItems.length > 0){
//     return(
//         <div style={{width: 400}}>
//             <div> 
//                 <IconButton sx={{color: 'white', marginRight: '25px'}} onClick={updateCompletedCounts}>
//                     <CheckCircleOutlineOutlinedIcon fontSize='large'/>
//                 </IconButton>
//                 <IconButton sx={{color: 'white', marginRight: '25px'}} onClick={()=>{
//                     props.removeActiveSelection();
//                     props.setIdxPrev();
//                     // props.highlightActiveSelection(props.idx);
//                 }}>
//                     <ArrowCircleLeftOutlinedIcon fontSize='large' />
//                 </IconButton>
//                 <IconButton sx={{color: 'white'}} onClick={()=>{
//                     props.removeActiveSelection()
//                     props.setIdxNext();
//                     // props.highlightActiveSelection(props.idx);
//                 }}>
//                     <ArrowCircleRightOutlinedIcon fontSize='large'/>
//                 </IconButton>
//             </div>  
//             <br/>
//             <div>
//                 <label style={{marginLeft: '10px'}} htmlFor="partcode"><i>Qty Avail:</i></label><br/>
//                 <input 
//                     className="stor-input"
//                     style={{paddingLeft: 5, width: 75, marginLeft: '10px'}} 
//                     name="partcode" 
//                 />
//             </div>
//             <br/>
//             <div><strong>Part Code:</strong> {props?.listSelectionDetail?.code}&nbsp; 
//                 {props.listSelectionDetail?.completedCount ? <CompletedCountCheck/>:''}
//             </div>
//             <br/>
//             <div><strong>Bin Location:</strong> {props?.listSelectionDetail?.binLoc}</div>
//             <div><strong>Description:</strong> {props?.listSelectionDetail?.description}</div>
//         </div>
        
//     )
//     }
//     else{return <></>}
// }