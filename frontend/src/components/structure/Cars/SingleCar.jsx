import React, { useState, useEffect } from 'react';
import Button from "../../elements/Button";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Modal from "../../elements/Modal";
import { TrashIcon, PencilIcon, ArrowCircleLeftIcon, RefreshIcon } from '@heroicons/react/outline';
import ModifyModal from '../../elements/ModifyModal';
import PopupMessage from '../../elements/PopupMessage';
import { formatTimeStamp, isExpired, countRemainingDays } from "../../../utils/utils";

function SingleCar({ car, deleteCar, modifyCar, vignetteRecheck, vgnCheckError, updatedCarMessage }) {
    const [selectedCarId, setSelectedCarId] = useState('');
    const { carId } = useParams();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
    const [previousUrl, setPreviousUrl] = useState();
    const navigate = useNavigate();
    const location = useLocation();

    const notifications = car.notifications || [];

    const getNotificationByType = (type) => {
        const notification = notifications.find(notification => notification.type === type);
        return notification ? notification.sentDate : null;
    };

    const checkupNotification = getNotificationByType('checkup');
    const insuranceNotification = getNotificationByType('insurance');
    const vignetteNotification = getNotificationByType('vignette');

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
        if (location.state?.from) {
            setPreviousUrl(location.state.from);
        }
    }, [location.state]);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-85.6px)] min-w-screen">
            <div className="flex flex-col w-full h-full max-w-6xl mx-auto">
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
                <div className="flex flex-col h-full bg-white shadow-md border-2 border-gray-100 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 flex-1">
                        {/* Left Column */}
                        <div className="col-span-1 p-2 text-center max-md:border border-gray-200 rounded-md">
                            <h2 className="text-xl font-bold mb-4 xl:text-2xl">DATE AUTOVEHICUL</h2>
                            <div className="space-y-3 text-lg xl:text-xl">
                                <p><span className="font-bold">Serie șasiu: </span>{car?.carVin}</p>
                                <p><span className="font-bold">Serie C.I.V: </span>{car?.carCiv || '-'}</p>
                                <p><span className="font-bold">Proprietar:</span> {car?.owner}</p>
                                <p><span className="font-bold">Număr de telefon:</span> {car?.ownerPhoneNumber || '-'}</p>
                                <p><span className="font-bold">Număr înmatriculare:</span> {car?.plateNumber?.toUpperCase()}</p>
                            </div>
                        </div>
                        {/* Middle Column */}
                        <div className="col-span-1 p-2 text-center max-md:border border-gray-200 rounded-md">
                            <h2 className="text-xl font-bold mb-4 xl:text-2xl">EXPIRĂRI</h2>
                            <div className="space-y-3 text-lg xl:text-xl">
                                <p><span className="font-bold">ITP:</span><span className={isExpired(car?.checkUpExpirationDate) ? 'text-red-500 font-bold' : ''}> {car?.checkUpExpirationDate === null ? '-' : formatTimeStamp(car?.checkUpExpirationDate)}</span>{car?.checkUpExpirationDate && (<span className="text-gray-400"> ({countRemainingDays(car?.checkUpExpirationDate)} zile)</span>)}</p>
                                <p><span className="font-bold">RCA:</span><span className={isExpired(car?.insuranceExpirationDate) ? 'text-red-500 font-bold' : ''}> {car?.insuranceExpirationDate === null ? '-' : formatTimeStamp(car?.insuranceExpirationDate)}</span>{car?.insuranceExpirationDate && (<span className="text-gray-400"> ({countRemainingDays(car?.insuranceExpirationDate)} zile)</span>)}</p>
                                {car?.vignetteRequired &&
                                    <p><span className="font-bold">ROVINIETĂ:</span><span className={isExpired(car?.vignetteExpirationDate) ? 'text-red-500' : ''}> {car?.vignetteExpirationDate === null ? '-' : formatTimeStamp(car?.vignetteExpirationDate)}</span>{car?.vignetteExpirationDate && (<span className="text-gray-400"> ({countRemainingDays(car?.vignetteExpirationDate)} zile)</span>)}</p>
                                }
                            </div>
                        </div>
                        {/* Right Column */}
                        <div className="col-span-1 p-2 text-center max-md:border border-gray-200 rounded-md">
                            <h2 className="text-xl font-bold mb-4 xl:text-2xl">NOTIFICĂRI</h2>
                            <div className="space-y-3 text-lg xl:text-xl">
                                <p><span className="font-bold">ITP: </span>{checkupNotification === null ? '-' : formatTimeStamp(checkupNotification)}</p>
                                <p><span className="font-bold">RCA: </span>{insuranceNotification === null ? '-' : formatTimeStamp(insuranceNotification)}</p>
                                <p><span className="font-bold">ROVINIETĂ: </span>{vignetteNotification === null ? '-' : formatTimeStamp(vignetteNotification)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center p-4 space-x-2 border-t border-gray-200">
                        <Button variant="gray" onClick={() => navigate(previousUrl)}><ArrowCircleLeftIcon className="h-7 w-7" /></Button>
                        <Button variant="blue" onClick={handleModify}><PencilIcon className="h-7 w-7" /></Button>
                        <Button variant="red" onClick={() => {
                            setSelectedCarId(car?._id)
                            setIsDeleteModalOpen(true)
                        }}><TrashIcon className="h-7 w-7" /></Button>
                        <Button variant="green" onClick={vignetteRecheck}><RefreshIcon className="h-7 w-7" /></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleCar;
