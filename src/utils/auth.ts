import firebase from 'firebase/app';

const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.events.owned');

export const login = (): Promise<firebase.auth.UserCredential> => {
  return firebase.auth().signInWithPopup(provider);
};

export const logout = (): Promise<void> => {
  return firebase.auth().signOut();
};
