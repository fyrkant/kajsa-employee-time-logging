import { List, ListItem, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

import { parseDescription, stringifyDescription } from '../utils/stringUtils';
import { AddGeneralEntryDialog, AddLogEntryDialog } from './AddEntryDialog';
import { ListedItem } from './ListedItem';

const useStyles = makeStyles(() => ({
  logTitle: { marginTop: '1rem' },
}));

export const Event: React.FC<{
  event: gapi.client.calendar.Event;
  editEvent: (
    event: gapi.client.calendar.Event,
    newDescription: string,
  ) => void;
}> = ({ event, editEvent }) => {
  const classes = useStyles();
  const { general, log } = parseDescription(event.description);
  const handleDelete = (i: number, type: 'general' | 'log') => {
    const arr = type === 'log' ? log : general;
    const newArr = [...arr.slice(0, i), ...arr.slice(i + 1)];

    const stringed = stringifyDescription({
      log: type === 'log' ? newArr : log,
      general: type === 'general' ? newArr : general,
    });

    editEvent(event, stringed);
  };
  return (
    <div key={event.id}>
      <Typography variant="h5">General:</Typography>
      <List>
        {general.length === 0 ? (
          <ListItem>No general comments added today</ListItem>
        ) : (
          general.map((l, i) => (
            <ListedItem
              key={i}
              text={l}
              onDelete={() => handleDelete(i, 'general')}
            />
          ))
        )}
      </List>
      <AddGeneralEntryDialog
        onAdd={(newLine) => {
          const description = stringifyDescription({
            general: [...general, newLine],
            log,
          });
          editEvent(event, description);
        }}
      />
      <Typography variant="h5" className={classes.logTitle}>
        Log:
      </Typography>
      <List>
        {log.length === 0 ? (
          <ListItem>No log comments added today</ListItem>
        ) : (
          log.map((l, i) => (
            <ListedItem
              key={i}
              text={l}
              onDelete={() => handleDelete(i, 'log')}
            />
          ))
        )}
      </List>
      <AddLogEntryDialog
        onAdd={(newLine) => {
          const description = stringifyDescription({
            general,
            log: [...log, newLine],
          });
          editEvent(event, description);
        }}
      />
    </div>
  );
};
