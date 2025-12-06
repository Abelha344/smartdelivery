
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// ------------------------------------------------------------------
// CLERK CONFIGURATION
// ------------------------------------------------------------------
// Robust configuration:
// 1. Try to read from Vite environment variables (VITE_CLERK_PUBLISHABLE_KEY)
// 2. Fallback to the hardcoded key provided to ensure app runs immediately
// ------------------------------------------------------------------

const getPublishableKey = () => {
  // Access import.meta safely for TypeScript by casting to any
  const meta = (typeof import.meta !== 'undefined' ? import.meta : {}) as any;
  const envKey = meta.env ? meta.env.VITE_CLERK_PUBLISHABLE_KEY : undefined;
  
  // Also check for the typo version provided in prompt just in case user added it to .env
  const typoKey = meta.env ? meta.env.VITE_CLERK_PUBLISHABLE_KE : undefined;
    
  // Fallback to your specific key if env var fails
  return envKey || typoKey || "pk_test_b3Blbi1oYWRkb2NrLTYwLmNsZXJrLmFjY291bnRzLmRldiQ";
};

const PUBLISHABLE_KEY = getPublishableKey();

const root = ReactDOM.createRoot(rootElement);

if (!PUBLISHABLE_KEY) {
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 text-center mb-2">
          Configuration Missing
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm">
          Unable to load Clerk Publishable Key.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all"
        >
          Reload
        </button>
      </div>
    </div>
  );
} else {
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
         <App />
      </ClerkProvider>
    </React.StrictMode>
  );
}
