import React, { useState, useEffect } from "react";
import DueCarsSection from "../structure/DueCars/DueCarsSection";
import Cookies from "js-cookie";

const DueCarsPage = () => {
    const [dueCars, setDueCars] = useState([]);

    const fetchCarsData = async (range, type) => {
        try {
            const response = await fetch(`http://localhost:3001/cars/expiring?range=${range}&type=${type}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + Cookies.get("token")
                }
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

    useEffect(() => {
        const token = Cookies.get('token');
        if (!token) {
            window.location.href = '/login'
        }
        fetchCarsData();
    }, []);

    return (
        <div>
            <DueCarsSection fetchCarsData={fetchCarsData} dueCars={dueCars} />
        </div>
    );
};

export default DueCarsPage;