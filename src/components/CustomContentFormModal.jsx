import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'fit-content',
  maxWidth: '210px',
  bgcolor: 'background.paper', 
  border: '1px solid transparent',
  boxShadow: 24,
  p: 0,
  borderRadius: '10px'
};

export default function CustomContentFormModal(props) {

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        props?.setAlertContent('');
        props?.setDisplayAlert(false);
    };

    const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    });

    return (
        <>
        <div>
            <ThemeProvider theme={darkTheme}>
                {props.exposedEl.map((el, index)=>{
                    return(
                    <span key={index} className='form-modal-exposed-el' 
                    onClick={()=>{
                        setOpen(true);
                        }}
                    >
                        {el}
                    </span>)
                })}
                <Modal className='custom-content-form-modal' sx={{backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)'}}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="custom-content-form-modal-title"
                    aria-describedby="custom-content-form-modal-description"
                    >
                    <Box sx={style}>
                        {props?.modalContent}
                    </Box>
                </Modal>
            </ThemeProvider>
        </div>
        </>
    );
}
