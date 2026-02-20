import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import CircularIndeterminate from './Progress';
import imgMap from '../../app/imgMap';
import './BasicMessageModal.css'

// For Box
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
    width: 'fit-content',
  bgcolor:   '#0000007e', // 'background.paper',
  border: '1px solid transparent', // gray
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
};

export default function BasicMessageModal(props) {

    const handleClose = () => props.setModalOpen(false);

    useEffect(()=>{
        document.addEventListener('keydown',(e)=>{
            if(e.key === "Enter"){props.setModalOpen(false)}
        })
        return document.removeEventListener('keydown',(e)=>{
            if(e.key === "Enter"){props.setModalOpen(false)}
        })
    }, [])

    const darkTheme = createTheme({
        palette: {
        mode: 'dark',
        },
    });

    function ModalContent(){
        return(
            <>
                <div className='basic-message-modal-content' style={{width: 'fit-content', margin: 'auto', paddingRight: '20px', height: 'fit-content', maxHeight: '300px',
                    scrollbarWidth:'thin', scrollbarColor: 'black',  overflow: props?.overflow || 'auto'
                }}>
                    {props?.modalContent}
                </div>
                {props?.noDefaultBtns ? <></> : 
                <div style={{width: 'fit-content', margin: 'auto'}}>
                    <br/>
                    <IconButton autoFocus disableRipple onClick={()=>{
                        handleClose();
                    }}><span style={{fontSize: '15px'}}><img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;Ok</span>
                    </IconButton>
                </div>               
                }
            </>
        )
    }

    return (
        <>
            <div>
                <ThemeProvider theme={darkTheme}>
                    <Modal sx={{backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)'}}
                        open={props.modalOpen}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={{...style, width: props?.width || 'fit-content', ...props?.bgcolor ? {bgcolor: props.bgcolor} : {},
                            // bgcolor: props?.bgcolor || 'background.paper',
                            // border: props.border || '1px solid gray'
                        }}>
                            <ModalContent/>
                        </Box>
                    </Modal>
                </ThemeProvider>
            </div>
        </>
  );
}
