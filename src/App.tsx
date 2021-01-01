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
import { NavBar } from './components/NavBar';
import { useGoogleApis } from './hooks/UseGoogleApi';
import { Event } from './components/Event';

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

const App: React.FC = () => {
  const today = dayjs();
  const {
    signedIn,
    handleLogin,
    handleLogout,
    editEventDescription,
    createNewEntry,
    events,
    addingStatus,
    reloadEvents,
  } = useGoogleApis();
  const classes = useStyles();

  const event = events.filter((e) => e.summary === 'KCETL ENTRY')[0];
  console.log(events);

  const timeInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <>
      <NavBar
        refresh={reloadEvents}
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
            !event ? (
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
              <Event event={event} editEvent={editEventDescription} />
            )
          ) : (
            <Typography variant="body1">
              Please log in to access the log.
            </Typography>
          )}
        </Card>
      </Container>
    </>
  );
};

export default App;
