import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/scss/bootstrap.scss';
import './assets/scss/app.scss';
import App from './App';
import { AuthProvider } from "./components/utils/AuthProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 // <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
 // </React.StrictMode>,

);
