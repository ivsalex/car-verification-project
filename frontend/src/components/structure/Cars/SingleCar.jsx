import React, { useEffect, useState } from 'react';
import Button from "../../elements/Button";
import Spinner from "../../elements/Spinner";
import { useNavigate } from "react-router-dom";
import { TrashIcon, PencilIcon, ArrowCircleLeftIcon } from '@heroicons/react/outline';

function SingleCar({ car }) {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = (date.getUTCFullYear()).toString().padStart(2, '0');

        return `${day}.${month}.${year}`;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col justify-center align-center w-1/3 mx-auto h-100">
            {loading && (
                <div role="status">
                    <Spinner />
                </div>
            )}
            {!loading && (
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-col bg-gray-200 text-x space-y-4 p-6 text-center rounded-2xl w-auto">
                        <div className="flex flex-col text-xl space-y-4 p-6 text-center rounded-2xl w-auto">
                            <h1><span className="font-bold">Serie șasiu: </span>{car?.carVin}</h1>
                            <p><span className="font-bold">Proprietar:</span> {car?.owner}</p>
                            <p><span className="font-bold">Număr înmatriculare:</span> {car?.plateNumber}</p>
                            <p><span className="font-bold">Dată expirare ITP:</span> {formatTimestamp(car?.expirationDate)}</p>
                            <div className="space-x-2 flex justify-center">
                                <Button variant="gray" onClick={() => navigate("/cars")}><ArrowCircleLeftIcon className="h-7 w-7" /></Button>
                                <Button variant="blue"><PencilIcon className="h-7 w-7" /></Button>
                                <Button variant="red"><TrashIcon className="h-7 w-7" /></Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SingleCar;
