import React, { useState } from "react";
import DueCarsSection from "../structure/DueCars/DueCarsSection";
import { useAuth } from '@clerk/clerk-react';
import { Navbar } from '../elements/Navbar';

const DueCarsPage = () => {
    const [dueCars, setDueCars] = useState([]);
    const { getToken } = useAuth();

    const fetchCarsData = async (range, type) => {
        try {
            const response = await fetch(`https://api.ivaiondan.ro/cars/expiring?range=${range}&type=${type}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getToken()}`
                },
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setDueCars(data?.dueCars);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const sendSms = async (carId, owner, ownerPhoneNumber, plateNumber, expirationType, expirationDate, daysRemaining) => {
        try {
            const response = await fetch('https://api.ivaiondan.ro/api/v1/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': process.env.REACT_APP_SMS_APIKEY
                },
                body: JSON.stringify({
                    to: '+4' + ownerPhoneNumber,
                    sender: '4',
                    body: `${expirationType} dvs. la autovehiculul ${plateNumber.toUpperCase()} expira la data de: ${expirationDate} (${daysRemaining > 0 ? `${daysRemaining} zile` : 'astazi'}). Daniel Ivascu - Asigurari`,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            if (response.status === 200) {
                modifyNotifications(carId);
                await fetch(`https://api.ivaiondan.ro/notifications/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await getToken()}`
                    },
                    body: JSON.stringify({
                        date: Date.now(),
                        owner: owner,
                        plateNumber: plateNumber,
                        ownerPhoneNumber: ownerPhoneNumber,
                        smsBody: `${expirationType} dvs. la autovehiculul ${plateNumber.toUpperCase()} expira la data de: ${expirationDate} (${daysRemaining > 0 ? `${daysRemaining} zile` : 'astazi'}). Daniel Ivascu - Asigurari`
                    }),
                });
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const modifyNotifications = async (carId) => {
        try {
            const now = new Date();
            const todayDate = now.toLocaleDateString();

            const response = await fetch(`https://api.ivaiondan.ro/cars/${carId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getToken()}`
                },
                body: JSON.stringify({
                    lastNotificationDate: todayDate
                }),
            });

            if (response.ok) {
                console.log('Car notification status modified!');
                setDueCars(prevCars =>
                    prevCars.map(car =>
                        car._id === carId
                            ? { ...car, lastNotificationDate: todayDate }
                            : car
                    )
                );
                window.location.reload();
            } else {
                console.error('Error modifying car:', response.status);
            }
        } catch (error) {
            console.error('Error modifying car:', error);
        }
    };

    const disableButton = (lastNotificationDate) => {
        const now = new Date();
        const todayDate = now.toLocaleDateString();

        const notif = new Date(lastNotificationDate);
        const notifDate = notif.toLocaleDateString();

        return notifDate === todayDate;
    };

    return (
        <div>
            <Navbar />
            <DueCarsSection fetchCarsData={fetchCarsData} dueCars={dueCars} sendSms={sendSms} disableButton={disableButton} />
        </div>
    );
};

export default DueCarsPage;