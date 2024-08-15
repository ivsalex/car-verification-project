import React, { useState, useEffect } from "react";
import Spinner from "../../elements/Spinner";
import Button from "../../elements/Button";
import { useUser } from '@clerk/clerk-react';
import { DotsHorizontalIcon, ChatIcon, RefreshIcon } from '@heroicons/react/outline';
import { formatTimeStamp, countRemainingDays, formatLicensePlate } from "../../../utils/utils";

function DueCarsSection({ dueCars, fetchCarsData, sendSms }) {
    const [selectedType, setSelectedType] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("");
    const [loading, setLoading] = useState();
    const [showError, setShowError] = useState(false);
    const { user } = useUser();

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };

    const handleDurationChange = (e) => {
        setSelectedDuration(e.target.value);
    };

    const renderDurationText = () => {
        if (selectedDuration === 'today') {
            return "Astăzi";
        } else if (selectedDuration === '1week') {
            return "în 7 zile";
        } else if (selectedDuration === '2weeks') {
            return "în 14 zile";
        } else if (selectedDuration === 'month') {
            return "în 30 zile";
        } else {
            return "";
        }
    };

    const renderTypeText = () => {
        if (selectedType === 'checkup') {
            return "ITP-ul";
        } else if (selectedType === 'vignette') {
            return "Rovinieta";
        } else {
            return "";
        }
    };

    function disableButton(lastNotificationDate) {
        const now = new Date();
        const todayDate = now.toLocaleDateString();

        const notif = new Date(lastNotificationDate);
        const notifDate = notif.toLocaleDateString();

        if (notifDate === todayDate) {
            return true;
        }
    }

    const sortDueCars = () => {
        if (selectedType === "checkup") {
            dueCars.sort((a, b) => new Date(a.checkUpExpirationDate) - new Date(b.checkUpExpirationDate));
        } else if (selectedType === "vignette") {
            dueCars.sort((a, b) => new Date(a.vignetteExpirationDate) - new Date(b.vignetteExpirationDate));
        } else {
            return dueCars;
        }
    };

    const refreshData = () => {
        if (selectedType && selectedDuration) {
            fetchCarsData(selectedDuration, selectedType);
            setLoading(true);
            setShowError(true);
        }
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }

    useEffect(() => {
        if (selectedType && selectedDuration) {
            fetchCarsData(selectedDuration, selectedType);
            setLoading(true);
            setShowError(true);
        }
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, [selectedType, selectedDuration]);

    useEffect(() => {
        sortDueCars();
    }, [dueCars]);

    return (
        (user &&
            <>
                <div className="container mx-auto p-4 overflow-hidden">
                    <div className="bg-gray-100 p-2 rounded-lg shadow-md mb-4 w-1/3 mx-auto">
                        <h2 className="text-2xl font-bold mb-2 text-center">Alegeți tipul verificării și perioada:</h2>
                        <div className="flex justify-center space-x-2">
                            <div className="mb-2">
                                <select
                                    id="typeSelect"
                                    name="typeSelect"
                                    value={selectedType}
                                    onChange={handleTypeChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="" className="text-gray-400">Alegeți tipul</option>
                                    <option value="checkup">ITP</option>
                                    <option value="vignette">Rovinietă</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <select
                                    id="durationSelect"
                                    name="durationSelect"
                                    value={selectedDuration}
                                    onChange={handleDurationChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="" className="text-gray-400">Alegeți perioada</option>
                                    <option value="expired">Expirate</option>
                                    <option value="today">Astăzi</option>
                                    <option value="1week">7 zile</option>
                                    <option value="2weeks">14 zile</option>
                                    <option value="month">30 zile</option>
                                </select>
                            </div>
                            <Button size="tiny" className="mb-0.5 text-blue-600" onClick={refreshData}><RefreshIcon className="h-5 w-5" /></Button>
                        </div>
                    </div>
                    {
                        loading ? (
                            <div className="flex items-center justify-center">
                                <Spinner />
                            </div>
                        ) : (
                            <>
                                {
                                    dueCars.length >= 1 ? (
                                        <div className="rounded-lg">
                                            {selectedDuration && selectedType && selectedDuration !== 'expired' &&
                                                <h2 className="text-xl font-semibold my-4 text-center"><span className="text-red-600 font-bold">{renderTypeText()}</span> următoarelor <span className="text-red-600 font-bold">{dueCars.length}</span> mașini expiră <span className="text-red-600 font-bold">{renderDurationText()}!</span>
                                                </h2> || <h2 className="text-xl font-semibold my-4 text-center">
                                                    Următoarele <span className="text-red-600 font-bold">{dueCars.length}</span> mașini au <span className="text-red-600 font-bold">{renderTypeText()}</span> {renderTypeText() === 'ITP-ul' ? <span>expirat</span> : <span>expirată</span>}!

                                                </h2>
                                            }
                                            <div className="table-wrapper overflow-y-auto max-h-70 overflow-y-auto h-86">
                                                <table className="min-w-full divide-y border-2 divide-blue-200 text-center">
                                                    <thead className="bg-blue-500 sticky top-0">
                                                        <tr>
                                                            <th className="py-3 text-sm text-gray-800 uppercase text-center">Serie șasiu</th>
                                                            <th className="py-3 text-sm text-gray-800 uppercase text-center">Proprietar</th>
                                                            <th className="py-3 text-sm text-gray-800 uppercase text-center">Număr Înmatriculare</th>
                                                            <th className="py-3 text-sm text-gray-800 uppercase text-center">Dată expirare</th>
                                                            <th className="py-3 text-sm text-gray-800 uppercase text-center">Ultima Notificare</th>
                                                            <th className="py-3 text-sm text-gray-800 uppercase text-center">Acțiuni</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {dueCars.map((car, index) => (
                                                            <tr key={index}>
                                                                <td className="py-2 whitespace-nowrap">{car.carVin}</td>
                                                                <td className="py-2 whitespace-nowrap">{car.owner}</td>
                                                                <td className="py-2 whitespace-nowrap">{formatLicensePlate(car.plateNumber).toUpperCase()}</td>
                                                                <td className="py-2 whitespace-nowrap">
                                                                    {renderTypeText() === 'Rovinieta' ?
                                                                        (car.vignetteExpirationDate !== null ? formatTimeStamp(car.vignetteExpirationDate) : '-') :
                                                                        (car.checkUpExpirationDate !== null ? formatTimeStamp(car.checkUpExpirationDate) : '-')
                                                                    }
                                                                    <span className="text-gray-400">
                                                                        {renderTypeText() === 'Rovinieta' ?
                                                                            (car.vignetteExpirationDate !== null ? ` (${countRemainingDays(car.vignetteExpirationDate)} zile)` : '') :
                                                                            (car.checkUpExpirationDate !== null ? ` (${countRemainingDays(car.checkUpExpirationDate)} zile)` : '')
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td className="py-2 whitespace-nowrap">{car.lastNotificationDate === null ? '-' : <span className="text-green-500 font-bold">{formatTimeStamp(car.lastNotificationDate)}</span>}</td>
                                                                <td className="py-2 whitespace-nowrap space-x-1">
                                                                    <Button
                                                                        variant="blue"
                                                                        className="tiny"
                                                                        onClick={() => window.open(`/cars/${car._id}`, '_blank')}
                                                                    >
                                                                        <DotsHorizontalIcon className="h-4 w-4" />
                                                                    </Button>
                                                                    {selectedDuration !== 'expired' &&
                                                                        <Button variant={!disableButton(car.lastNotificationDate) ? "blue" : "green"} className="tiny" onClick={
                                                                            () => {
                                                                                if (!disableButton(car.lastNotificationDate)) {
                                                                                    sendSms(
                                                                                        car._id,
                                                                                        car.ownerPhoneNumber,
                                                                                        car.plateNumber,
                                                                                        renderTypeText(),
                                                                                        renderTypeText() === 'Rovinieta'
                                                                                            ? formatTimeStamp(car.vignetteExpirationDate)
                                                                                            : formatTimeStamp(car.checkUpExpirationDate),
                                                                                        renderTypeText() === 'Rovinieta'
                                                                                            ? countRemainingDays(car.vignetteExpirationDate)
                                                                                            : countRemainingDays(car.checkUpExpirationDate),)
                                                                                }
                                                                            }
                                                                        }
                                                                            disabled={disableButton(car.lastNotificationDate)}
                                                                            title={disableButton(car.lastNotificationDate) ? 'Notificare deja trimisă!' : 'Trimiteți notificare!'}
                                                                        >
                                                                            <ChatIcon className="h-4 w-4" />
                                                                        </Button>
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {showError && selectedDuration && selectedType && (
                                                <div className="flex text-center justify-center text-lg text-red-500 font-bold">
                                                    <h1>
                                                        {selectedDuration === 'expired' ? (
                                                            renderTypeText() === 'ITP-ul' ? "Niciun ITP expirat!" : "Nicio Rovinietă expirată!"
                                                        ) : (
                                                            <>
                                                                {selectedDuration === 'today' ? '' : 'În următoarele '}
                                                                {renderDurationText()} nu expiră {renderTypeText() === 'ITP-ul' ? "niciun ITP!" : "nicio Rovinietă!"}
                                                            </>
                                                        )}
                                                    </h1>
                                                </div>
                                            )}
                                        </>
                                    )
                                }
                            </>
                        )
                    }
                </div>
            </>
        )
    );
}

export default DueCarsSection;