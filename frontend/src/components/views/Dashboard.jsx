import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../elements/Button";
import Spinner from "../elements/Spinner";
import { useUser, useClerk } from "@clerk/clerk-react";

export const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const { signOut } = useClerk();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

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
                <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-xl border-2">
                    <div className="text-lg flex flex-col">
                        <h1 className="text-2xl font-bold text-center">Profil utilizator</h1>
                        <div className="p-8 space-y-4">
                            <div>
                                <span className="text-gray-600 font-bold">Email:</span>
                                <span className="ml-2">{user.primaryEmailAddress.emailAddress}</span>
                            </div>
                            <div>
                                <span className="text-gray-600 font-bold">Nume:</span>
                                <span className="ml-2">{user.username}</span>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleLogout}
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