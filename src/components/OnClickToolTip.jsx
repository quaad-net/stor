import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';

export default function OnClickToolTip(props) {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <div>
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <div>
              <Tooltip
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={props.toolTipTitle}
                slotProps={{
                  popper: {
                    disablePortal: true,
                  },
                }}
              >
                <span onClick={handleTooltipOpen}>{props.toolTipEl}</span>
              </Tooltip>
            </div>
          </ClickAwayListener>
    </div>
  );
}