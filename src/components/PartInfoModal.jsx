import { useEffect, useState } from 'react';
import './PartInfoModal.css'
import { duration } from '@mui/material';
const apiUlr = import.meta.env.VITE_API_URL; // Sets either production or dev environment API URL.

export default function PartInfoModal(props){

    const [idx, setIdx] = useState(0);
    const [nextPartBtns, setNextPartBtns] = useState("");
    const modal = document.querySelector("#part-info-modal");
    const modalContent = document.querySelector(".part-info-modal-data")

    try{
        const testModalParts = [...props.parts]; // Throws error if no parts.
        const modalParts = props.parts;
        let currentPart = modalParts[idx];
    
        function viewNextPart(){
            if(modalParts[idx+1] !== undefined){
                setIdx(idx + 1);
            }
            else{
                setIdx(0);
            }
        }
    
        function viewPrevPart(){
            if(modalParts[idx-1] !== undefined){
                setIdx(idx - 1);
            }
            else{
                setIdx(modalParts.length - 1);
            }
        }

        const fadeOutandIn = [
            {opacity: 0},
            {opacity: 1}
        ]

        const fadeTiming = {
            duration: 500
        }

        const slideRight = [
            {left: "-100vw"},
            {left: "0vw"}
        ]

        const slideLeft = [
            {left: "100vw"},
            {left: "0vw"}
        ]

        const slideTiming = {
            duration: 500
        }

        function NextPartBtns(){

            if(props.parts.length > 1){
            return ( 
                <>
                    <button type="button" id="prev-part-btn" onClick={()=>{
                                console.log(idx);
                                document.querySelector("#prev-part-btn").blur();
                                // modalContent.animate(fadeOutandIn, fadeTiming);;
                                // modalContent.animate(slideLeft, slideTiming);
                                viewPrevPart();
                            }
                        }>
                        Prev
                    </button>
                    <span>|</span>
                    <button type="button" id="next-part-btn" onClick={()=>{
                                console.log(idx);
                                document.querySelector("#next-part-btn").blur();
                                // modalContent.animate(fadeOutandIn, fadeTiming);
                                // modalContent.animate(slideRight, slideTiming);
                                viewNextPart();
                            }
                        }>
                        Next
                    </button>
                </>
            )
            }
            else{return(<></>)}
                
        }

        async function handleSubmit(){
            const req = await fetch(`${apiUlr}/pick`, {method: 'POST'});
            const res = await req.text();
            alert(res);
            modal.style.display = "none";
            props.modalSubmit(res);
        }

        return(
            <div className="modal" id="part-info-modal">
                <div className="part-info-modal">
                    <div className="part-info-modal-data">
                        <span className="part-info-modal-close">&times;</span>
                        <div className="part-info-modal-header">{currentPart.part} ({idx + 1} of {props.parts.length})</div>
                        <span className="part-info-modal-rows">
                            <div className="part-info-modal-row"></div>
                            <div className="part-info-modal-row" id="part-modal-description">Description: {currentPart.description}</div>
                            <div className="part-info-modal-row" id="part-modal-qty">Qty: {currentPart.qty}</div>
                            <div className="part-info-modal-row" id="part-modal-unit">Unit: {currentPart.unit}</div>
                            <div className="part-info-modal-row" id="part-modal-warehouse">Warehouse: {currentPart.warehouse}</div>
                            <div className="part-info-modal-row" id="part-modal-workorder">Workorder: {currentPart.workorder}</div>
                        </span>
                        <fieldset>
                                <legend>
                                    <button id="submit-parts-btn" onClick={()=>{
                                        const submitParts = document.querySelector('#submit-parts-btn');
                                        submitParts.blur();
                                        handleSubmit();
                                    }
                                    }>Submit Part(s)
                                    </button>
                                </legend>
                        </fieldset>    
                        <div className="previous-next-part">
                            < NextPartBtns />
                        </div>
                        <button 
                                id="part-info-remove-btn" 
                                type="button"
                                onClick={()=>{
                                    props.removePart(currentPart.id);
                                    setIdx(0);
                                }}
                                >Remove Part
                        </button>
                    </div>
                </div>
            </div>
        )

    }
    catch(e){
        if(e instanceof TypeError){ //  Indicates [...props.parts] was not iterable. Therefore no parts were passed.
            return(
                <div className="modal" id="part-info-modal">
                    <div className="part-info-modal">
                        <div className="part-info-modal-data">
                            <span className="part-info-modal-close">&times;</span>
                            <div className="part-info-modal-header">Part Code</div>
                            <span className="part-info-modal-rows">
                                <div className="part-info-modal-row"></div>
                                <div className="part-info-modal-row" id="part-modal-description">Description: </div>
                                <div className="part-info-modal-row" id="part-modal-qty">Qty: </div>
                                <div className="part-info-modal-row" id="part-modal-unit">Unit: </div>
                                <div className="part-info-modal-row" id="part-modal-warehouse">Warehouse: </div>
                                <div className="part-info-modal-row" id="part-modal-workorder">Workorder: </div>
                            </span>
                            <fieldset className="part-info-remove-fieldset">
                                    <legend id="no-parts-added">No Parts Added</legend>
                            </fieldset>
                        </div>
                    </div>
                </div>
            )
        }

    }
}

