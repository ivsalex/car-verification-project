import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';

const root = ReactDOM.createRoot(document.getElementById('root'));

const PUBLISHABLE_KEY = 'pk_live_Y2xlcmsuaXZhaW9uZGFuLnJvJA'
const queryClient = new QueryClient();

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

root.render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <SignedIn>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </SignedIn>
        <SignedOut>
            <RedirectToSignIn />
        </SignedOut>
    </ClerkProvider>,
);

reportWebVitals();