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

export default function PrintNewLabelModal(props) {

    const handleClose = () => props.setModalOpen(false);

    const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    });

    return (
        <>
        <div>
            <ThemeProvider theme={darkTheme}>
                <Modal className='new-label-form' sx={{backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)'}}
                    open={props.modalOpen}
                    onClose={handleClose}
                    aria-labelledby="new-label-form"
                    aria-describedby="new-label-form"
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
