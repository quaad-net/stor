import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function PaginationRounded(props) {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <span>{props?.pagText}</span>
      <Stack  spacing={2}>
        <Pagination 
          className='inventory-pagination' 
          count={props?.pagIdxMax} 
          shape="rounded" 
          page={props?.currentPage}
          onChange={(e, page)=>{
            props.displayPage(page);
        }} />
      </Stack>
    </ThemeProvider>
  );
}