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
  width: 'fit-content',
  bgcolor:    'background.paper', 
  border: '1px solid gray',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px'
};

export default function MoreModal(props) {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const btnProps = props?.modalBtnProps;

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <>
    <div>
      <ThemeProvider theme={darkTheme}>
      <IconButton disableRipple
        onClick={()=>{
          handleOpen();
        }}
        aria-label={btnProps?.ariaLabel}
        aria-controls={btnProps?.ariaControls}
        aria-haspopup={btnProps?.ariaHasPopUp}
        color={btnProps?.color}
      >
          <div style={{fontSize: '15px', float: 'right'}}>+</div>
      </IconButton>
      <Modal sx={{backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)'}}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {props.modalContent}
        </Box>
      </Modal>
      </ThemeProvider>
    </div>
    </>
  );
}
