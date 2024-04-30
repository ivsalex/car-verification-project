import React, { useEffect, useState } from 'react';
import Button from "../../elements/Button";
import Spinner from "../../elements/Spinner";

function LoginCard({ handleSubmit, errorMessage, setEmail, setPassword }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex items-center justify-center h-100">
            {loading && (
                <div role="status">
                    <Spinner />
                </div>
            )}
            {!loading && (
                <div className="bg-white shadow-lg border-1 rounded-lg p-12">
                    <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="p-4">
                            <label htmlFor="username" className="block text- font-medium text-gray-500">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="mt-1 p-2 text-lg border rounded w-full"
                                placeholder="Enter your username"
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="p-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-500">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 p-2 text-lg border rounded w-full"
                                placeholder="Enter your password"
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        {errorMessage && <p className="text-red-500 mb-6 font-semibold text-center">{errorMessage}</p>}
                        <div className="flex justify-center text-center mt-4">
                            <Button variant="blue" size="small">Sign in</Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
};

export default LoginCard;