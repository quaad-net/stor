import BasicMessageModal from "./BasicMessageModal";
import CircularIndeterminate from "./Progress";
import IconButton from '@mui/material/IconButton';
import { useState } from "react";
import imgMap from "../../app/imgMap";

export default function SyntaxHelper(props){
    const [modalOpen, setModalOpen] = useState(false);
    function ModalContent(){
        return(
            <>
                <div>
                    <div><i>*All queries are case-insensitive.</i></div>

                    <h3>{'{L}'} Location</h3>
                    <div style={{color: 'gold'}}>[Qry]&nbsp;LocationStart&nbsp;<span style={{color:'white', fontWeight: 'bold'}}>:</span>&nbsp;LocationEnd
                        <br/><span style={{color: 'white'}}>=&gt;&nbsp;</span><span style={{color: 'gray'}}>110-a-b:110-c</span>
                    </div>
                    <div>▫ Add location start and location end separated by a colon. 
                        <br/>To match only one location, enter the exact location without a colon.
                    </div>
                    <div>▫ Do not include any spaces.</div>
                    <div>▫ Add &quot;&active&quot; to only include active items
                        <br/>=&gt;&nbsp;<span style={{color: 'gray'}}>110-a-b:110-c&active</span>
                    </div>

                    <h3>{'{C}'} Code</h3>
                    <div style={{color: 'gold'}}>[Qry]&nbsp;Code&nbsp;Code Code...
                        <br/><span style={{color: 'white'}}>=&gt;</span>&nbsp;<span style={{color: 'gray'}}>22-12345 51-12345 70-12345</span>
                    </div>
                    <div>▫ Enter a space separted list of part codes.</div>

                    <h3>{'{D}'} Description</h3>
                    <div style={{color: 'gold'}}>[Qry]&nbsp;Exact Match
                        <br/><span style={{color: 'white'}}>=&gt;</span>&nbsp;<span style={{color: 'gray'}}>zurn kit</span>
                    </div>
                    <div>▫ Searches for exact match within the &ldquo;description&rdquo; field.</div>

                    <h3>{'{W}'} Warehouse</h3>
                    <div style={{color: 'gold'}}>[Qry]&nbsp;code&nbsp;
                        <br/><span style={{color: 'white'}}>=&gt;&nbsp;</span><span style={{color: 'gray'}}>5032</span>
                    </div>
                    <div>▫ Returns all records for the specified warehouse code.</div>

                    <h3>{'{S}'} Semantic</h3>
                    <div style={{color: 'gold'}}>[Qry]&nbsp;Any&nbsp;
                        <br/><span style={{color: 'white'}}>=&gt;&nbsp;</span><span style={{color: 'gray'}}>3/4" brass ball valve</span>
                    </div>
                    <div>▫ Returns the closest matching records(≈50) based on their description.</div>

                    <h3>Using Filter</h3>
                    <div>▫ Narrows results based on filter input and type selection.</div>
                    <div>▫ Returns records that contain an exact match.</div>
                    <div>▫ Allows aggregated filtering.</div>
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
                        src={imgMap.get('stor-logo.svg')} 
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