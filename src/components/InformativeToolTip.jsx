import { Fragment } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const InfoToolTip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9', //  theme.palette.common.black,
      color: 'whitesmoke',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
}));

export default function InformativeToolTip(props) {
return (
        <InfoToolTip
            title={
            <Fragment>
                <Typography color="inherit">{props.toolTipHeader}</Typography>
                {props.toolTipContent}
            </Fragment>
            }
        >
            <Button>?</Button>
        </InfoToolTip>
    )
}