import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'fit-content',
  bgcolor:    'background.paper', 
  border: '1px solid gray',
  boxShadow: 24,
  p: 0,
  borderRadius: '10px'
};

export default function BasicModalSelection(props) {

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <>
    <div>
        <ThemeProvider theme={darkTheme}>
            <button 
                onClick={handleOpen}
                style={{all: 'unset'}}>
                    <span style={{color: 'gold'}}>*&nbsp;</span>
                    {props.selectionName}
            </button>
            <Modal sx={{backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)'}}
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    <ul>
                    {props.selections.map((type, index)=>{
                        return(
                            <li key={index}
                                style={{marginBottom: '20px', paddingRight: '25px', listStyle: 'square'}}
                                onClick={()=>{
                                    props.setUpdateType(type.name);
                                    type.onclick();
                                    handleClose();
                                }} 
                            >        {type.name}
                            </li>
                        )
                    })}
                    </ul>
                </Box>
            </Modal>
        </ThemeProvider>
    </div>
    </>
  );
}
