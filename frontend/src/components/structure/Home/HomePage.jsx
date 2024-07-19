import React from 'react';
import Button from "../../elements/Button";
import background from "../../../assets/images/background.png";

function HomePage() {
    return (
        <div className="fixed w-full bg-cover bg-center h-screen flex items-center justify-center"
            style={{ backgroundImage: `url(${background})` }}>
            <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="relative z-10 text-white text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">Bază de date - Autovehicule</h1>
                <p className="text-lg sm:text-xl md:text-2xl mb-8">Administrează ușor datele de ITP și Rovinietă!</p>
                <div className="flex justify-center space-x-2">
                    <Button variant="blue" size="small"><a href="/expirari">EXPIRĂRI</a></Button>
                    <Button variant="blue" size="small"><a href="/api/cars">MAȘINI</a></Button>
                </div>
            </div>
        </div >
    );
}

export default HomePage;
