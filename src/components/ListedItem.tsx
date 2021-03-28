import {
  IconButton,
  ListItem,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/CloseRounded';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  item: {
    minHeight: 64,
    padding: `${theme.spacing(1)}px 0`,
  },
  makeSure: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    padding: theme.spacing(1),
    left: 0,
    right: 0,
    background: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '& svg': {
      color: theme.palette.error.contrastText,
    },
  },
  spacer: {
    flex: 1,
  },
}));

export const ListedItem: React.FC<{
  text: string;
  onDelete: () => void;
  onEdit?: () => void;
}> = ({ text, onDelete }) => {
  const [sureDelete, setSureDelete] = React.useState(false);
  const classes = useStyles();
  return (
    <ListItem className={classes.item}>
      <ListItemText>{text}</ListItemText>
      {sureDelete ? (
        <div className={classes.makeSure}>
          <span>Sure you want to delete?</span>
          <div className={classes.spacer} />
          <IconButton
            onClick={() => {
              onDelete();
              setSureDelete(false);
            }}
            edge="end"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setSureDelete(false);
            }}
            edge="end"
            aria-label="Cancel"
          >
            <CloseIcon />
          </IconButton>
        </div>
      ) : (
        <div>
          <IconButton
            onClick={() => {
              setSureDelete(true);
            }}
            edge="end"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </div>
      )}
    </ListItem>
  );
};
