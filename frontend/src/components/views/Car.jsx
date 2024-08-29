import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SingleCar from "../structure/Cars/SingleCar";
import { useAuth } from '@clerk/clerk-react';
import { Navbar } from '../elements/Navbar';

const Car = () => {
    const [car, setCar] = useState({});
    const { carId } = useParams();
    const [vgnCheckError, setVgnCheckError] = useState('');
    const [updatedCarMessage, setUpdatedCarMessage] = useState('');
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

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const modifyCar = async (carId, updatedCar) => {
        try {
            const formatDateToUTC = (date) => {
                if (date === null) {
                    return null;
                }
                const d = new Date(date);
                return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            };

            const formattedCarData = {
                ...updatedCar,
                insuranceExpirationDate: formatDateToUTC(updatedCar.insuranceExpirationDate),
                checkUpExpirationDate: formatDateToUTC(updatedCar.checkUpExpirationDate),
                vignetteExpirationDate: updatedCar.vignetteExpirationDate
            };

            const response = await fetch(`https://api.ivaiondan.ro/cars/${carId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getToken()}`
                },
                body: JSON.stringify(formattedCarData),
            });

            if (response.ok) {
                setCar(formattedCarData);
                setUpdatedCarMessage('Datele autovehicului au fost actualizate!');

                setTimeout(() => {
                    setUpdatedCarMessage('');
                }, 2000);
            } else {
                setUpdatedCarMessage('Eroare la modificarea autovehicului!');

                setTimeout(() => {
                    setUpdatedCarMessage('');
                }, 2000);
                console.error('Error modifying car:', response.status);
            }
        } catch (error) {
            console.error('Error modifying car:', error);
        }
    };

    const vignetteRecheck = async () => {
        try {
            const response = await fetch(`https://api.ivaiondan.ro/api/vgnCheck?plateNumber=${car.plateNumber}&vin=${car.carVin}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${await getToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.length > 0) {
                const formattedCarData = {
                    ...car,
                    vignetteExpirationDate: data[0].dataStop.split(' ')[0]
                };

                setCar({ ...car, vignetteExpirationDate: data[0].dataStop.split(' ')[0] });

                await fetch(`https://api.ivaiondan.ro/cars/${carId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await getToken()}`
                    },
                    body: JSON.stringify(formattedCarData),
                });

                setVgnCheckError('Datele rovinietei au fost actualizate!')

                setTimeout(() => {
                    setVgnCheckError('');
                }, 2000);

            } else {
                setVgnCheckError('Eroare la verificarea rovinietei!');
                setTimeout(() => {
                    setVgnCheckError('');
                }, 2000);
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
            <Navbar />
            <SingleCar car={car} deleteCar={deleteCar} modifyCar={modifyCar} vignetteRecheck={vignetteRecheck} vgnCheckError={vgnCheckError} updatedCarMessage={updatedCarMessage} />
        </div>
    );
};

export default Car;