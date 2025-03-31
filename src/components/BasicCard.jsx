import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';


export default function BasicCard({title, value, subtitle}) {

    const darkTheme = createTheme({
      palette: {
        mode: 'dark',
      },
    });
  return (
    <ThemeProvider theme={darkTheme}>
        <Card sx={{ minWidth: 27}}>
        <CardContent>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, textAlign: 'left'}}>
            {title}
            </Typography>
            <Typography variant="h5" component="div" sx={{textAlign: 'left'}} >
            {value}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 1.5, textAlign: 'left'}}>{subtitle}</Typography>
        </CardContent>
        <CardActions>
            <Button size="small">Edit</Button>
        </CardActions>
        </Card>
    </ThemeProvider>
  );
}
