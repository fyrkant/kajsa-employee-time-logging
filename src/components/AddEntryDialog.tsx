import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  TextField,
} from '@material-ui/core';
import { FoodData, FoodInput } from './FoodInput';

const makeString = (
  time: string,
  s: Record<string, boolean>,
  food: FoodData[],
) => {
  const things = Object.entries(s)
    .filter(([k, v]) => v)
    .map(([k]) => k);

  const foodArr = food.map((f) => `${f.side} ${f.time}min`);

  return `${time} - ${[...foodArr, ...things].join(', ')}`;
};

const checkboxes: [string, string][] = [
  // ['food', 'Breastfeeding'],
  ['poop', 'Poop'],
  ['pee', 'Pee'],
  ['sleep', 'Sleep'],
];

const getEmptyState = () => {
  return checkboxes.reduce((o, [k]) => ({ ...o, [k]: false }), {});
};

const getCurrentTime = () => {
  const d = new Date();
  return `${d.getHours()}:${d.getMinutes()}`;
};

const useStyles = makeStyles((theme) => ({
  chips: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export const AddLogEntryDialog: React.FC<{
  onAdd: (newDescriptionLine: string) => void;
}> = ({ onAdd }) => {
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState(getCurrentTime);
  const [state, setState] = React.useState<Record<string, boolean>>(
    getEmptyState,
  );
  const [food, setFood] = React.useState<FoodData[]>([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();

  const handleClickOpen = () => {
    setTime(getCurrentTime());
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setState(getEmptyState());
    setFood([]);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setTime(event.target.value);
  };
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <div>
      <Button
        fullWidth
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Add entry
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Add new entry to current day log
        </DialogTitle>
        <DialogContent>
          <FormGroup>
            <TextField
              fullWidth
              id="time"
              label="Time"
              name="time"
              type="time"
              value={time}
              onChange={handleTimeChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
            />
            <ul className={classes.chips}>
              {food.map((f, i) => (
                <li key={i + f.side + f.time}>
                  <Chip
                    label={`${f.side} ${f.time}min`}
                    onDelete={() => {
                      setFood([...food.slice(0, i), ...food.slice(i + 1)]);
                    }}
                    className={classes.chip}
                  />
                </li>
              ))}
            </ul>
            <FoodInput
              onChange={(x) => {
                setFood([...food, x]);
              }}
            />
            {checkboxes.map(([k, l], i) => {
              return (
                <FormControlLabel
                  key={k}
                  control={
                    <Checkbox
                      checked={state[k]}
                      onChange={handleCheckboxChange}
                      name={k}
                      color="primary"
                    />
                  }
                  label={l}
                />
              );
            })}
          </FormGroup>
          <DialogContentText>
            Preview: <br />
            {makeString(time, state, food)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onAdd(makeString(time, state, food));
              handleClose();
            }}
            disabled={
              Object.values(state).filter(Boolean).length < 1 && food.length < 1
            }
            color="primary"
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export const AddGeneralEntryDialog: React.FC<{
  onAdd: (newDescriptionLine: string) => void;
}> = ({ onAdd }) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [val, setVal] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVal(event.target.value);
  };

  return (
    <div>
      <Button
        fullWidth
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        Add entry
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Add new entry to current day log
        </DialogTitle>
        <DialogContent>
          <FormGroup>
            <TextField
              fullWidth
              id="text"
              label="Text"
              name="text"
              type="text"
              value={val}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onAdd(val);
              handleClose();
            }}
            disabled={val.length < 1}
            color="primary"
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
