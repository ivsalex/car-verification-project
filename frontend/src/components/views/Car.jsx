import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SingleCar from "../structure/Cars/SingleCar";
import { useUser, useAuth } from '@clerk/clerk-react';

const Car = () => {
    const [car, setCar] = useState({});
    const { carId } = useParams();
    const { user } = useUser();
    const { getToken } = useAuth();

    const fetchCarData = async () => {
        try {
            const response = await fetch(`https://api.ivaiondan.ro/cars/${carId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getToken()}`
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setCar(data);

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
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            window.location.reload();

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const modifyCar = async (carId, updatedCar) => {
        try {
            // const formatDateToUTC = (date) => {
            //     const d = new Date(date);
            //     return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            // };

            // const formattedCarData = {
            //     ...updatedCar,
            //     checkUpExpirationDate: formatDateToUTC(updatedCar.checkUpExpirationDate),
            //     vignetteExpirationDate: formatDateToUTC(updatedCar.vignetteExpirationDate),
            // };

            const response = await fetch(`https://api.ivaiondan.ro/cars/${carId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getToken()}`
                },
                body: JSON.stringify(updatedCar),
            });

            if (response.ok) {
                window.location.reload();
            } else {
                console.error('Error modifying car:', response.status);
            }
        } catch (error) {
            console.error('Error modifying car:', error);
        }
    };

    useEffect(() => {
        fetchCarData();
    }, []);

    return (
        <div>
            <SingleCar car={car} deleteCar={deleteCar} modifyCar={modifyCar} />
        </div>
    );
};

export default Car;