import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import {
  LineChart,
  lineElementClasses,
  markElementClasses,
} from '@mui/x-charts/LineChart';

const margin = { right: 24 };

export default function FiscalDashedLineChart(props) {

  const [mobileView, setMobileView]= React.useState(false);

  React.useEffect(()=>{
    const atMedia = window.matchMedia("(max-width: 500px)");
    setMobileView(atMedia.matches);
    
    function updateMobileView(){
      setMobileView(atMedia.matches)
    }
    atMedia.addEventListener('change', updateMobileView);

    return function cleanup(){
      atMedia.removeEventListener('change', updateMobileView);
    }
  },[])

  const darkTheme = createTheme({
    palette: {
    mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <LineChart
        // height={mobileView ? 250: 325}
        height={250}
        // series={[
        //   { data: [], label: 'string', id: 'string' }, 
        //   { data: [], label: 'string', id: 'string' }, 
        //   {...}
        // ]}
        series={props.lineChartData}
        xAxis={[{ scaleType: 'point', data: props.xLabels }]}  //xLabels = []
        yAxis={[{ width: 50 }]}
        sx={{
          [`.${lineElementClasses.root}, .${markElementClasses.root}`]: {
            strokeWidth: 1,
          },
          '.MuiLineElement-series-p1Id': {
            strokeDasharray: '5 5',
          },
          '.MuiLineElement-series-p2Id': {
            strokeDasharray: '3 4 5 2',
          },
          [`.${markElementClasses.root}:not(.${markElementClasses.highlighted})`]: {
            // fill: '#fff',
          },
          [`& .${markElementClasses.highlighted}`]: {
            stroke: 'none',
          },
        }}
        margin={margin}
        
      />
    </ThemeProvider>
  );
}