import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

export default function CircularIndeterminate(props) {

  const handleClose = () => props.setModalOpen(false);

  const darkTheme = createTheme({
      palette: {
      mode: 'dark',
      },
  });

  return (
    <>
        {/* <div>
            <ThemeProvider theme={darkTheme}>
                <Modal sx={{backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)'}}
                    open={props.modalOpen}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                    <Box sx={{ display: 'flex', width: 'fit-content', margin: 'auto'}}>
                      < CircularProgress />
                    </Box>
                    </Box>
                </Modal>
            </ThemeProvider>
        </div> */}
        {/* display: flex */}
        {/* <Box sx={{ display: 'flex', width: 'fit-content', margin: 'auto'}}> */}
          < CircularProgress variant='indeterminate' disableShrink size={props.size} />
        {/* </Box> */}
    </>
  );
}



