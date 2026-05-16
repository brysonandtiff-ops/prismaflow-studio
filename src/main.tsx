import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './index.css';
import { Toaster } from '@/components/ui/sonner';
import { registerSW } from 'virtual:pwa-register';

// Register service worker
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-center" richColors />
  </React.StrictMode>
);
