import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url("/added-to-cart-sm-outline.svg")`},
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: 'gray',
        ...theme.applyStyles('dark', {
          backgroundColor: 'gray',
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: 'rgb(22, 22, 22)',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url("/cart-sm-outline.svg")`},
    ...theme.applyStyles('dark', {
      backgroundColor: 'rgb(30, 39, 48)',
    }),
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: 'gray',
    }),
  },
}));

export default function ReorderSwitch(props) {
    return (
        <FormControlLabel
          control={<MaterialUISwitch sx={{ m: 1 }} />}
          label=""
          name='Reorder'
          onChange={props.onChange}
        />
    );
  }