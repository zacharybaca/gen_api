import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/react-router';
import { AppProvider } from './contexts/AppProvider.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'modern-normalize';
import './index.css';

import App from './App.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {PUBLISHABLE_KEY ? (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <AppProvider>
            <App />
            <ToastContainer position="top-right" autoClose={4000} />
          </AppProvider>
        </ClerkProvider>
      ) : (
        <AppProvider>
          <App />
          <ToastContainer position="top-right" autoClose={4000} />
        </AppProvider>
      )}
    </BrowserRouter>
  </StrictMode>
);
