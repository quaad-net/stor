import BasicMessageModal from "./BasicMessageModal";
import CircularIndeterminate from "./Progress";
import IconButton from '@mui/material/IconButton';
import { useState } from "react";

export default function SyntaxHelper(props){
    const [modalOpen, setModalOpen] = useState(false);

    function ModalContent(){
        return(
            <>
                <div id='syntax-helper-modal-content'>
                    <div><i>*All queries are case-insensitive.</i></div>

                    <h3>{'{L}'}&nbsp;Location</h3>
                    <div style={{color: 'gold'}}>[Qry]&nbsp;LocationStart&nbsp;<span style={{color:'white', fontWeight: 'bold'}}>:</span>&nbsp;LocationEnd
                        <br/><span style={{color: 'white'}}>=&gt;&nbsp;</span><span style={{color: 'gray'}}>110-a-b:110-c</span>
                    </div>
                    <div>▫&nbsp;Add location start and location end separated by a colon. </div>
                    <div>▫&nbsp;To match only one location, enter the exact location without a colon.</div>
                    <div>▫&nbsp;Do not include any spaces.</div>
                    <div>▫&nbsp;Add &quot;&active&quot; to only include active items
                        <br/>=&gt;&nbsp;<span style={{color: 'gray'}}>110-a-b:110-c&active</span>
                    </div>

                    <h3>{'{C}'}&nbsp;Code</h3>
                    <div style={{color: 'gold'}}>[Qry]&nbsp;Code&nbsp;Code&nbsp;Code...
                        <br/><span style={{color: 'white'}}>=&gt;</span>&nbsp;<span style={{color: 'gray'}}>22-12345&nbsp;51-12345&nbsp;70-12345</span>
                    </div>
                    <div>▫&nbsp;Enter a single-space separated list of part codes.</div>

                    <h3>{'{D}'}&nbsp;Description</h3>
                    <div style={{color: 'gold'}}>[Qry]&nbsp;Exact&nbsp;Match
                        <br/><span style={{color: 'white'}}>=&gt;</span>&nbsp;<span style={{color: 'gray'}}>zurn&nbsp;kit</span>
                    </div>
                    <div>▫&nbsp;Searches for exact match within the &ldquo;description&rdquo; field.</div>

                    <h3>{'{W}'}&nbsp;Warehouse</h3>
                    <div style={{color: 'gold'}}>[Qry]&nbsp;code&nbsp;
                        <br/><span style={{color: 'white'}}>=&gt;&nbsp;</span><span style={{color: 'gray'}}>5032</span>
                    </div>
                    <div>▫&nbsp;Returns all records for the specified warehouse code.</div>
                    <div>▫&nbsp;For an entire warehouse, use the last two digits.
                        <br/>=&gt;&nbsp;<span style={{color: 'gray'}}>32</span>
                    </div>

                    <h3>{'{S}'}&nbsp;Semantic</h3>
                    <div style={{color: 'gold'}}>[Qry]&nbsp;Any&nbsp;
                        <br/><span style={{color: 'white'}}>=&gt;&nbsp;</span><span style={{color: 'gray'}}>3/4"&nbsp;brass&nbsp;ball&nbsp;valve</span>
                    </div>
                    <div>▫&nbsp;Returns the closest matching records(≈50) based on their description.</div>

                    <h3>Using&nbsp;Filter</h3>
                    <div>▫&nbsp;Narrows results based on filter input and type selection.</div>
                    <div>▫&nbsp;Returns records that contain an exact match.</div>
                    <div>▫&nbsp;Allows aggregated filtering.</div>
                </div>
            </>
        )
    }

    return(
        <>
            <div {...(props.mobileMenu ? {} : {className: 'not-shown-on-mobile'})}>
            {props.loading ? 
            <CircularIndeterminate size={25}/>:
            <>
                <IconButton 
                    disableRipple
                    onClick={()=>{setModalOpen(true)}}
                    size="small">
                    <img 
                        src='/stor-logo.svg' 
                        width='25px' 
                        style={props.mobileMenu  ? {float: 'right'}: {marginRight: '0'}}
                    />
                    
                </IconButton>
                <span>?</span>
            </>
            }
            <BasicMessageModal setModalOpen={setModalOpen} modalOpen={modalOpen} modalContent={<ModalContent/>} />
            </div>
        </>
    )
}