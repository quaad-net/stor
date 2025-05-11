import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function FiscalPieChart(props) {
  return (
    // ex. data = [
    //     { value: 5, label: 'A' },
    //     { value: 10, label: 'B' },
    //     { value: 15, label: 'C' },
    //     { value: 20, label: 'D' },
    //   ];
    <PieChart colors={props.colors} series={[{ data: props.data, innerRadius: 80, paddingAngle: 0}]} {...props.size} 
      slotProps={{
        legend: {
          sx: {display: 'block', },
          direction: 'vertical',
          position: { 
            vertical: 'bottom',
            horizontal: 'center'
          }
        },
      }}
    >
      <PieCenterLabel>{props.centerLabel}</PieCenterLabel>
    </PieChart>
  );
}