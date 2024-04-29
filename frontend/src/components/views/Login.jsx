import React, { useState, useEffect } from "react";
import LoginCard from "../structure/Login/LoginCard";
import Cookies from 'js-cookie';

export const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [errorMessage, setErrorMessage] = useState('');

    const loginUser = async (credentials) => {
        const response = await fetch('https://itp-rca.onrender.com/users/login', {
            method: 'POST',
            mode: 'cors',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        const userData = await response.json();
        return userData;
    };

    function validateUserData(email, password, token) {
        if (email === undefined || password === undefined) {
            return 'Both email and password are required.';
        }

        if (!token) {
            return 'Error! Try again!';
        }

        return null;
    }

    useEffect(() => {
        const token = Cookies.get('token');

        if (token) {
            window.location.href = '/'
        }
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        const result = await loginUser({
            email,
            password
        });

        const validationMessage = validateUserData(email, password, result.token);

        if (validationMessage) {
            setErrorMessage(validationMessage);
            return;
        }

        // window.location.href = '/cars'
        setErrorMessage('');
    };

    return (
        <LoginCard
            handleSubmit={handleSubmit}
            errorMessage={errorMessage}
            setEmail={setEmail}
            setPassword={setPassword}
        />
    )
}