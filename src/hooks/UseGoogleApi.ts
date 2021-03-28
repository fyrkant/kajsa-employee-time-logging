/* eslint-disable no-console */
import dayjs from 'dayjs';
import React from 'react';

const API_KEY = import.meta.env.SNOWPACK_PUBLIC_API_KEY;
const CLIENT_ID = import.meta.env.SNOWPACK_PUBLIC_CLIENT_ID;
const CALENDAR_ID = import.meta.env.SNOWPACK_PUBLIC_CALENDAR_ID;
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
];
const SCOPES = 'https://www.googleapis.com/auth/calendar';
type Status = 'idle' | 'loading' | 'resolved';

export const useGoogleApis = (
  date: string,
): {
  signedIn: boolean;
  events: gapi.client.calendar.Event[];
  createNewEntry: () => void;
  handleLogin: () => void;
  handleLogout: () => void;
  editEventDescription: (
    event: gapi.client.calendar.Event,
    newDescription: string,
  ) => void;
  addingStatus: Status;
  reloadEvents: () => void;
} => {
  const [signedIn, setSignedIn] = React.useState(false);
  const [events, setEvents] = React.useState<gapi.client.calendar.Event[]>([]);
  const [reloadString, setReloadString] = React.useState('initial');
  const reloadEvents = () => setReloadString(String(new Date().getTime()));

  React.useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
        .then(() => {
          const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
          const user = gapi.auth2.getAuthInstance().currentUser.get();
          user
            .reloadAuthResponse()
            .then(() => {
              setSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
            })
            .catch(() => {
              // TODO: add error handling
            });
          setSignedIn(isSignedIn);
        })
        .catch(() => {
          // TODO: add error handling
        });
    });
  }, []);
  React.useEffect(() => {
    if (signedIn) {
      gapi.client.calendar.events
        .list({
          calendarId: CALENDAR_ID,
          timeMin: dayjs(date).format(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: 'startTime',
        })
        .then(function (response) {
          const { items } = response.result;

          if (items) {
            setEvents(items);
          }
        })
        .catch(() => {
          // TODO: add error handling
        });
    }
  }, [signedIn, date, reloadString]);
  const handleLogin = () => {
    gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(() => {
        setSignedIn(true);
        reloadEvents();
      })
      .catch((err) => {
        console.log({ err });
      });
  };
  const handleLogout = () => {
    (gapi.auth2.getAuthInstance().signOut() as Promise<void>)
      .then(() => {
        setSignedIn(false);
        setEvents([]);
      })
      .catch(() => {
        // TODO: add error handling
      });
  };
  const editEventDescription = (
    event: gapi.client.calendar.Event,
    newDescription: string,
  ) => {
    const request = gapi.client.calendar.events.patch(
      {
        calendarId: CALENDAR_ID,
        eventId: event.id || '',
        fields: 'description',
      },
      { description: newDescription },
    );
    request
      .then(() => {
        reloadEvents();
        console.log('patched event! ');
      })
      .catch(() => {
        // TODO: add error handling
      });
  };
  const [addingStatus, setAddingStatus] = React.useState<Status>('idle');
  const createNewEntry = () => {
    setAddingStatus('loading');
    const event = {
      summary: 'KCETL ENTRY',
      description: 'GENERAL:\n\nLOG:',
      start: {
        dateTime: `${date}T05:00:00`,
        timeZone: 'Europe/Stockholm',
      },
      end: {
        dateTime: `${date}T06:00:00`,
        timeZone: 'Europe/Stockholm',
      },
    };
    gapi.client.calendar.events
      .insert({
        calendarId: CALENDAR_ID,
        resource: event,
      })
      .then((res) => {
        setAddingStatus('resolved');
        reloadEvents();
        console.log('added new!', res);
      })
      .catch((err) => {
        setAddingStatus('resolved');
        console.log(err);
      });
  };

  return {
    signedIn,
    events,
    createNewEntry,
    handleLogin,
    handleLogout,
    editEventDescription,
    addingStatus,
    reloadEvents,
  };
};
