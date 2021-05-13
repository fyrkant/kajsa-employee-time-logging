import './index.css';
import 'firebase/auth';

import firebase from 'firebase/app';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const firebaseConfig = {
  apiKey: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'kcetl-4ca65.firebaseapp.com',
  projectId: 'kcetl-4ca65',
  storageBucket: 'kcetl-4ca65.appspot.com',
  messagingSenderId: '917921217647',
  appId: '1:917921217647:web:563a70081fd4340ae4219a',
};
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
