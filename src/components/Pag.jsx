import PaginationRounded from "./PaginationRounded";
import IconButton from '@mui/material/IconButton';
import BasicDialogModal from "./BasicDialogModal";
import { memo, useState } from "react";
import imgMap from "../../app/imgMap";

const Pag =  memo(function Pag(props){
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
                        <img src={imgMap.get('skip.svg')} width='25px'/>
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
})

export default Pag