import './InventoryPick.css';
import { useState, useEffect } from 'react';
import PartInfoModal from './PartInfoModal';
import useUserData from '../../app/useUserData';
const apiUrl = import.meta.env.VITE_API_URL;
import useAuth from '../../app/useAuth';
import ScannerModal from './ScannerModal';
import './ScannerModal.css'

function InventoryPick(){

    const [partInfo, setPartInfo] = useState([]); 
    const [reorder, setReorder] = useState(false);
    const [formDate, setFormDate] = useState(new Date());
    const {userData} = useUserData();
    const [userAuthorized, setUserAuthorized] = useState(false);
    const [displayCam, setDisplayCam] = useState(false);

    useAuth().then((res)=>{
        if(res.authorized){setUserAuthorized(true)}
    },[])

    let userFirstName, userLastName, userTrade;
    if(userData != ''){
        const userProps = JSON.parse(userData);
        userFirstName = userProps.firstName;
        userLastName = userProps.lastName;
        userTrade = userProps?.trade || userProps?.position;
    }
    
    useEffect(()=>{
        const updateDatetime = () =>{
            const dt = new Date();
            setFormDate(dt);
        }
        document.querySelector('#first-name').addEventListener('change', (updateDatetime))
        return document.querySelector('#first-name').removeEventListener('change', (updateDatetime))
    },[])

    // Fetches part records when partCode is entered in the form.
    useEffect(()=>{

        if(userAuthorized){

            const fetchPartDetails = (partCode) =>{
                fetch(`${apiUrl}/parts/${partCode}`, 
                )
                .then((res)=>{ 
                    if(res.status !== 200){throw new Error(res.status)}
                    else{return res.json()}
                })
                .then((res)=>{
                    document.querySelector('#description').value = res.description;
                    document.querySelector('#warehouse').value = res.warehouseCode;
                })
                .catch((err)=>{console.log(err)})
            }

            const partCode = document.querySelector('#part-code')
            partCode.addEventListener('focusout', ()=>{
                fetchPartDetails(partCode.value)
            })
            return partCode.removeEventListener('focusout', ()=>{
                fetchPartDetails(partCode.value)
            })

        }
    },[userAuthorized])

    function removePart(id){

        const modal = document.querySelector('#part-info-modal');
        const updatedPartInfo = [];
        partInfo.map((p)=>{
            if(p.id !== id){
                updatedPartInfo.push(p)
            }
        })
        setPartInfo(updatedPartInfo);
        alert('Part Removed');
        modal.style.display = 'none';

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

    function addPartHist(partCode){
        const part = partCode;
        if(part !== ''){
            const fName = document.querySelector('#first-name').value.trim();
            const lName = document.querySelector('#last-name').value.trim();
            const trade = document.querySelector('#trade').value.trim();
            const tmpDesc = document.querySelector('#description').value.toString().trim();
            let description;
            if(tmpDesc.length > 35){description = tmpDesc.substring(0, 34) + '...'}
            else{description = tmpDesc};
            const qty = document.querySelector('#quantity').value.trim();
            const unit = document.querySelector('#unit').value.trim();
            const warehouse = document.querySelector('#warehouse').value.trim();
            const woNo = document.querySelector('#wo-no').value.trim();
            const key = partInfo.length;
            const id = `added-part-${key}`;
            const reorderAmt = document.querySelector("#reorder-amt").value.trim();
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
            document.querySelector('#part-code').value = '';
            document.querySelector('#description').value = '';
            document.querySelector('#quantity').value = '';
            document.querySelector('#unit').value = '';
            setReorder(false);
            async => {
                document.querySelector('#warehouse').value = partInfo[partInfo.length -1].warehouse;
                document.querySelector('#wo-no').value = partInfo[partInfo.length -1].workorder;
            }
        } 
    }

    function ReOrder(){

        if(reorder){
            return(
                <>
                    <input type="checkbox" id="reorder-chkbx" name="reorder" checked readOnly/>
                    <label htmlFor="reorder" id="reorder-lbl">Re-order</label>
                </>
            )
        }
        else{
            return(
                <>
                    <div id="no-reorder-stand-in">&nbsp;</div>
                </>
            )
        }
    }

    function ReOrderAmt(){
        return(
            <>
                <input id='reorder-amt' 
                    type='text' 
                    title="Reorder Qty" 
                    {...(reorder ? {placeholder: 'ReOrdQty' } : {defaultValue:"NoReOrd", readOnly: true})}
                    maxLength='10'
                />
            </>
        )
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

    function updateDisplayCam(){setDisplayCam(!displayCam)}

    function getScanResult(result){

        document.querySelector('#part-code').value = result;
        document.querySelector('#part-code').focus();
        document.querySelector('#part-code').blur();
    }

    return(
        <>
            <div className="inventory-pick">
                <form>
                    <fieldset className="ip-fieldset">
                        <legend>User Info</legend>
                        <div className="header">
                            <div className="header__name">
                                <input id='first-name' type='text' title="First Name" placeholder="First Name" required maxLength="20" 
                                {...(userData != '' ? {defaultValue: userFirstName} : {})}
                                />
                                <input id='last-name' type='text' title="Last Name" placeholder="Last Name" required maxLength="20" 
                                {...(userData != '' ? {defaultValue: userLastName} : {})}
                                />
                            </div>
                            <div>
                                <input id='trade' type='text' title="Trade" placeholder="Trade" required maxLength="20"
                                {...(userData != '' ? {defaultValue: userTrade} : {})}
                                />
                            </div>
                            <div id="date">{formDate.toDateString()}</div>
                        </div>
                    </fieldset>
                    <fieldset className="ip-fieldset" id="ip-fieldset-2">
                        <legend>Part Info</legend>
                        <div id="icon-boxes">
                            <div id="scan-reorder-comment">
                                <button type="button" id="scan-btn" title='Scan' onClick={()=>{
                                    document.querySelector('#scan-btn').blur();
                                    showScannerModal();
                                }}>
                                </button> ..
                                <button type="button" id="reorder-btn" title='Re-order' onClick={()=>{
                                    setReorder(!reorder);
                                    document.querySelector('#reorder-btn').blur();
                                }}>
                                </button> ..
                                <button type="button" id="view-added-parts-btn" title='View Added Parts' onClick={()=>{
                                    showPartInfoModal();
                                    document.querySelector('#view-added-parts-btn').blur();
                                    }}>
                                </button> 
                            </div>
                        </div>
                        <div id="reorder-div">
                            <div id="reorder-content">
                                <ReOrder/>
                            </div>
                        </div>
                        <div className="item-details">
                            <div className='section1'>
                                <div id="reorder-selected">
                                </div>
                                <div id="part-and-description">
                                    <input id='part-code' type='text' title="Part Code" placeholder="PartNo" required maxLength="20"/>
                                    <input id='description' type='text' title="Description" placeholder="Description" required />
                                </div>
                                <div id="part-qtys">
                                    <input id='quantity' type='text' title="Quantity" placeholder="QtyUsed" required maxLength="6" />
                                    <input id='unit' type='text' title="Unit" placeholder="Unit"required maxLength="6"/>
                                    <ReOrderAmt/>
                                </div>
                            </div>
                            <div className="section2">
                                <input id='warehouse' 
                                    type='text' 
                                    title="Warehouse" 
                                    placeholder="Warehouse"
                                    required
                                    maxLength="20"
                                />
                                <input 
                                    id='wo-no' 
                                    type='text' 
                                    title="Workorder No." 
                                    placeholder="WorkOrder" 
                                    required
                                    maxLength="20"
                                />
                            </div>
                        </div>
                    </fieldset>
                    <div id="part-info"></div>
                    <div className='form-submit-btns'>
                        <button type="submit" id="inventory-pick-add-btn" className="add-btn" onClick={(e)=> {
                            e.preventDefault();
                            document.querySelector('#inventory-pick-add-btn').blur();
                            const part = document.querySelector('#part-code').value;
                            const form = document.querySelector('form')
                            if(form.checkValidity()){
                                showInValids();
                                addPartHist(part);
                                alert(`Part ${part} added.`)
                            }
                            else{ 
                                showInValids();
                                alert('Please fill out all fields.')
                            }
                        }}>
                            Add
                        </button>
                        <button type="button" id="inventory-pick-clear-btn" className="clear-btn" onClick={()=>{
                            document.querySelector('#inventory-pick-clear-btn').blur();
                            const clear = confirm('Clear form?');
                            if(clear){
                                document.querySelector('form').reset();
                                clearInvalids();

                            }
                            setReorder(false);
                        }}>Clear
                        </button>
                        <button type="button" id="inventory-pick-submit-btn" className="submit-btn" onClick={()=>{
                            document.querySelector('#inventory-pick-submit-btn').blur();
                            showPartInfoModal()
                            }}>
                            Submit
                        </button>
                    </div>
                </form>
                <PartInfoModal parts={partInfo} removePart={removePart} modalSubmit={modalSubmit}/>
                <ScannerModal displayCam={displayCam} updateDisplayCam={updateDisplayCam} getScanResult={getScanResult}/>
            </div>
        </>
    )
}

export default InventoryPick;