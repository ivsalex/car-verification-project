import React, { useState } from "react";
import { useAuth } from '@clerk/clerk-react';
import NotificationsSection from "../structure/Notifications/Notifications";
import { Navbar } from '../elements/Navbar';

const NotificationsPage = () => {
    const [credit, setCredit] = useState();
    const [notifications, setNotifications] = useState();
    const { getToken } = useAuth();

    const checkCredit = async () => {
        try {
            const response = await fetch('https://api.ivaiondan.ro/notifications/credit', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getToken()}`
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (response.status === 200) {
                setCredit(data.credit_value);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getAllNotifications = async (startDate, endDate) => {
        try {
            const response = await fetch(`https://api.ivaiondan.ro/notifications?startDate=${startDate}&endDate=${endDate}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getToken()}`
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (response.status === 200) {
                setNotifications(data.notifications);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <Navbar />
            <NotificationsSection
                checkCredit={checkCredit}
                getAllNotifications={getAllNotifications}
                notifications={notifications}
                credit={credit} />
        </div>
    );
};

export default NotificationsPage;