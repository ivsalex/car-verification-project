import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';

const root = ReactDOM.createRoot(document.getElementById('root'));

const PUBLISHABLE_KEY = 'pk_test_bW9yYWwtYnJlYW0tMzkuY2xlcmsuYWNjb3VudHMuZGV2JA'

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

root.render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <SignedIn>
            <App />
        </SignedIn>
        <SignedOut>
            <RedirectToSignIn />
        </SignedOut>
    </ClerkProvider>,
);

reportWebVitals();