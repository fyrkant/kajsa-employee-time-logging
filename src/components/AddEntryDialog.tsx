import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from '@material-ui/core';

const makeString = (time: string, s: Record<string, boolean>) => {
  const things = Object.entries(s)
    .filter(([k, v]) => v)
    .map(([k]) => k);

  return `${time} - ${things.join(', ')}`;
};

const checkboxes: [string, string][] = [
  ['food', 'Breastfeeding'],
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

export const AddLogEntryDialog: React.FC<{
  onAdd: (newDescriptionLine: string) => void;
}> = ({ onAdd }) => {
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState(getCurrentTime);
  const [state, setState] = React.useState<Record<string, boolean>>(
    getEmptyState,
  );
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setTime(getCurrentTime());
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setState(getEmptyState());
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
            {makeString(time, state)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onAdd(makeString(time, state));
              handleClose();
            }}
            disabled={Object.values(state).filter(Boolean).length < 1}
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
