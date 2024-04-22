import React, { useState } from "react";
import HomeSection from "../structure/Home/HomeSection";
import Cookies from "js-cookie";

const Home = () => {
    const [dueCars, setDueCars] = useState([]);

    const fetchCarsData = async (range, type) => {
        try {
            const response = await fetch(`http://localhost:3001/cars/expiring?range=${range}?type=${type}`, {
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

    return (
        <div>
            <HomeSection fetchCarsData={fetchCarsData} dueCars={dueCars} />
        </div>
    );
};

export default Home;