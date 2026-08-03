import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register VishLink PWA Service Worker
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('✅ VishLink PWA Service Worker Registered successfully:', reg.scope);
    }).catch((err) => {
      console.warn('⚠️ Service Worker Registration failed:', err);
    });
  });
} else if ('serviceWorker' in navigator) {
  // Register in dev mode as well for instant PWA testing
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.log('⚡ VishLink PWA SW active in dev mode:', reg.scope);
    }).catch((err) => {
      console.warn('SW register notice:', err);
    });
  });
}

