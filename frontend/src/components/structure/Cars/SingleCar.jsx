import React, { useEffect, useState } from 'react';
import Button from "../../elements/Button";
import Spinner from "../../elements/Spinner";
import { useNavigate } from "react-router-dom";
import Modal from "../../elements/Modal";
import { TrashIcon, PencilIcon, ArrowCircleLeftIcon } from '@heroicons/react/outline';
import ModifyModal from '../../elements/ModifyModal';

function SingleCar({ car, deleteCar, modifyCar }) {
    const [loading, setLoading] = useState(true);
    const [selectedCarId, setSelectedCarId] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
    const navigate = useNavigate();

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = (date.getUTCFullYear()).toString().padStart(2, '0');

        return `${day}.${month}.${year}`;
    }

    const handleDelete = () => {
        deleteCar(selectedCarId);
        setIsDeleteModalOpen(false);
        navigate("/masini");
    }

    const handleModify = () => {
        setIsModifyModalOpen(true);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

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
                <div className="flex flex-col">
                    {isDeleteModalOpen && (
                        <Modal
                            title="Dorești să ștergi autovehiculul?"
                            onConfirm={handleDelete}
                            onCancel={() => setIsDeleteModalOpen(false)}
                        />
                    )}
                    {isModifyModalOpen && (
                        <ModifyModal
                            car={car}
                            modifyCar={modifyCar}
                        />
                    )}
                    <div className="flex flex-col bg-gray-200 text-x space-y-4 p-6 text-center rounded-2xl w-auto">
                        <div className="flex flex-col text-xl space-y-4 p-6 text-center rounded-2xl w-auto">
                            <h1><span className="font-bold">Serie șasiu: </span>{car?.carVin}</h1>
                            <p><span className="font-bold">Proprietar:</span> {car?.owner}</p>
                            <p><span className="font-bold">Număr înmatriculare:</span> {car?.plateNumber}</p>
                            <p><span className="font-bold">Dată expirare ITP:</span> {formatTimestamp(car?.checkUpExpirationDate)}</p>
                            <p><span className="font-bold">Dată expirare Rovinietă:</span> {formatTimestamp(car?.vignetteExpirationDate)}</p>
                            <div className="space-x-2 flex justify-center">
                                <Button variant="gray" onClick={() => navigate("/masini")}><ArrowCircleLeftIcon className="h-7 w-7" /></Button>
                                <Button variant="blue" onClick={handleModify}><PencilIcon className="h-7 w-7" /></Button>
                                <Button variant="red" onClick={() => {
                                    setSelectedCarId(car?._id)
                                    setIsDeleteModalOpen(true);
                                }}><TrashIcon className="h-7 w-7" /></Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SingleCar;
