import './InventoryPick.css';
import { useState, useEffect } from 'react';
import useUserData from '../../app/useUserData';
import './ScannerModal.css'
import SidebarTools from './SidebarTools';
import UserFormDialog from './UserFormDialog';
import InventoryPickActions from './InventoryPickActions';

function InventoryPick(){

    const [partInfo, setPartInfo] = useState([]); 
    const [reorder, setReorder] = useState(false);
    const [formDate, setFormDate] = useState(new Date());
    const {userData} = useUserData();
    const [userAuthorized, setUserAuthorized] = useState(false);
    const [displayCam, setDisplayCam] = useState(false);
    const [pickUserFirstName, setPickUserFirstName] = useState('');
    const [pickUserLastName, setPickUserLastName] = useState('');
    const [pickUserTrade, setPickUserTrade] = useState('');
    const [multiParts, setMultiParts] = useState(false);
    const [partsAdded, setPartsAdded] = useState(false);
    const [idx, setIdx] = useState(0);  // Used to maintain/sychronize view of part detail across UI.
    const [sidebarHeight, setSidebarHeight] = useState('435px');
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(()=>{setPartsAdded(partInfo.length > 0)});
    useEffect(()=>{setMultiParts(partInfo.length > 1)});
    useEffect(()=>{
        // Note: isEditing is used to prevent effect from setting idx (this allows the UI view to remain on the same part)
        // after editing part details using <InventoryPickActions/> => <PickUpdate/>.
        // isEditing also needs to be set to false when adding a new part right after editing a part,
        // which is done in <InventoryPickActions/> => <PickAdd/>
        if(!isEditing){ 
            if(partInfo.length > 0){setIdx(partInfo.length -1)}; // prev: partInfo[partInfo.length-1] !== undefined
            if(partInfo.length == 0){setIdx(0)}
        }
        else{
            setIsEditing(false);
        }
    },[partInfo.length])
    
    useEffect(()=>{
        if(userData != ''){
            const userProps = JSON.parse(userData);
            setPickUserFirstName(userProps.firstName?.toUpperCase());
            setPickUserLastName(userProps.lastName?.toUpperCase());
            setPickUserTrade(userProps?.trade || userProps?.position)
        }
        else{
            setPickUserFirstName('Guest');
            setPickUserLastName('User');
            setPickUserTrade('Dept 0000')
        }
    }, [])

    function removePart(index){

        const updatedPartInfo = [];
        let deletedPart; 
        partInfo.map((p)=>{
            if(p.id != `added-part-${index}`){
                const newPartDetails = {...p, id: `added-part-${updatedPartInfo.length}`}
                updatedPartInfo.push(newPartDetails)
            }
            else{
                deletedPart = {...p}
            }
        })
        setIsEditing(false)
        setPartInfo(updatedPartInfo);
        setIdx(0)
        alert(`Part ${deletedPart.part} Removed`);
    }

    function showPartInfoModal(){

        const modal = document.querySelector('#part-info-modal');
        const modalBackground = document.querySelector('.part-info-modal');
        const close = document.querySelector('.part-info-modal-close');
        modal.style.display = "block";
        close.addEventListener('click', ()=>{ 
            modal.style.display = 'none';
        })
        document.addEventListener('click', (e)=>{
            if(e.target == modalBackground){
                modal.style.display = 'none';
            }
        })
       
        function removeModal(e){
            if(e.key === 'Escape'){
                modal.style.display= "none";
            }
        }

        document.addEventListener('keydown', removeModal);
  
    }

    function modalSubmit(){
        document.querySelector('#part-info-modal').style.display = "none";
        document.querySelector('form').reset();
        setReorder(false);
        setPartInfo([]);
        clearInvalids();
    }

    function addPartHist(partDetails){
        const part = partDetails.partCode;
        const fName = pickUserFirstName;
        const lName = pickUserLastName;
        const trade = pickUserTrade;
        const tmpDesc = partDetails.description;
        let description;
        if(tmpDesc.length > 35){description = tmpDesc.substring(0, 34) + '...'}
        else{description = tmpDesc};
        const qty = partDetails.qty;
        const unit = partDetails.unit;
        const warehouse = partDetails.warehouse;
        const woNo = partDetails.workorder;
        const reorder = partDetails.reorder;
        const reorderAmt = partDetails?.reorderAmt;
        const key = partInfo.length;
        const id = `added-part-${key}`;
        const partInfoArr = [
            ...partInfo, 
            {
                part: part,
                id: id,
                description: description,
                qty: qty,
                unit: unit,
                warehouse: warehouse,
                workorder: woNo,
                reorder: reorder,
                reorderAmt: reorderAmt,
                technicianInfo :
                    {
                        firstName: fName,
                        lastName: lName,
                        trade: trade,
                        date: formDate.toDateString(),
                    }
            }
        ];
        
        setPartInfo(partInfoArr);
    }

    function showInValids(){
        const inputs = document.querySelectorAll('input');
        inputs.forEach((input)=>{
            if(!input.checkValidity()){
                input.style.borderColor = 'lightcoral';
                input.style.borderRightColor = 'grey';
                input.style.borderLeftColor = 'grey';
                input.style.backgroundColor = 'rgba(240, 128, 128, 0.071)';
            }
            else{
                input.style.borderColor = 'gold';
                input.style.borderRightColor = 'grey';
                input.style.borderLeftColor = 'grey';
                input.style.backgroundColor = '#242424';
            }
        })
    }

    function clearInvalids(){
        const inputs = document.querySelectorAll('input');
        inputs.forEach((input)=>{
            input.style.borderColor = 'gold';
            input.style.borderRightColor = 'grey';
            input.style.borderLeftColor = 'grey';
            input.style.backgroundColor = '#242424';
        })
    }

    function showScannerModal(){

        setDisplayCam(true);
        const modal = document.querySelector('#scanner-modal');
        const modalBackground = document.querySelector('.scanner-modal');
        const close = document.querySelector('.scanner-modal-close');
        modal.style.display = "block";
        
        close.addEventListener('click', ()=>{ 
            modal.style.display = 'none';
            setDisplayCam(false);
            
        })
        document.addEventListener('click', (e)=>{
            if(e.target == modalBackground){
                modal.style.display = 'none';
                setDisplayCam(false);
            }
        })
       
        function removeModal(e){
            if(e.key === 'Escape'){
                modal.style.display= "none";
                setDisplayCam(false);
            }
        }

        document.addEventListener('keydown', removeModal);
  
    }

    // function updateDisplayCam(){setDisplayCam(!displayCam)}

    // function getScanResult(result){

    //     document.querySelector('#part-code').value = result;
    //     document.querySelector('#part-code').focus();
    //     document.querySelector('#part-code').blur();
    // }

    function userFormDialogSubmit({ firstName, lastName, dept}){
        setPickUserFirstName(firstName);
        setPickUserLastName(lastName);
        setPickUserTrade(dept);
    }

    function setIdxNext(){
        const hasNext = partInfo[idx + 1] !== undefined
        if(hasNext){
            setIdx(idx + 1)
        }
        else{setIdx(0)}
    }

    function setIdxPrev(){
        const hasPrev = partInfo[idx - 1] !== undefined
        if(hasPrev){
            setIdx(idx - 1)
        }
        else{setIdx(partInfo.length - 1)}
    }

    function updateIdx(index){
        setIdx(index)
    }

    function PartView(){

        const addedParts = partInfo.length > 0;

        const tools = [
            {
                id: 'ip-added-parts-list-icon',
                onclick: (e)=>{
                    e.preventDefault();
                    document.querySelector('#ip-added-parts-list-icon').blur();
                },
                img: '/list-white.svg',
            },
        ]

        function ShowReorder(){

            const ReorderIcon = () =>{
                return(
                    <>
                        <div style={{float: 'right', marginRight: '10px'}}>
                            <span>{partInfo[idx]?.reorderAmt}</span>
                            <img src ='/added-to-cart.svg'/>
                        </div>
                    </>
                )
            }

            return(
                <>{partInfo[idx]?.reorder === true ? <ReorderIcon/> : <></> }</>
            )

        }

        return(
            <fieldset className="ip-fieldset" id="ip-fieldset-2" style={{marginTop: '10px'}}>
                <legend>< img src='/four-square.svg'/></legend>
                <SidebarTools tools={tools} height={sidebarHeight} partInfo={partInfo} updateIdx={updateIdx} idx={idx}/>
                <div><ShowReorder/></div>
                <div id='ip-part-details'>
                    <div className='ip-part-detail'>
                        <div style={{color: 'gray'}}>Part Code</div>
                        <h3 className='part-detail-value' id='part-code'>{partInfo.length > 0 ? partInfo[idx].part: '00-00000'}</h3>
                    </div>
                    <div className='ip-part-detail'>
                        <div style={{color: 'gray'}}>Description</div>
                        <h3 className='part-detail-value' id='description'>{partInfo.length > 0 ? partInfo[idx].description: 'ABC XYZ 000 111'}</h3>
                    </div>
                    <div className='ip-part-detail'>
                        <div style={{color: 'gray'}}>Quantity</div>
                        <h3 className='part-detail-value' id='quantity'>{partInfo.length > 0 ? partInfo[idx].qty: '00'}</h3>
                    </div>
                    <div className='ip-part-detail'>
                        <div style={{color: 'gray'}}>Unit</div>
                        <h3 className='part-detail-value' id='unit'>{partInfo.length > 0 ? partInfo[idx].unit: 'EA'}</h3>
                    </div>
                    <div className='ip-part-detail'>
                        <div style={{color: 'gray'}}>Warehouse</div>
                        <h3 className='part-detail-value' id='warehouse'>{partInfo.length > 0 ? partInfo[idx].warehouse: 'NWQ-0000'}</h3>
                    </div>
                    <div className='ip-part-detail'>
                        <div style={{color: 'gray'}}>Workorder No.</div>
                        <h3 className='part-detail-value' id='wo-no'>{partInfo.length > 0 ? partInfo[idx].workorder: 'FS-00000'}</h3>
                    </div>
                    {partInfo.length>0 ? <Delete/> : <></>}
                </div>
            </fieldset>
        )
    }

    function Delete(){
        return(
        <div>
            <img style={{float: 'left', marginRight: '20px'}} className='ip-delete' src='/delete.svg' onClick={()=>{removePart(idx)}}/>
        </div>)
    }

    return(
        <>
            <div className="inventory-pick">
                <form id="ip-form"> 
                    <fieldset className="ip-fieldset" style={{paddingBottom: '10px'}}>
                        <legend><img src='/user-small.svg'/></legend>
                        <div>
                            <UserFormDialog userFormDialogSubmit={userFormDialogSubmit}/>
                            <div  style={{margin: '5px', color: 'gray'}}>User</div>
                            <h2 id='user-name' style={{margin: '5px'}}>{pickUserFirstName +' '+ pickUserLastName}</h2>
                            <div style={{margin: '5px', color: 'gray'}}>{pickUserTrade}</div>
                        </div>
                    </fieldset>
                    <PartView/>
                    <InventoryPickActions
                        setIsEditing={setIsEditing} 
                        setPartInfo={setPartInfo}
                        idx={idx} 
                        partInfo={partInfo} 
                        addPartHist={addPartHist} multiParts={multiParts} 
                        setIdxPrev={setIdxPrev} 
                        setIdxNext={setIdxNext}
                    />
                </form>
            </div>
        </>
    )
}

export default InventoryPick;