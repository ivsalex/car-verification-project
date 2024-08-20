import React from 'react';
import Button from "../../elements/Button";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate();
    return (
        <div className="fixed inset-0 bg-cover bg-center h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
            <div className="relative z-10 text-center p-6 rounded-3xl border border-gray-300 bg-white shadow-2xl max-sm:m-6">
                <h1 className="text-blue-800 text-5xl sm:text-6xl md:text-7xl font-extrabold transition-transform transform hover:scale-105">
                    AUTONOTICE
                </h1>
                <div className="flex flex-col mt-8 sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button variant="blue" size="small" onClick={() => navigate('/expirari')}>
                        <p>EXPIRĂRI</p>
                    </Button>
                    <Button variant="blue" size="small" onClick={() => navigate('/cars')}>
                        <p>MAȘINI</p>
                    </Button>
                </div>
                <p className="mt-6 text-gray-600 max-sm:text-xs">
                    © 2024 IVAIONDAN SRL. Toate drepturile rezervate.
                </p>
            </div>
        </div>
    );
}

export default HomePage;
