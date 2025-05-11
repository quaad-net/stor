import CircularProgress from '@mui/material/CircularProgress';

export default function CircularIndeterminate(props) {

  return (
    <>
      < CircularProgress variant='indeterminate' disableShrink size={props.size} />
    </>
  );
}



