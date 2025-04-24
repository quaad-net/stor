import PaginationRounded from "./PaginationRounded";
import IconButton from '@mui/material/IconButton';
import BasicDialogModal from "./BasicDialogModal";
import { useState } from "react";

export default function Pag(props){
    const [modalOpen, setModalOpen] = useState(false);
    
    if(props?.pagIdxMax > 1){
        return(
            <>
                <IconButton
                    disableRipple
                    size="large" 
                    aria-label="quick  update" 
                    color="inherit" 
                    onClick={()=>{setModalOpen(true)}}>
                    <img src= 'https://imagedelivery.net/hvBzZjzDepIfNAvBsmlTgA/ced013bd-1d7d-4631-66f0-b0f498bc1b00/public' width='25px'/>
                    {props?.btnDescription || <></>}
                </IconButton>
                <BasicDialogModal 
                    modalOpen={modalOpen} 
                    setModalOpen={setModalOpen} 
                    modalContent={
                        <PaginationRounded
                            pagIdxMax={props?.pagIdxMax} 
                            displayPage={props?.displayPage} 
                            currentPage={props?.currentPage}
                        />
                    }
                />
            </>
        )
    }
    else{
        return<></>
    }
}