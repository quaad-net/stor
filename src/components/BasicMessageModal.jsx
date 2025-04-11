import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { IconButton } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 250,
  bgcolor:    'background.paper', 
  border: '1px solid gray',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px'
};

export default function BasicMessageModal(props) {

    const handleClose = () => props.setModalOpen(false);

    React.useEffect(()=>{
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
                <div style={{width: 'fit-content', margin: 'auto'}}>
                    {props?.modalContent}
                </div>
                {props?.noDefaultBtns ? <></> : 
                <div style={{width: 'fit-content', margin: 'auto'}}>
                    <IconButton autoFocus disableRipple onClick={()=>{
                        handleClose();
                    }}><span style={{fontSize: '15px'}}><img src='square-outlined-small.svg' width='10px' />&nbsp;Ok</span>
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
                        <Box sx={style}>
                        <ModalContent/>
                        </Box>
                    </Modal>
                </ThemeProvider>
            </div>
        </>
  );
}
