import React, { useState } from "react";
import DueCarsSection from "../structure/DueCars/DueCarsSection";
import { useAuth } from '@clerk/clerk-react';

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

    // const sendSms = async (ownerPhoneNumber, plateNumber, expirationType, expirationDate, daysRemaining) => {
    //     try {
    //         const response = await fetch('https://api.ivaiondan.ro/api/v1/send', {
    //             method: 'POST',
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 'X-Authorization': process.env.REACT_APP_SMS_APIKEY
    //             },
    //             body: JSON.stringify({
    //                 to: '+4' + ownerPhoneNumber,
    //                 sender: '4',
    //                 message: `
    //                 ${expirationType} dvs. la autovehiculul ${plateNumber} expiră la data de: ${expirationDate} (${daysRemaining} zile)
    //                 Daniel Ivașcu - Asigurări
    //                 `,
    //             }),
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         window.location.reload();

    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };

    const sendSms = async (ownerPhoneNumber, plateNumber, expirationType, expirationDate, daysRemaining) => {
        try {
            const response = await fetch('https://api.ivaiondan.ro/send-sms', {
                body: JSON.stringify({
                    to: '+4' + ownerPhoneNumber,
                    sender: '4',
                    message: `
                    ${expirationType} dvs. la autovehiculul ${plateNumber} expiră la data de: ${expirationDate} (${daysRemaining} zile)
                    Daniel Ivașcu - Asigurări
                    `,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            window.location.reload();

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <DueCarsSection fetchCarsData={fetchCarsData} dueCars={dueCars} sendSms={sendSms} />
        </div>
    );
};

export default DueCarsPage;