import React, { useEffect, useState } from 'react';
import Button from "../../elements/Button";
import Spinner from "../../elements/Spinner";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Modal from "../../elements/Modal";
import PopupMessage from '../../elements/PopupMessage';
import { TrashIcon, PencilIcon, ArrowCircleLeftIcon, RefreshIcon } from '@heroicons/react/outline';
import ModifyModal from '../../elements/ModifyModal';
import { formatTimeStamp, isExpired, countRemainingDays } from "../../../utils/utils";

function SingleCar({ car, deleteCar, modifyCar, vignetteRecheck, vgnCheckError, updatedCarMessage }) {
    const [loading, setLoading] = useState(true);
    const [selectedCarId, setSelectedCarId] = useState('');
    const { carId } = useParams();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
    const [previousUrl, setPreviousUrl] = useState();
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get('page') || 1;

    const handleDelete = () => {
        deleteCar(selectedCarId);
        setIsDeleteModalOpen(false);
        navigate(previousUrl);
    }

    const handleModify = () => {
        setSelectedCarId(car._id);
        setIsModifyModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModifyModalOpen(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        if (location.state?.from) {
            setPreviousUrl(location.state.from);
        }

        return () => clearTimeout(timer);
    }, [location.state]);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-85.6px)]">
            {loading && (
                <div role="status" className="flex items-center justify-center h-[calc(100vh-200px)] md:h-[70vh]">
                    <Spinner />
                </div>
            )}
            {!loading && (
                <div className="flex flex-col">
                    {isDeleteModalOpen && (
                        <Modal
                            title={
                                <>
                                    Dorești să ștergi autovehiculul <span className="text-blue-600 font-bold">{car?.plateNumber?.toUpperCase()}</span>?
                                </>
                            }
                            onConfirm={handleDelete}
                            onCancel={() => setIsDeleteModalOpen(false)}
                        />
                    )}
                    {isModifyModalOpen && (
                        <ModifyModal
                            car={car}
                            carId={carId}
                            modifyCar={modifyCar}
                            onClose={handleCloseModal}
                        />
                    )}
                    <PopupMessage
                        message={vgnCheckError || updatedCarMessage}
                        type={vgnCheckError}
                    />
                    <div className="bg-gray-100 bg-opacity-30 backdrop-blur-2xl rounded-2xl text-center shadow-md border-2 border-gray-100 md:p-2">
                        <div className="flex flex-col p-6 space-y-4 sm:text-sm p-4 md:text-lg lg:text-xl mx-4">
                            <div className="space-y-3">
                                <p><span className="font-bold">Serie șasiu: </span>{car?.carVin}</p>
                                <p><span className="font-bold">Serie C.I.V: </span>{car?.carCiv || '-'}</p>
                                <p><span className="font-bold">Proprietar:</span> {car?.owner}</p>
                                <p><span className="font-bold">Număr de telefon:</span> {car?.ownerPhoneNumber || '-'}</p>
                                <p><span className="font-bold">Număr înmatriculare:</span> {car?.plateNumber?.toUpperCase()}</p>
                                <p><span className="font-bold">ITP:</span><span className={isExpired(car?.checkUpExpirationDate) ? 'text-red-500 font-bold' : ''}> {car?.checkUpExpirationDate === null ? '-' : formatTimeStamp(car?.checkUpExpirationDate)}</span>{car?.checkUpExpirationDate && (<span className="text-gray-400"> ({countRemainingDays(car?.checkUpExpirationDate)} zile)</span>)}</p>
                                <p><span className="font-bold">RCA:</span><span className={isExpired(car?.insuranceExpirationDate) ? 'text-red-500 font-bold' : ''}> {car?.insuranceExpirationDate === null ? '-' : formatTimeStamp(car?.insuranceExpirationDate)}</span>{car?.insuranceExpirationDate && (<span className="text-gray-400"> ({countRemainingDays(car?.insuranceExpirationDate)} zile)</span>)}</p>
                                {car?.vignetteRequired &&
                                    <p><span className="font-bold">Rovinietă:</span><span className={isExpired(car?.vignetteExpirationDate) ? 'text-red-500' : ''}> {car?.vignetteExpirationDate === null ? '-' : formatTimeStamp(car?.vignetteExpirationDate)}</span>{car?.vignetteExpirationDate && (<span className="text-gray-400"> ({countRemainingDays(car?.vignetteExpirationDate)} zile)</span>)}</p>
                                }
                                <p><span className="font-bold">Ultima notificare trimisă: </span> {car.lastNotificationDate === null ? '-' : formatTimeStamp(car.lastNotificationDate)}</p>
                            </div>
                            <div className="space-x-2 flex justify-center">
                                <Button variant="gray" onClick={() => navigate(previousUrl)}><ArrowCircleLeftIcon className="h-7 w-7" /></Button>
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
