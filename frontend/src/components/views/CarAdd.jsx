import React, { useEffect, useState } from 'react';
import CarAddCard from "../structure/Cars/CarAddCard";
import Cookies from 'js-cookie';

const CarAdd = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const [carData, setCarData] = useState({
        carVin: '',
        owner: '',
        plateNumber: '',
        checkUpExpirationDate: null,
        vignetteExpirationDate: null,
    });

    const handleErrorResponse = (responseText) => {
        switch (responseText) {
            case '{"message":"This VIN is already in use!"}':
                setErrorMessage('Această serie de șasiu există deja!');
                break;
            case '{"message":"This Plate Number is already in use!"}':
                setErrorMessage('Acest număr de înmatriculare există deja!');
                break;
            default:
                setErrorMessage('A apărut o eroare!');
                break;
        }
    };

    const createCar = async (carData) => {
        try {
            const response = await fetch(`http://localhost:3001/cars/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + Cookies.get("token")
                },
                body: JSON.stringify(carData),
            });

            if (!response.ok) {
                const responseText = await response.text();
                handleErrorResponse(responseText);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setCarData(data);
            setErrorMessage('');
            window.location.href = '/cars'

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await createCar(carData);
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            window.location.href = '/login'
        }
    }, []);

    return (
        <div>
            <CarAddCard handleSubmit={handleSubmit} setCarData={setCarData} carData={carData} errorMessage={errorMessage} />
        </div>
    );
};

export default CarAdd;