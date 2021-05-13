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
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { Event } from './components/Event';
import { Calendar, Chevron } from './components/Icons';
import { NavBar } from './components/NavBar';
import { useGoogleApis } from './hooks/UseGoogleApi';

const useStyles = makeStyles(() => ({
  dateContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 0',
    '& button': {
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',

      height: '4em',
      width: '4em',
      borderRadius: '2em',
      '& svg': {
        fill: 'currentColor',
      },
      '&:last-child > svg': {
        transform: 'rotate(180deg)',
      },
      '&:hover,&:active,&:focus': {
        backgroundColor: '#666',
        color: 'white',
      },
      '&:disabled': {
        cursor: 'default',
        color: '#666',
        '&:hover,&:active,&:focus': {
          backgroundColor: 'inherit',
        },
      },
    },
  },
  card: {
    padding: '1rem',
  },
}));

const CoolApp: React.FC = () => {
  const today = dayjs();

  const { '*': date } = useParams();
  const currentDate = date.slice(1);
  const {
    handleLogin,
    handleLogout,
    signedIn,
    editEventDescription,
    createNewEntry,
    events,
    isAdding,
  } = useGoogleApis(currentDate);
  const classes = useStyles();

  const event = events.filter(
    (e) =>
      e.summary === 'KCETL ENTRY' &&
      e.start &&
      dayjs(e.start.dateTime).isSame(dayjs(currentDate), 'day'),
  )[0];

  console.log(currentDate, event);

  const navigate = useNavigate();

  React.useEffect(() => {
    if (date && date === '/') {
      navigate(`${dayjs().format('YYYY-MM-DD')}`, { replace: true });
    }
  }, [date, navigate]);

  const isToday = dayjs(currentDate).isSame(today, 'day');
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
          {signedIn ? (
            <>
              <button
                onClick={() => {
                  const d = dayjs(currentDate)
                    .subtract(1, 'day')
                    .format('YYYY-MM-DD');
                  navigate(`/${d}`);
                }}
              >
                <Chevron />
              </button>
              <Typography variant="h5">
                {isToday ? 'Today - ' : null}
                {currentDate}
              </Typography>
              <div>
                <button
                  title="Go to today"
                  disabled={isToday}
                  onClick={() => {
                    navigate(`/${today.format('YYYY-MM-DD')}`);
                  }}
                >
                  <Calendar />
                </button>

                <button
                  disabled={isToday}
                  onClick={() => {
                    const d = dayjs(currentDate)
                      .add(1, 'day')
                      .format('YYYY-MM-DD');
                    navigate(`/${d}`);
                  }}
                >
                  <Chevron />
                </button>
              </div>
            </>
          ) : (
            <p>&nbsp;</p>
          )}
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
                  disabled={isAdding}
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

const client = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<CoolApp />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
