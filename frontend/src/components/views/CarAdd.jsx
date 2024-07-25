import React, { useEffect, useState } from 'react';
import CarAddCard from "../structure/Cars/CarAddCard";
import { useUser, useAuth } from '@clerk/clerk-react';

const CarAdd = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const { getToken } = useAuth();
    const [carData, setCarData] = useState({
        carVin: '',
        owner: '',
        ownerPhoneNumber: '',
        plateNumber: '',
        checkUpExpirationDate: '',
        vignetteExpirationDate: '',
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

            const vignetteCheck = await fetch(`https://api.ivaiondan.ro/api/vgnCheck?plateNumber=${carData.plateNumber}&vin=${carData.carVin}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                },
            });

            if (!vignetteCheck.ok) {
                throw new Error(`HTTP error! status: ${vignetteCheck.status}`);
            }

            const responseData = await vignetteCheck.json();
            const dataStop = responseData[0].dataStop.split(' ')[0];

            const formattedCarData = {
                ...carData,
                plateNumber: carData.plateNumber.toUpperCase(),
                checkUpExpirationDate: formatDateToUTC(carData.checkUpExpirationDate),
                vignetteExpirationDate: dataStop || null
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

            window.location.href = `cars/${data?.car._id}`;

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await createCar(carData);
    };

    return (
        <div>
            <CarAddCard handleSubmit={handleSubmit} setCarData={setCarData} carData={carData} errorMessage={errorMessage} />
        </div>
    );
};

export default CarAdd;