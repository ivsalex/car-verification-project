import React from 'react';
import Button from "../../elements/Button";

function HomePage() {
    return (
        <div className="fixed w-full bg-cover bg-center h-screen flex items-center justify-center">
            <div className="relative z-10 text-center p-4 rounded-2xl border bg-gray-100">
                <h1 className="text-blue-600 text-4xl sm:text-5xl md:text-6xl font-bold mb-6">Bază de date - Autovehicule</h1>
                <p className="text-gray-600 text-lg sm:text-xl md:text-2xl mb-8">Administrează ușor datele de ITP și Rovinietă!</p>
                <div className="flex justify-center space-x-2">
                    <Button variant="blue" size="small"><a href="/expirari">EXPIRĂRI</a></Button>
                    <Button variant="blue" size="small"><a href="/cars">MAȘINI</a></Button>
                </div>
                <p className="mt-4 text-gray-400">© 2024 IVAIONDAN SRL. Toate drepturile rezervate.</p>
            </div>
        </div >
    );
}

export default HomePage;
