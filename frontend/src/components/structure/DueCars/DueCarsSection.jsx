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
            return "7 zile";
        } else if (selectedDuration === '2weeks') {
            return "14 zile";
        } else if (selectedDuration === 'month') {
            return "30 zile";
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
                <div className="p-4 overflow-hidden">
                    <div className="bg-gray-100 shadow-md rounded-lg p-2 md:mx-auto md:w-1/3 md:mb-4 md:p-2">
                        <h2 className="font-bold text-center text-xl mb-2 md:text-2xl">Alegeți tipul verificării și perioada:</h2>
                        <div className="flex justify-center space-x-2">
                            <div className="mb-2">
                                <select
                                    id="typeSelect"
                                    name="typeSelect"
                                    value={selectedType}
                                    onChange={handleTypeChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-sm"
                                >
                                    <option value="" className="text-gray-400 max-sm:text-xs">Alegeți tipul</option>
                                    <option value="checkup" className="max-sm:text-xs">ITP</option>
                                    <option value="vignette" className="max-sm:text-xs">Rovinietă</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <select
                                    id="durationSelect"
                                    name="durationSelect"
                                    value={selectedDuration}
                                    onChange={handleDurationChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-sm"
                                >
                                    <option value="" className="text-gray-400 max-sm:text-xs">Alegeți perioada</option>
                                    <option value="expired" className="max-sm:text-xs">Expirate</option>
                                    <option value="today" className="max-sm:text-xs">Astăzi</option>
                                    <option value="1week" className="max-sm:text-xs">7 zile</option>
                                    <option value="2weeks" className="max-sm:text-xs">14 zile</option>
                                    <option value="month" className="max-sm:text-xs">30 zile</option>
                                </select>
                            </div>
                            <Button size="tiny" className="mb-0.5 text-blue-600" onClick={refreshData}><RefreshIcon className="h-5 w-5" /></Button>
                        </div>
                    </div>
                    {
                        loading ? (
                            <div className="flex items-center justify-center h-[60vh] md:h-[40vh]">
                                <Spinner />
                            </div>
                        ) : (
                            <>
                                {
                                    dueCars.length >= 1 ? (
                                        <div className="rounded-lg">
                                            {selectedDuration && selectedType && selectedDuration !== 'expired' &&
                                                <h2 className="duration-300 text-lg md:text-xl font-semibold my-2 md:my-4 text-center"><span className="text-red-600 font-bold">{renderTypeText()}</span> următoarelor <span className="text-red-600 font-bold">{dueCars.length}</span> mașini expiră <span className="text-red-600 font-bold">{renderDurationText()}!</span>
                                                </h2> || <h2 className="text-xl font-semibold my-2 md:my-4 text-center">
                                                    Următoarele <span className="text-red-600 font-bold">{dueCars.length}</span> mașini au <span className="text-red-600 font-bold">{renderTypeText()}</span> {renderTypeText() === 'ITP-ul' ? <span>expirat</span> : <span>expirată</span>}!
                                                </h2>
                                            }
                                            <div className="table-wrapper overflow-y-auto h-[calc(100vh-280px)] md:h-86">
                                                <table className="min-w-full divide-y md:border-2 md:divide-blue-200 md:table text-center block">
                                                    <thead className="bg-blue-500 sticky top-0 hidden md:table-header-group">
                                                        <tr className="md:table-row hidden">
                                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">Serie șasiu</th>
                                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">Proprietar</th>
                                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">Număr Înmatriculare</th>
                                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">Dată expirare</th>
                                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">Ultima Notificare</th>
                                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">Acțiuni</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white md:divide-y md:divide-gray-200 block md:table-row-group">
                                                        {dueCars.map((car, index) => (
                                                            <tr key={index} className="p-1 block border-b border-gray-300 md:table-row md:mb-0">
                                                                <td className="p-1 whitespace-nowrap flex justify-center md:table-cell">
                                                                    <span className="block font-bold max-sm:mr-1 md:hidden">Serie șasiu:</span>
                                                                    {car.carVin}
                                                                </td>
                                                                <td className="p-1 whitespace-nowrap flex justify-center md:table-cell">
                                                                    <span className="block font-bold max-sm:mr-1 md:hidden">Proprietar:</span>
                                                                    {car.owner}
                                                                </td>
                                                                <td className="p-1 whitespace-nowrap flex justify-center md:table-cell">
                                                                    <span className="block font-bold max-sm:mr-1 md:hidden">Număr Înmatriculare:</span>
                                                                    {formatLicensePlate(car.plateNumber).toUpperCase()}
                                                                </td>
                                                                <td className="p-1 whitespace-nowrap flex justify-center md:table-cell">
                                                                    <span className="block font-bold max-sm:mr-1 md:hidden">Dată expirare:</span>
                                                                    {renderTypeText() === 'Rovinieta' ? (
                                                                        car.vignetteExpirationDate !== null ? formatTimeStamp(car.vignetteExpirationDate) : '-'
                                                                    ) : (
                                                                        car.checkUpExpirationDate !== null ? formatTimeStamp(car.checkUpExpirationDate) : '-'
                                                                    )}
                                                                    <span className="text-gray-400 ml-1">
                                                                        {renderTypeText() === 'Rovinieta' ? (
                                                                            car.vignetteExpirationDate !== null ? ` (${countRemainingDays(car.vignetteExpirationDate)} zile)` : ''
                                                                        ) : (
                                                                            car.checkUpExpirationDate !== null ? ` (${countRemainingDays(car.checkUpExpirationDate)} zile)` : ''
                                                                        )}
                                                                    </span>
                                                                </td>
                                                                <td className="p-1 whitespace-nowrap flex justify-center md:table-cell">
                                                                    <span className="block font-bold max-sm:mr-1 md:hidden">Ultima Notificare:</span>
                                                                    {car.lastNotificationDate === null ? '-' : (
                                                                        <span className="text-green-500 font-bold">{formatTimeStamp(car.lastNotificationDate)}</span>
                                                                    )}
                                                                </td>
                                                                <td className="p-2 whitespace-nowrap flex justify-center md:table-cell space-x-2">
                                                                    <Button
                                                                        variant="blue"
                                                                        className="tiny"
                                                                        onClick={() => window.open(`/cars/${car._id}`, '_blank')}
                                                                    >
                                                                        <DotsHorizontalIcon className="h-5 w-5" />
                                                                    </Button>
                                                                    {selectedDuration !== 'expired' && (
                                                                        <Button
                                                                            variant={!disableButton(car.lastNotificationDate) ? "blue" : "green"}
                                                                            className="tiny"
                                                                            onClick={() => {
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
                                                                                            : countRemainingDays(car.checkUpExpirationDate),
                                                                                    )
                                                                                }
                                                                            }}
                                                                            disabled={disableButton(car.lastNotificationDate)}
                                                                            title={disableButton(car.lastNotificationDate) ? 'Notificare deja trimisă!' : 'Trimiteți notificare!'}
                                                                        >
                                                                            <ChatIcon className="h-5 w-5" />
                                                                        </Button>
                                                                    )}
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
                                                <div className="flex text-center justify-center text-lg text-red-500 font-bold max-sm:p-2">
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
                </div >
            </>
        )
    );
}

export default DueCarsSection;