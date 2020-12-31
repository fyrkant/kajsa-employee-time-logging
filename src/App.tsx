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
import { AddEntryDialog } from './components/AddEntryDialog';
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
              filteredEvents.map((event, i) => (
                <React.Fragment key={event.id || i}>
                  <Event event={event} />
                  <AddEntryDialog
                    onAdd={(newLine) => {
                      const description = event.description
                        ? event.description + '\n'
                        : '';
                      editEventDescription(event, description + newLine);
                    }}
                  />
                </React.Fragment>
              ))
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
