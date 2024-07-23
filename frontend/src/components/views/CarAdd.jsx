import React, { useEffect, useState } from 'react';
import CarAddCard from "../structure/Cars/CarAddCard";
import { useUser, useAuth } from '@clerk/clerk-react';

const CarAdd = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const { user } = useUser();
    const { getToken } = useAuth();
    const [carData, setCarData] = useState({
        carVin: '',
        owner: '',
        ownerPhoneNumber: '',
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
            const formatDateToUTC = (date) => {
                const d = new Date(date);
                return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            };

            const formattedCarData = {
                ...carData,
                checkUpExpirationDate: formatDateToUTC(carData.checkUpExpirationDate),
                vignetteExpirationDate: formatDateToUTC(carData.vignetteExpirationDate),
            };

            const response = await fetch('https://api.ivaiondan.ro/cars/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${await getToken()}`
                },
                body: JSON.stringify(formattedCarData),
            });

            if (!response.ok) {
                const responseText = await response.text();
                handleErrorResponse(responseText);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setCarData(data);
            setErrorMessage('');
            window.location.href = '/cars';

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await createCar(carData);
    };

    useEffect(() => {
        if (!user) {
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