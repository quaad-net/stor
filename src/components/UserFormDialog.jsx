import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import './UserFormDialog.css'
import { Typography } from '@mui/material';

export default function UserFormDialog(props) {

    const [open, setOpen] = React.useState(false);
    const [userFirstName, setUserFirstName] = React.useState('');
    const [userLastName, setUserLastName] = React.useState('');
    const [userTrade, setUserTrade] = React.useState('');

  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    
    const darkTheme = createTheme({
      palette: {
        mode: 'dark',
      },
    });
    
    return (
      <ThemeProvider theme={darkTheme}>
        <React.Fragment>
          <Button variant='text' size='small' style={{float: 'right', color: 'white', fontWeight: 'lighter', marginRight: '5px'}}
          onClick={handleClickOpen}>
            Alt User
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth='xs'
            slotProps={{
              paper: {
                component: 'form',
                onSubmit: (event) => {
                  event.preventDefault();
                  // const formData = new FormData(event.currentTarget);
                  // const formJson = Object.fromEntries(formData.entries());
                  // const firstName = formJson.firstName;
                  props.userFormDialogSubmit({firstName: userFirstName, lastName: userLastName, dept: userTrade});
                  handleClose();
                },
                style: { borderRadius: 20 }
              },
            }}
          >
            <DialogTitle>
              <img src='/user-small.svg' 
                style={{ width: '25px', borderRadius: '5px', float: 'right'}} /> 
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
              </DialogContentText>
              <div style={{width: '200px', margin: 'auto'}}>
                <TextField
                  // sx={inputStyle}
                  slotProps={
                    {
                      htmlInput: {maxLength: 20},                 
                      inputLabel: {shrink: true}
                    }
                  }
                  autoFocus
                  required
                  margin="dense"
                  id="tmp-first-name"
                  name="firtName"
                  label="First Name"
                  type="text"
                  variant="outlined"
                  onChange={(event) => setUserFirstName(event.target.value)}
                />
                <TextField
                  slotProps={
                    {
                      htmlInput: {maxLength: 20},                 
                      inputLabel: {shrink: true}
                    }
                  }
                  required
                  margin="dense"
                  id="tmp-last-name"
                  name="lastName"
                  label="Last Name"
                  type="text"
                  variant="outlined"
                  onChange={(event) => setUserLastName(event.target.value)}
                />
                <TextField
                  slotProps={
                    {
                      htmlInput: {maxLength: 20},                 
                      inputLabel: {shrink: true}
                    }
                  }
                  required
                  margin="dense"
                  id="tmp-dept"
                  name="dept"
                  label="Department"
                  type="text"
                  variant="outlined"
                  onChange={(event) => setUserTrade(event.target.value)}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <div style={{margin: 'auto'}}>
                <Button style={{color: 'whitesmoke'}} type="submit">Update</Button>
                <Button style={{color: 'whitesmoke', marginLeft: '5px'}} onClick={handleClose}>Cancel</Button>
              </div>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </ThemeProvider>
    );
}