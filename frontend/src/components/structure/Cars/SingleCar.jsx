import React, { useEffect, useState } from 'react';
import Button from "../../elements/Button";
import Spinner from "../../elements/Spinner";
import { useNavigate } from "react-router-dom";
import Modal from "../../elements/Modal";
import { TrashIcon, PencilIcon, ArrowCircleLeftIcon, RefreshIcon } from '@heroicons/react/outline';
import ModifyModal from '../../elements/ModifyModal';
import { formatTimeStamp, isExpired, countRemainingDays } from "../../../utils/utils";

function SingleCar({ car, deleteCar, modifyCar, vignetteRecheck, vgnCheckError, updatedCarMessage }) {
    const [loading, setLoading] = useState(true);
    const [selectedCarId, setSelectedCarId] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleDelete = () => {
        deleteCar(selectedCarId);
        setIsDeleteModalOpen(false);
        navigate("/cars");
    }

    const handleModify = () => {
        setIsModifyModalOpen(true);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex w-auto justify-center m-6 md:m-6 h-96">
            {loading && (
                <div role="status" className="flex items-center justify-center h-[calc(100vh-200px)] md:h-[70vh]">
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
                    <div className="bg-gray-200 rounded-2xl text-center md:p-6">
                        <div className="flex flex-col sm:text-sm p-6 md:text-lg lg:text-xl p-6">
                            <div className="space-y-4">
                                <p><span className="font-bold">Serie șasiu: </span>{car?.carVin}</p>
                                <p><span className="font-bold">Serie C.I.V: </span>{car?.carCiv || '-'}</p>
                                <p><span className="font-bold">Proprietar:</span> {car?.owner}</p>
                                <p><span className="font-bold">Număr de telefon:</span> {car?.ownerPhoneNumber || '-'}</p>
                                <p><span className="font-bold">Număr înmatriculare:</span> {car?.plateNumber?.toUpperCase()}</p>
                                <p><span className="font-bold">Expirare RCA:</span><span className={isExpired(car?.insuranceExpirationDate) ? 'text-red-500 font-bold' : ''}> {car?.insuranceExpirationDate === null ? '-' : formatTimeStamp(car?.insuranceExpirationDate)}</span>{car?.insuranceExpirationDate && (<span className="text-gray-400"> ({countRemainingDays(car?.insuranceExpirationDate)} zile)</span>)}</p>
                                <p><span className="font-bold">Expirare ITP:</span><span className={isExpired(car?.checkUpExpirationDate) ? 'text-red-500 font-bold' : ''}> {car?.checkUpExpirationDate === null ? '-' : formatTimeStamp(car?.checkUpExpirationDate)}</span>{car?.checkUpExpirationDate && (<span className="text-gray-400"> ({countRemainingDays(car?.checkUpExpirationDate)} zile)</span>)}</p>
                                <p><span className="font-bold">Expirare Rovinietă:</span><span className={isExpired(car?.vignetteExpirationDate) ? 'text-red-500' : ''}> {car?.vignetteExpirationDate === null ? '-' : formatTimeStamp(car?.vignetteExpirationDate)}</span>{car?.vignetteExpirationDate && (<span className="text-gray-400"> ({countRemainingDays(car?.vignetteExpirationDate)} zile)</span>)}</p>
                                <p><span className="font-bold">Ultima notificare trimisă: </span> {car.lastNotificationDate === null ? '-' : formatTimeStamp(car.lastNotificationDate)}</p>
                                <div>
                                    {!updatedCarMessage && vgnCheckError === 'Eroare la verificarea rovinietei! Nu există sau datele sunt incorecte!'
                                        ? <p className="text-red-500 mb-4 text-md md:text-lg font-bold text-center animate-shake">{vgnCheckError}</p>
                                        : <p className="text-green-500 mb-4 text-md md:text-lg font-bold text-center">{vgnCheckError}</p>}
                                    {!vgnCheckError && updatedCarMessage && <p className="text-green-500 text-lg font-bold text-center">{updatedCarMessage}</p>}
                                </div>
                            </div>
                            <div className="space-x-2 flex justify-center">
                                <Button variant="gray" onClick={() => navigate("/cars")}><ArrowCircleLeftIcon className="h-7 w-7" /></Button>
                                <Button variant="blue" onClick={handleModify}><PencilIcon className="h-7 w-7" /></Button>
                                <Button variant="red" onClick={() => {
                                    setSelectedCarId(car?._id)
                                    setIsDeleteModalOpen(true);
                                }}><TrashIcon className="h-7 w-7" /></Button>
                                <Button variant="green" onClick={vignetteRecheck}><RefreshIcon className="h-7 w-7" /></Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SingleCar;
