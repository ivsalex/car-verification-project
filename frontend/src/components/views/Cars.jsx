import React from 'react';
import CarsList from '../structure/Cars/CarsList';
import CarsListSkeleton from '../structure/Cars/CarsListSkeleton';
import { useAuth } from '@clerk/clerk-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Navbar } from '../elements/Navbar';

const fetchCarsData = async (token) => {
    const response = await fetch('https://api.ivaiondan.ro/cars', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        mode: 'cors'
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.cars;
};

const Cars = () => {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    const { data: cars, error, isLoading } = useQuery({
        queryKey: ['cars'],
        queryFn: async () => {
            const token = await getToken();
            return fetchCarsData(token);
        },
    });

    const deleteCar = async (carId) => {
        try {
            const token = await getToken();
            const response = await fetch(`https://api.ivaiondan.ro/cars/${carId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            queryClient.invalidateQueries(['cars']);
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    };

    if (isLoading) {
        return (
            <div>
                <Navbar />
                <CarsListSkeleton />
            </div>
        );
    }

    if (error) {
        return <div>Error fetching data: {error.message}</div>;
    }

    return (
        <div>
            <Navbar />
            <CarsList cars={cars} deleteCar={deleteCar} />
        </div>
    );
};

export default Cars;
