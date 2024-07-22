import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';

const root = ReactDOM.createRoot(document.getElementById('root'));

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

root.render(
    <ClerkProvider publishableKey={process.env.PUBLISHABLE_KEY}>
        <SignedIn>
            <App />
        </SignedIn>
        <SignedOut>
            <RedirectToSignIn />
        </SignedOut>
    </ClerkProvider>,
);

reportWebVitals();