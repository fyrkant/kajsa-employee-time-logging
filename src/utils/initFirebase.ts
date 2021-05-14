import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'kcetl-4ca65.firebaseapp.com',
  projectId: 'kcetl-4ca65',
  storageBucket: 'kcetl-4ca65.appspot.com',
  messagingSenderId: '917921217647',
  appId: '1:917921217647:web:563a70081fd4340ae4219a',
};
export const firebaseApp = initializeApp(firebaseConfig);
