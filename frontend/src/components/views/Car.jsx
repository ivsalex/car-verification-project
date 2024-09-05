import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SingleCar from "../structure/Cars/SingleCar";
import SingleCarSkeleton from "../structure/Cars/SingleCarSkeleton";
import { useAuth } from '@clerk/clerk-react';
import { Navbar } from '../elements/Navbar';

const Car = () => {
    const [car, setCar] = useState({});
    const { carId } = useParams();
    const [loading, setLoading] = useState(true);
    const [popupMessage, setPopupMessage] = useState('');
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
            setLoading(false);

        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
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
                setPopupMessage('Datele autovehicului au fost actualizate!');
            } else {
                setPopupMessage('Eroare la modificarea autovehicului!');
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

                setPopupMessage('Datele rovinietei au fost actualizate!');

            } else {
                setPopupMessage(
                    <>
                        Rovinieta pentru <span className="font-bold">{car.plateNumber}</span> nu a fost găsită.
                    </>
                );
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
            {loading ? (
                <SingleCarSkeleton />
            ) : (
                <SingleCar
                    car={car}
                    deleteCar={deleteCar}
                    modifyCar={modifyCar}
                    vignetteRecheck={vignetteRecheck}
                    popupMessage={popupMessage}
                />
            )}
        </div>
    );
};

export default Car;