/* eslint-disable no-console */
import dayjs from 'dayjs';
import ky from 'ky';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useFirebaseLogin } from './UseFirebaseLogin';

const API_KEY = import.meta.env.SNOWPACK_PUBLIC_FIREBASE_API_KEY;
const CALENDAR_ID = import.meta.env.SNOWPACK_PUBLIC_CALENDAR_ID;

const base = 'https://www.googleapis.com/calendar/v3';

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
  isAdding: boolean;
  reloadEvents: () => void;
} => {
  const [login, logout, signedIn, token] = useFirebaseLogin();

  const queryClient = useQueryClient();

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const search = new URLSearchParams({
    timeMin: dayjs(date).format(),
    showDeleted: 'false',
    singleEvents: 'true',
    maxResults: '10',
    orderBy: 'startTime',
    key: API_KEY,
  }).toString();
  const {
    data: events = [],
    refetch,
    remove,
  } = useQuery(
    ['items', search],
    () => {
      return ky
        .get(`${base}/calendars/${CALENDAR_ID}/events?${search}`, {
          credentials: 'same-origin',
          ...authHeader,
        })
        .json<{ items: gapi.client.calendar.Event[] }>()
        .then((res) => res.items)
        .catch((err) => {
          if (err.response.status === 401) {
            login();
          }
        });
    },
    {
      enabled: signedIn,
    },
  );

  const addEventMutation = useMutation(
    () =>
      fetch(`${base}/calendars/${CALENDAR_ID}/events`, {
        method: 'POST',
        body: JSON.stringify({
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
        }),
        credentials: 'same-origin',
        ...authHeader,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['items']);
      },
    },
  );
  const editEventMutation = useMutation(
    ({ id, description }: { id: string; description: string }) =>
      fetch(`${base}/calendars/${CALENDAR_ID}/events/${id}?key=${API_KEY}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        mode: 'cors',
        body: JSON.stringify({ description }),
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          ...authHeader.headers,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['items']);
      },
    },
  );

  const handleLogin = () => {
    login();
  };
  const handleLogout = () => {
    logout().then(() => {
      remove();
    });
  };
  const editEventDescription = (
    event: gapi.client.calendar.Event,
    newDescription: string,
  ) => {
    editEventMutation.mutate({
      id: event.id || '',
      description: newDescription,
    });
  };

  return {
    signedIn,
    events,
    createNewEntry: addEventMutation.mutate,
    handleLogin,
    handleLogout,
    editEventDescription,
    isAdding: addEventMutation.isLoading,
    reloadEvents: refetch,
  };
};
