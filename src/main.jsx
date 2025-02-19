import './_mockApis';
import './utils/i18n';

import React, { Suspense } from 'react';

import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import Spinner from './views/spinner/Spinner';
import { store } from './store/Store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="79946673447-0e7h6b04a3aq1kfhb6qikml7rld246ah.apps.googleusercontent.com">
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Suspense>
    </Provider>
    ,
  </GoogleOAuthProvider>,
);
