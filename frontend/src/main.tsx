import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './routes';
import { AuthProvider } from './auth/AuthContext';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <Routes />
        </AuthProvider>
    </React.StrictMode>
);
