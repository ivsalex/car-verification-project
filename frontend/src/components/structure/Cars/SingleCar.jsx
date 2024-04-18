import React from "react";
import Button from "../../elements/Button";
import { TrashIcon, PencilIcon } from '@heroicons/react/outline';

function SingleCar({ car }) {

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = (date.getUTCFullYear()).toString().padStart(2, '0');

        return `${day}.${month}.${year}`;
    }

    return (
        <div className="flex flex-col justify-center align-center w-1/3 mx-auto h-100">
            <div className="flex flex-col text-xl bg-gray-200 space-y-4 p-6 text-center rounded-2xl w-auto">
                <h1><span className="font-bold">Serie șasiu: </span>{car?.carVin}</h1>
                <p><span className="font-bold">Proprietar:</span> {car?.owner}</p>
                <p><span className="font-bold">Număr înmatriculare:</span> {car?.plateNumber}</p>
                <p><span className="font-bold">Dată expirare ITP:</span> {formatTimestamp(car?.expirationDate)}</p>
                <div className="space-x-2 flex justify-center">
                    <Button variant="blue"><PencilIcon className="h-7 w-7" /></Button>
                    <Button variant="red"><TrashIcon className="h-7 w-7" /></Button>
                </div>
            </div>
        </div>
    );
}

export default SingleCar;
