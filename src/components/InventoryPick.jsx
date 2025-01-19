import './InventoryPick.css';
import { useState, useEffect, useRef } from 'react';
import PartInfoModal from './PartInfoModal';

function InventoryPick(){
    const [partInfo, setPartInfo] = useState([]); // Array of part objects.
    const dt = new Date();
    const dtStr = dt.toDateString()

    async function handleSubmit(){
        const req = await fetch("https://stor-quaad-api-7ae794625fcd.herokuapp.com/api/pick", {method: 'POST'});
        const res = await req.text();
        alert(res);
    }

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

            const partInfoArr = [
                ...partInfo, 
                {
                    part: part,
                    id: id,
                    description: description,
                    qty: qty,
                    unit: unit,
                    warehouse: warehouse,
                    workorder: woNo
                }
            ];
            setPartInfo(partInfoArr);
        }
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
                            <div id="date">{dtStr}</div>
                        </div>
                    </fieldset>
                    <div id="scan-reorder-comment">
                        <button type="button" id="scan-btn">
                            <img id="scan" title="Scan" src="/icons8-qr-code.svg" width="30px"/>
                        </button>
                        <button type="button" id="reorder-btn">
                            <img id="reorder" title="Reorder" src="/icons8-fast-cart.svg" width="30px"/>
                        </button>
                        <button type="button" id="comment-btn">
                            <img id="comment" title="Comment" src="/icons8-comment.svg" width="30px"/>
                        </button>
                        <button type="button" id="view-added-parts-btn" onClick={showPartInfoModal}>
                            <img id="view-added-parts" title="View Added Parts" src="/icons8-list.svg" width="30px"/>
                        </button>
                    </div>
                    <fieldset className="ip-fieldset" id="ip-fieldset-2">
                        <legend>Part Info</legend>
                        <div className="item-details">
                            <div className='section1'>
                                <div id="reorder-selected"></div>
                                <div id="part-and-description">
                                    <input id='part-code' type='text' title="Part Code" placeholder="Part Code" required />
                                    <input id='description' type='text' title="Description" placeholder="Description" required />
                                </div>
                                <div id="part-qtys">
                                    <input id='quantity' type='text' title="Quantity" placeholder="Qty Used" required />
                                    <input id='quantity-remaining' type='text' title="Quantity Remaining" placeholder="Qty Remaining" required />
                                </div>
                            </div>
                            <div className="section2">
                                <input id='unit' type='text' title="Unit" placeholder="Unit"required/>
                                <input id='warehouse' type='text' title="Warehouse" placeholder="Warehouse" required/>
                                <input id='wo-no' type='text' title="Workorder No." placeholder="Workorder No." required/>
                            </div>
                        </div>
                    </fieldset>
                    <div id="part-info"></div>
                    <button type="button" className="submit-btn" onClick={handleSubmit}>Submit
                    </button>
                    <button type="button" className="clear-btn">Clear
                    </button>
                    <button type="submit" className="add-btn" onClick={(e)=> {
                        e.preventDefault();
                        const part = document.querySelector('#part-code').value;
                        const form = document.querySelector('form')
                        if(form.checkValidity()){
                            addPartHist(part);
                            alert(`Part ${part} added.`)
                        }
                        else{ 
                            alert('Please fill out all fields.')
                        }
                    }}>
                        Add
                    </button>
                </form>
                <PartInfoModal parts={partInfo} removePart={removePart}/>
            </div>
        </>
    )
}

export default InventoryPick;