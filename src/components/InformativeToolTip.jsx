import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const InfoToolTip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'whitesmoke',
      backgroundColor: theme.palette.common.black,
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
}));

export default function InformativeToolTip() {
return (
        <BootstrapTooltip
            title={
            <React.Fragment>
                <Typography color="inherit">{props.toolTipHeader}</Typography>
                {props.toolTipContent}
            </React.Fragment>
            }
        >
            <Button>?</Button>
        </BootstrapTooltip>
    )
}