import dayjs from 'dayjs';
import React from 'react';

const API_KEY = import.meta.env.SNOWPACK_PUBLIC_API_KEY;
const CLIENT_ID = import.meta.env.SNOWPACK_PUBLIC_CLIENT_ID;
const CALENDAR_ID = import.meta.env.SNOWPACK_PUBLIC_CALENDAR_ID;
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
];
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const today = dayjs();
const todayString = today.subtract(1, 'day').format();
type Status = 'idle' | 'loading' | 'resolved';

export const useGoogleApis = () => {
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
        .then(function (x) {
          console.log('HEJ');
          setSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
        })
        .catch(() => {});
    });
  }, []);
  React.useEffect(() => {
    if (signedIn) {
      gapi.client.calendar.events
        .list({
          calendarId: CALENDAR_ID,
          timeMin: todayString,
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
        .catch(() => {});
    }
  }, [signedIn, todayString, reloadString]);
  const handleLogin = () => {
    gapi.auth2
      .getAuthInstance()
      .signIn()
      .then((x) => {
        console.log(x);
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
      .catch(() => {});
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
      .catch(() => {});
  };
  const [addingStatus, setAddingStatus] = React.useState<Status>('idle');
  const createNewEntry = () => {
    setAddingStatus('loading');
    const event = {
      summary: 'KCETL ENTRY',
      start: {
        dateTime: `${today.format('YYYY-MM-DD')}T05:00:00`,
        timeZone: 'Europe/Stockholm',
      },
      end: {
        dateTime: `${today.format('YYYY-MM-DD')}T06:00:00`,
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
  };
};
