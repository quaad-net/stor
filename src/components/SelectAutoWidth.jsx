import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function SelectAutoWidth(props) {
  const [selection, setSelection] = useState(props.defaultSelection);

  //props.menuItems = [{value: 'actual value', name: 'as seen by user'}, {}, {}, ...]

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    const handleChange = (event) => {
    setSelection(event.target.value);
    props.onSelectChange(event.target.value);
    };

  return (
    <ThemeProvider theme={darkTheme}>
        <div>
        <FormControl sx={{m: 1, minWidth: '80', color: 'white',
            '& .MuiOutlinedInput-root': { 'fieldset': {borderColor: 'gray'},
            '&.Mui-focused fieldset': {
                borderColor: 'gray',
                color: 'gray'
            },
            },
        }} size='small'>
            <InputLabel id="select-autowidth-label"><span style={{color: 'gray'}}>{props.selectionLabel}</span></InputLabel>
            <Select
            labelId="select-autowidth-label"
            id="select-autowidth"
            value={selection}
            onChange={handleChange}
            autoWidth
            label={props.selectionLabel}
            >
            {props.menuItems.map((item, index)=>{
                return(
                    <MenuItem 
                        key={index} 
                        value={item.value} 
                        // sx={{}} 
                    >
                        <span 
                            style={{color: 'whitesmoke'}}>{item.name}
                        </span>
                    </MenuItem>
                )
            })}
            </Select>
        </FormControl>
        </div>
    </ThemeProvider>
  );
}