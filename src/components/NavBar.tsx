import {
  AppBar,
  Button,
  Container,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export const NavBar: React.FC<{
  signedIn: boolean;
  onAuthChange: (state: 'login' | 'logout') => void;
}> = ({ signedIn, onAuthChange }) => {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Container maxWidth="md">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            KCETL
          </Typography>
          {signedIn ? (
            <>
              <Button
                variant="outlined"
                color="inherit"
                className={classes.menuButton}
                onClick={() => {
                  onAuthChange('logout');
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              color="inherit"
              className={classes.menuButton}
              onClick={() => {
                onAuthChange('login');
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
