import BasicMessageModal from "./BasicMessageModal";
import IconButton from '@mui/material/IconButton';
import { useState } from "react";

export default function SyntaxHelper(props){
    const [modalOpen, setModalOpen] = useState(false);
    function ModalContent(){
        return(
            <>
                <div>
                    <div><i>*All queries are case-insensitive.</i></div>
                    <h3>Loc Query</h3>
                    <div style={{color: 'gold'}}>[Q]&nbsp;LocationStart&nbsp;<span style={{color:'white', fontWeight: 'bold'}}>:</span>&nbsp;LocationEnd</div>
                    <div>- Example&nbsp;=&gt;&nbsp;<span style={{color: 'gray'}}>110-a-b:110-c</span></div>
                    <div>- Add location start and location end separted by a colon. 
                        <br/>To match only one location, enter the location without a colon.
                    </div>
                    <h3>Code Query</h3>
                    <div style={{color: 'gold'}}>[Q]&nbsp;Code&nbsp;Code Code...</div>
                    <div>- Example&nbsp;=&gt;&nbsp;<span style={{color: 'gray'}}>22-12345 51-12345 70-12345</span></div>
                    <div>- Space separted list of part codes.</div>
                    <h3>Descr Query</h3>
                    <div style={{color: 'gold'}}>[Q]&nbsp;Exact Match</div>
                    <div>- Example&nbsp;=&gt;&nbsp;<span style={{color: 'gray'}}>zurn kit</span></div>
                    <div>- Searches for exact match within the "description" field.</div>
                    <h3>Using Filter</h3>
                    <div>- Narrows results based on filter input and type selection. 
                        <br/>Returns records that contain an exact match. 
                    </div>
                    <br/>
                </div>
            </>

        )
    }

    return(
        <>
            <div {...(props.mobileMenu ? {} : {className: 'not-shown-on-mobile'})}>
            <IconButton 
                disableRipple
                onClick={()=>{setModalOpen(true)}}
                size="small">
                <img 
                    src='https://imagedelivery.net/hvBzZjzDepIfNAvBsmlTgA/39fbd164-df89-4855-0924-be78ea37f100/public' 
                    width='25px' 
                    style={props.mobileMenu  ? {float: 'right'}: {marginRight: '0'}}
                />
                
            </IconButton>
            <span>?</span>
            <BasicMessageModal setModalOpen={setModalOpen} modalOpen={modalOpen} modalContent={<ModalContent/>} />
            </div>
        </>
    )
}