import React from 'react';
import { SignIn } from '@clerk/clerk-react';

function LoginPage() {
    return (
        <div>
            <SignIn path='/login' />
        </div >
    );
}

export default LoginPage;
