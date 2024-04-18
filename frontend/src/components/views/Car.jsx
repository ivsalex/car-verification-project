import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SingleCar from "../structure/Cars/SingleCar";
import Cookies from 'js-cookie';

const Car = () => {
    const [car, setCar] = useState([]);
    const { carId } = useParams();

    const fetchCarData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/cars/${carId}`, {
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

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            window.location.href = '/login'
        }
        fetchCarData();
    }, []);

    return (
        <div>
            <SingleCar car={car} />
        </div>
    );
};

export default Car;