import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function PaginationRounded() {

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Stack  spacing={2}>
        <Pagination className='inventory-pagination' onClick={()=>{}} count={10} shape="rounded" />
      </Stack>
    </ThemeProvider>
  );
}