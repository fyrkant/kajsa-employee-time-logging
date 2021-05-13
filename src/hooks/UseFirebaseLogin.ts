import firebase from 'firebase/app';
import React from 'react';

import { useLocalStorage } from './UseLocalstorage';

const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.events.owned');

export const useFirebaseLogin = (): [
  () => Promise<firebase.auth.UserCredential>,
  () => Promise<void>,
  boolean,
  string,
] => {
  const [token, setToken] = useLocalStorage<string>('access-token');
  const [loggedIn, setLoggedIn] = React.useState(false);

  const login = (): Promise<firebase.auth.UserCredential> => {
    return firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() =>
        firebase
          .auth()
          .signInWithPopup(provider as firebase.auth.GoogleAuthProvider)
          .then((result) => {
            if (result.credential) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const t = (result.credential as any).accessToken as string;
              setToken(t);
            }

            return result;
          }),
      );
  };

  const logout = (): Promise<void> => {
    return firebase.auth().signOut();
  };

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((o) => {
      if (o) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  return [login, logout, loggedIn, token];
};
