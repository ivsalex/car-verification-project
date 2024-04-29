import React, { useState, useEffect } from "react";
import CarsList from '../structure/Cars/CarsList';
import Cookies from 'js-cookie';

const Cars = () => {
    const [cars, setCars] = useState([]);

    const fetchCarsData = async () => {
        try {
            const response = await fetch('https://itp-rca.onrender.com/cars/', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get("token")
                }
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
            const response = await fetch(`https://itp-rca.onrender.com/cars/${carId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get("token")
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
        const token = Cookies.get('token');
        if (!token) {
            window.location.href = '/login'
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