import React from 'react';
import { parseDescription, stringifyDescription } from '../utils/stringUtils';
import { AddGeneralEntryDialog, AddLogEntryDialog } from './AddEntryDialog';

export const Event: React.FC<{
  event: gapi.client.calendar.Event;
  editEvent: (
    event: gapi.client.calendar.Event,
    newDescription: string,
  ) => void;
}> = ({ event, editEvent }) => {
  const { general, log } = parseDescription(event.description);
  console.log(event.description, { general, log });
  return (
    <div key={event.id} className="flex-grow">
      General:
      <ul>
        {general.length === 0 ? (
          <li>No general comments added today</li>
        ) : (
          general.map((l, i) => <li key={i}>{l}</li>)
        )}
      </ul>
      <AddGeneralEntryDialog
        onAdd={(newLine) => {
          const description = stringifyDescription({
            general: [...general, newLine],
            log,
          });
          editEvent(event, description);
        }}
      />
      Log:
      <ul>
        {log.length === 0 ? (
          <li>No log comments added today</li>
        ) : (
          log.map((l, i) => <li key={i}>{l}</li>)
        )}
      </ul>
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
