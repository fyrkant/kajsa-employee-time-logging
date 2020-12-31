// eslint-disable-next-line no-use-before-define
import {
  Button,
  Card,
  Container,
  makeStyles,
  Typography,
} from '@material-ui/core';
import dayjs from 'dayjs';
import React from 'react';
import './App.css';
import { NavBar } from './components/NavBar';
import { useGoogleApis } from './hooks/UseGoogleApi';

const useStyles = makeStyles(() => ({
  dateContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem 0',
  },
  card: {
    padding: '1rem',
  },
}));

const Event: React.FC<{
  event: gapi.client.calendar.Event;
}> = ({ event }) => {
  const description = event.description || '';
  const splat = description === '' ? [] : description.split('\n');
  return (
    <div key={event.id} className="flex-grow">
      <p>{event.summary}</p>
      <ul>
        {splat.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
};

const App: React.FC = () => {
  const [adding, setAdding] = React.useState(false);
  const today = dayjs();
  const {
    signedIn,
    handleLogin,
    handleLogout,
    editEventDescription,
    createNewEntry,
    events,
    addingStatus,
  } = useGoogleApis();
  const classes = useStyles();

  const filteredEvents = events.filter((e) => e.summary === 'KCETL ENTRY');
  console.log(events);

  const timeInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <>
      <NavBar
        signedIn={signedIn}
        onAuthChange={(state) => {
          const action = state === 'login' ? handleLogin : handleLogout;
          action();
        }}
      />
      <Container maxWidth="md">
        <div className={classes.dateContainer}>
          <Typography variant="h5">
            Today ({today.format('YYYY-MM-DD')})
          </Typography>
        </div>
        <Card className={classes.card}>
          {signedIn ? (
            filteredEvents.length === 0 ? (
              <>
                <p>No entry for this day!</p>
                <Button
                  variant="outlined"
                  fullWidth
                  type="button"
                  disabled={addingStatus === 'loading'}
                  onClick={createNewEntry}
                >
                  Create one
                </Button>
              </>
            ) : (
              <>
                {filteredEvents.map((event, i) => (
                  <Event key={event.id || i} event={event} />
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setAdding(true);
                  }}
                >
                  Add entry
                </button>
              </>
            )
          ) : (
            <Typography variant="body1">
              Please log in to access the log.
            </Typography>
          )}
        </Card>
        <div>
          <div>
            {adding ? (
              <div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setAdding(false);
                    }}
                  >
                    X
                  </button>
                </div>
                <div>
                  <label htmlFor="time">
                    Time
                    <input name="time" type="time" ref={timeInputRef} />
                  </label>
                  <button type="button">Cancel</button>
                  <button type="button">Save</button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </>
  );
};

export default App;
