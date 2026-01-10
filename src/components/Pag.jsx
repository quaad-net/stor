import PaginationRounded from "./PaginationRounded";
import IconButton from '@mui/material/IconButton';
import BasicDialogModal from "./BasicDialogModal";
import { useMemo, useState } from "react";
import imgMap from "../../app/imgMap";

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
                    {useMemo(()=>{
                        return <img src={imgMap.get('skip.svg')} width='25px'/>
                    })}
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