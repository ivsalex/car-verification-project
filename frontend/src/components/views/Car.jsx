import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SingleCar from "../structure/Cars/SingleCar";
import Cookies from 'js-cookie';

const Car = () => {
    const [car, setCar] = useState({});
    const { carId } = useParams();

    const fetchCarData = async () => {
        try {
            const response = await fetch(`https://itp-rca.onrender.com/cars/${carId}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get("token")
                }
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

    const modifyCar = async (carId, updatedCar) => {
        try {
            const response = await fetch(`https://itp-rca.onrender.com/cars/${carId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Cookies.get("token")
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
        const token = Cookies.get('token');
        if (!token) {
            window.location.href = '/login'
        }
        fetchCarData();
    }, []);

    return (
        <div>
            <SingleCar car={car} deleteCar={deleteCar} modifyCar={modifyCar} />
        </div>
    );
};

export default Car;