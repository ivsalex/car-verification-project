import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../elements/Button";
import { useAuth } from "../../contexts/AuthProvider";
import Spinner from "../elements/Spinner";
import Cookies from 'js-cookie';

export const Dashboard = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    const getUser = () => {
        const token = Cookies.get('token');
        if (token) {
            try {
                console.log(token)
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUser(payload);
                setAuth(payload);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
        return null;
    }

    const logout = () => {
        Cookies.remove('token');
        setAuth(null);

        window.location.href = '/';
    };

    useEffect(() => {
        const token = Cookies.get('token');
        getUser();
        if (!token) {
            navigate('/login');
        }

        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

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
                <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-xl border-2">
                    <div className="text-lg flex flex-col">
                        <h1 className="text-2xl font-bold text-center">Profil utilizator</h1>
                        <div className="p-8 space-y-4">
                            <div>
                                <span className="text-gray-600 font-bold">Email:</span>
                                <span className="ml-2">{user?.email}</span>
                            </div>
                            <div>
                                <span className="text-gray-600 font-bold">Nume:</span>
                                <span className="ml-2">{user?.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-600 font-bold">Rol:</span>
                                <span className="ml-2">{user?.role}</span>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={() => logout()}
                        className="text-black focus:outline-none"
                        variant="blue"
                    >
                        Log out
                    </Button>
                </div>
            )}
        </div>
    )
}