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
  OutlinedInput,
  TextField,
  Fab,
} from '@material-ui/core';
import { FoodData, FoodInput } from './FoodInput';
import dayjs from 'dayjs';
import AddIcon from '@material-ui/icons/Add';

const makeString = (
  time: string,
  s: Record<string, boolean>,
  food: FoodData[],
  freetext: string,
) => {
  const things = Object.entries(s)
    .filter(([k, v]) => v)
    .map(([k]) => k);

  const foodArr = food.map((f) => `${f.side} ${f.time}min`);
  const t = freetext ? [`"${freetext}"`] : [];

  return `${time} - ${[...t, ...foodArr, ...things].join(', ')}`;
};

const checkboxes: [string, string][] = [
  // ['food', 'Breastfeeding'],
  ['poop', 'Poop'],
  ['pee', 'Pee'],
  ['fell-asleep', 'Fell asleep'],
  ['woke-up', 'Woke up'],
];

const getEmptyState = () => {
  return checkboxes.reduce((o, [k]) => ({ ...o, [k]: false }), {});
};

const getCurrentTime = () => {
  const d = dayjs(new Date());
  return d.format('HH:mm');
};

const useStyles = makeStyles((theme) => ({
  chips: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  content: {
    '& > div': {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 6,
    },

    [theme.breakpoints.down('sm')]: {
      padding: '5px',
    },
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
}));

export const AddLogEntryDialog: React.FC<{
  onAdd: (newDescriptionLine: string) => void;
}> = ({ onAdd }) => {
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState(() => getCurrentTime());
  const [state, setState] = React.useState<Record<string, boolean>>(
    getEmptyState,
  );
  const [freetext, setFreetext] = React.useState('');
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
    setFreetext('');
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  return (
    <div>
      {fullScreen ? (
        <Fab className={classes.fab} color="primary" onClick={handleClickOpen}>
          <AddIcon />
        </Fab>
      ) : (
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={handleClickOpen}
        >
          Add entry
        </Button>
      )}
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        keepMounted={false}
      >
        <DialogTitle id="responsive-dialog-title">
          Add new entry to current day log
        </DialogTitle>
        <DialogContent className={classes.content}>
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
            <TextField
              fullWidth
              id="freetext"
              label="Free text"
              InputLabelProps={{
                shrink: true,
              }}
              value={freetext}
              onChange={(e) => {
                const v = e.target.value;
                setFreetext(v);
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
            {makeString(time, state, food, freetext)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onAdd(makeString(time, state, food, freetext));
              handleClose();
            }}
            disabled={
              Object.values(state).filter(Boolean).length < 1 &&
              food.length < 1 &&
              !freetext
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
    setVal('');
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
