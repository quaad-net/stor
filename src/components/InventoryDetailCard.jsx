// export default function InventoryDetailCard(props) {

//     function RenderItemDetails(){
//         for (let [key, value] of Object.entries(props.inventoryItem)) {
//             return(
//                 <div key={key}>
//                     <fieldset style={{boxSizing: 'border-box', height: '60px', width: '300px', borderRadius: '5px', borderColor: 'transparent'}}>
//                     <legend style={{color: 'black', fontSize: '13px'}}>{key}</legend>
//                     <span style={{color: 'black', fontSize: '25px'}}>{value}</span>
//                     </fieldset>
//                 </div>
//             )
//         }
//     }
      

//     return (
//     <>
//         <div style={{display: 'flex', width: '350px', height: '100px', backgroundColor: 'gray', borderRadius: '2px', marginBottom: '10px'}}>
//             <div style={{ height: '100%', width: '25%',}}>
//             <div style={{width: '25%', paddingLeft: '5px'}}>{props.inventoryItem?.code}<br/>{props?.inventoryItem?.binLoc}</div>
//             </div>
//             <div style={{ height: '100%', width: '75%', paddingLeft: '5px', borderLeft: '5px solid black'}}>{props.inventoryItem?.description}</div>
//         </div>
//         <div>
//             {/* {props.inventoryItem.map((item, index) => (
//             <div key={index}>
//                 <fieldset style={{boxSizing: 'border-box', height: '60px', width: '300px', borderRadius: '5px', borderColor: 'transparent'}}>
//                 <legend style={{color: 'black', fontSize: '13px'}}>{item}</legend>
//                 <span style={{color: 'black', fontSize: '25px'}}>{item[index]}</span>
//                 </fieldset>
//             </div>
//             ))} */}
//             <RenderItemDetails/>
//         </div>
//     </>
//     );
// }
