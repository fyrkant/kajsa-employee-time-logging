import { Button, ButtonGroup, makeStyles, TextField } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: '1rem',
  },
  inactiveButton: {
    color: '#ccc',
    backgroundColor: theme.palette.primary.light,
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '.5rem',
  },
}));
export type FoodData = {
  side: 'left' | 'right';
  time: number;
};
export const FoodInput: React.FC<{ onChange: (x: FoodData) => void }> = ({
  onChange,
}) => {
  const [show, setShow] = React.useState(false);
  const [val, setVal] = React.useState<{
    side: 'left' | 'right';
    time: number;
  }>({ side: 'left', time: 4 });
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      {!show ? (
        <Button onClick={() => setShow(true)} variant="outlined">
          Breastfeeding
        </Button>
      ) : (
        <>
          <div className={classes.inputWrap}>
            <ButtonGroup disableElevation variant="contained" color="primary">
              <Button
                size="small"
                className={clsx(val.side === 'right' && classes.inactiveButton)}
                onClick={() => {
                  setVal({ ...val, side: 'left' });
                }}
              >
                Left
              </Button>
              <Button
                size="small"
                className={clsx(val.side === 'left' && classes.inactiveButton)}
                onClick={() => {
                  setVal({ ...val, side: 'right' });
                }}
              >
                Right
              </Button>
            </ButtonGroup>
            <TextField
              type="number"
              value={val.time}
              onChange={(e) => {
                const v = e.target.value;
                setVal({ ...val, time: parseInt(v, 10) });
              }}
              label="Time"
              InputLabelProps={{ shrink: true }}
            />
            <Button
              onClick={() => {
                onChange(val);
                setShow(false);
              }}
            >
              Add
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
