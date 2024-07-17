import React, { useState, useEffect } from "react";
import CarsList from '../structure/Cars/CarsList';
import { useUser, useAuth } from '@clerk/clerk-react';

const Cars = () => {
    const [cars, setCars] = useState([]);
    const { user } = useUser();
    const { getToken } = useAuth();

    const fetchCarsData = async () => {
        try {
            const response = await fetch('https://api.ivaiondan.ro/cars/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getToken()}`
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setCars(data?.cars);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const deleteCar = async (carId) => {
        try {
            const response = await fetch(`https://api.ivaiondan.ro/cars/${carId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            window.location.reload();

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (!user) {
            window.location.href = '/sign-in'
        }
        fetchCarsData();
    }, []);

    return (
        <div>
            <CarsList cars={cars} deleteCar={deleteCar} />
        </div>
    );
};

export default Cars;