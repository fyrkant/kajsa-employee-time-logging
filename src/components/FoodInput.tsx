import { Button, ButtonGroup, makeStyles, TextField } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: '1rem',
  },
  activeButton: {
    color: '#fff',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '.5rem',
  },
  unknownButton: {
    minWidth: '1rem',
  },
}));
export type FoodData = {
  side: 'left' | 'both' | 'right';
  time: number | '?' | '';
};
export const FoodInput: React.FC<{ onChange: (x: FoodData) => void }> = ({
  onChange,
}) => {
  const [show, setShow] = React.useState(false);
  const [val, setVal] = React.useState<{ unknownTime: boolean } & FoodData>({
    side: 'left',
    time: 4,
    unknownTime: false,
  });
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
            <div></div>
            <ButtonGroup disableElevation variant="outlined" color="primary">
              <Button
                size="small"
                className={clsx(val.side === 'left' && classes.activeButton)}
                onClick={() => {
                  setVal({ ...val, side: 'left' });
                }}
              >
                Left
              </Button>
              <Button
                size="small"
                className={clsx(val.side === 'both' && classes.activeButton)}
                onClick={() => {
                  setVal({ ...val, side: 'both' });
                }}
              >
                Both
              </Button>

              <Button
                size="small"
                className={clsx(val.side === 'right' && classes.activeButton)}
                onClick={() => {
                  setVal({ ...val, side: 'right' });
                }}
              >
                Right
              </Button>
            </ButtonGroup>
            <TextField
              disabled={val.unknownTime}
              variant="outlined"
              inputMode="decimal"
              type="number"
              inputProps={{ step: '.5' }}
              value={typeof val.time === 'number' ? val.time : ''}
              onChange={(e) => {
                const v = e.target.value;
                const p = v === '' ? '' : parseFloat(v);

                if (typeof p === 'number' ? !isNaN(p) : p) {
                  setVal({ ...val, time: p });
                }
              }}
              label="Time"
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="outlined"
              className={clsx(
                classes.unknownButton,
                val.unknownTime ? classes.activeButton : undefined,
              )}
              size="small"
              onClick={() => {
                setVal({ ...val, unknownTime: !val.unknownTime });
              }}
            >
              ?
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onChange({
                  side: val.side,
                  time: val.unknownTime ? '?' : val.time,
                });
                setVal({ side: 'left', time: 4, unknownTime: false });
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
