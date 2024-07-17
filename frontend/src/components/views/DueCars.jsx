import React, { useState } from "react";
import DueCarsSection from "../structure/DueCars/DueCarsSection";

const DueCarsPage = () => {
    const [dueCars, setDueCars] = useState([]);

    const fetchCarsData = async (range, type) => {
        try {
            const response = await fetch(`https://api.ivaiondan.ro/cars/expiring?range=${range}&type=${type}`, {
                method: 'GET',
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

    return (
        <div>
            <DueCarsSection fetchCarsData={fetchCarsData} dueCars={dueCars} />
        </div>
    );
};

export default DueCarsPage;