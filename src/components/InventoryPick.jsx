import './InventoryPick.css';
import { useState, useEffect, useRef } from 'react';
import PartInfoModal from './PartInfoModal';

function InventoryPick(){

    const [partInfo, setPartInfo] = useState([]); 
    const [reorder, setReorder] = useState(false);
    const [formDate, setFormDate] = useState(new Date());
    const [noteAdded, setNoteAdded ] = useState(false);
    
     
    useEffect(()=>{
        document.querySelector('#first-name').addEventListener('change', ()=>{
            const updatedDateTime = new Date();
            setFormDate(updatedDateTime);
        })

    }, [])

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
            const fName = document.querySelector('#first-name').value;
            const lName = document.querySelector('#last-name').value;
            const trade = document.querySelector('#trade').value;
            const description = document.querySelector('#description').value;
            const qty = document.querySelector('#quantity').value;
            const unit = document.querySelector('#unit').value;
            const warehouse = document.querySelector('#warehouse').value;
            const woNo = document.querySelector('#wo-no').value;
            const key = partInfo.length;
            const id = `added-part-${key}`;
            const reorderAmt = document.querySelector("#reorder-amt").value;
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
    }

    function ReOrderAmt(){
        return(
            <>
                <input id='reorder-amt' 
                    type='text' 
                    title="Reorder Qty" 
                    {...(reorder ? {placeholder: 'ReOrdQty' } : {defaultValue:"NoReOrd", readOnly: true})}    />
            </>
        )
    }

    function NoteAdded(){
        if(noteAdded){
            return(
                <>
                    <input type="checkbox" id="note-added-chkbx" name="note-added" checked readOnly/>
                    <label htmlFor="note-added" id="note-added-lbl">Note Added</label>
                </>
            )
        }
    } 

    function showInValids(){
        const inputs = document.querySelectorAll('input');
        inputs.forEach((input)=>{
            if(!input.checkValidity()){
                input.style.borderColor = 'lightcoral'
                input.style.backgroundColor = 'rgba(240, 128, 128, 0.071)'; 
            }
            else{
                input.style.borderColor = 'gold';
                input.style.backgroundColor = '#242424';
            }
        })
    }

    function clearInvalids(){
        const inputs = document.querySelectorAll('input');
        inputs.forEach((input)=>{
            input.style.borderColor = 'gold';
            input.style.backgroundColor = '#242424';
        })
    }

    return(
            <>
            <div className="inventory-pick">
                <form>
                    <fieldset className="ip-fieldset">
                        <legend>Technician Info</legend>
                        <div className="header">
                            <div className="header__name">
                                <input id='first-name' type='text' title="First Name" placeholder="First Name" required />
                                <input id='last-name' type='text' title="Last Name" placeholder="Last Name" required />
                            </div>
                            <div>
                                <input id='trade' type='text' title="Trade" placeholder="Trade" required/>
                            </div>
                            <div id="date">{formDate.toDateString()}</div>
                        </div>
                    </fieldset>
                    <fieldset className="ip-fieldset" id="ip-fieldset-2">
                        <legend>Part Info</legend>
                        <div id="scan-reorder-comment">
                            <button type="button" id="scan-btn" onClick={()=>{
                                alert('Item Scan --- currently unavailable.');
                                document.querySelector('#scan-btn').blur();
                            }}>
                            </button>
                            <button type="button" id="reorder-btn" onClick={()=>{
                                setReorder(!reorder);
                                document.querySelector('#reorder-btn').blur();
                            }}>
                            </button>
                            <button type="button" id="comment-btn" onClick={()=>{
                                alert('Add Comment --- currently unavailable.');
                                document.querySelector('#comment-btn').blur();
                            }}>
                            </button>
                            <button type="button" id="view-added-parts-btn" onClick={()=>{
                                showPartInfoModal();
                                document.querySelector('#view-added-parts-btn').blur();
                                }}>
                            </button>
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
                                    <input id='part-code' type='text' title="Part Code" placeholder="PartNo" required />
                                    <input id='description' type='text' title="Description" placeholder="Description" required />
                                </div>
                                <div id="part-qtys">
                                    <input id='quantity' type='text' title="Quantity" placeholder="QtyUsed" required />
                                    <input id='unit' type='text' title="Unit" placeholder="Unit"required/>
                                    <ReOrderAmt/>
                                </div>
                            </div>
                            <div className="section2">
                                <input id='warehouse' 
                                    type='text' 
                                    title="Warehouse" 
                                    placeholder="Warehouse"
                                    required />
                                <input 
                                    id='wo-no' 
                                    type='text' 
                                    title="Workorder No." 
                                    placeholder="WorkOrder" 
                                    required/>
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
            </div>
        </>
    )
}

export default InventoryPick;