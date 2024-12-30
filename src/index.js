import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import AuthProvider from 'react-auth-kit';
import createStore from 'react-auth-kit/createStore'; 

const params = {
  authType: 'cookie', 
  authName: '_auth',
  cookieDomain:window.location.hostname, 
  cookieSecure:window.location.protocol === 'https:'
}
const store = createStore(params);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider  store={store}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

