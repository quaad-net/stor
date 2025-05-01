import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function UsageChart(props) {

    const darkTheme = createTheme({
        palette: {
        mode: 'dark',
        },
    });

    if(props.yData.length > 0){
        return (
            <ThemeProvider theme={darkTheme}>
                <LineChart
                    xAxis={[
                    { 
                        scaleType: 'point',
                        data: ['p1', 'p2', 'p3'] ,
                    }]
                    }
                    series={[
                    {
                        data: props.yData,
                        color: 'white',
                        // showMark: false
                    }]}
                    // yAxis={[{ position: 'none' }]}
                    // yAxis={[{tickLabelInterval: (index, value)=>{
                    //     let maxValue = 0;
                    //     props.yData?.map((d)=>{
                    //         if(Number(d) > maxValue){maxValue = Number(d)}
                    //     })
                    //     console.log(maxValue)
                    //     return maxValue == value;
                    // }}]}
                    height={150}
                    width={250}
                />
            </ThemeProvider>
        )
    }
    else{return(<></>)}
}
