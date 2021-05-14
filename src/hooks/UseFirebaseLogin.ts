import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
  UserCredential,
} from 'firebase/auth';
import React from 'react';

import { firebaseApp } from '../utils/initFirebase';
import { useLocalStorage } from './UseLocalstorage';

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.events.owned');
const auth = getAuth(firebaseApp);

export const useFirebaseLogin = (): [
  () => Promise<UserCredential>,
  () => Promise<void>,
  boolean,
  string,
] => {
  const [token, setToken] = useLocalStorage<string>('access-token');
  const [loggedIn, setLoggedIn] = React.useState(false);

  const login = React.useCallback((): Promise<UserCredential> => {
    return setPersistence(auth, browserLocalPersistence).then(() =>
      signInWithPopup(auth, provider as GoogleAuthProvider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          const t = credential.accessToken;
          if (t) {
            setToken(t);
          }
        }

        return result;
      }),
    );
  }, [setToken]);

  const logout = React.useCallback((): Promise<void> => {
    return signOut(auth);
  }, []);

  React.useEffect(() => {
    onAuthStateChanged(auth, (o) => {
      if (o) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  return [login, logout, loggedIn, token];
};
