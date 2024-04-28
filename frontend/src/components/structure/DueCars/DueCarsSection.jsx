import React, { useState, useEffect } from "react";
import Spinner from "../../elements/Spinner";
import Button from "../../elements/Button";
import { useAuth } from "../../../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";
import { DotsHorizontalIcon } from '@heroicons/react/outline';

function DueCarsSection({ dueCars, fetchCarsData }) {
    const [selectedType, setSelectedType] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("");
    const [loading, setLoading] = useState();
    const { auth } = useAuth();
    const navigate = useNavigate();

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };

    const handleDurationChange = (e) => {
        setSelectedDuration(e.target.value);
    };

    const renderDurationText = () => {
        if (selectedDuration === '1week') {
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

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = (date.getUTCFullYear()).toString().padStart(2, '0');

        return `${day}.${month}.${year}`;
    }

    function countRemainingDays(expirationDate) {
        const expiration = new Date(expirationDate);
        const today = new Date();

        const differenceMs = expiration - today;

        const daysRemaining = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

        return daysRemaining;
    }

    function formatLicensePlate(plateNumber) {
        if (!plateNumber) return '';

        plateNumber = plateNumber.replace(/\s/g, '');

        return plateNumber.replace(/([A-Z]+)([0-9]+)/g, '$1 $2 ');
    }

    const sortDueCars = () => {
        if (selectedType === "checkup") {
            dueCars.sort((a, b) => new Date(a.checkUpExpirationDate) - new Date(b.checkUpExpirationDate));
            console.log(selectedType === "checkup");
        } else if (selectedType === "vignette") {
            dueCars.sort((a, b) => new Date(a.vignetteExpirationDate) - new Date(b.vignetteExpirationDate));
            console.log(selectedType === "vignette");
        } else {
            return dueCars;
        }
    };

    useEffect(() => {
        if (selectedType && selectedDuration) {
            fetchCarsData(selectedDuration, selectedType);
            setLoading(true);
        }
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [selectedType, selectedDuration]);

    useEffect(() => {
        sortDueCars();
    }, [dueCars]);

    return (
        (auth &&
            <>
                <div className="container mx-auto p-4 overflow-hidden">
                    <h1 className="text-3xl font-bold mb-2 text-center">Bază de date ITP / Rovinietă</h1>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6 w-1/2 mx-auto">
                        <h2 className="text-xl font-semibold mb-4 text-center">Alegeți tipul verificării și perioada:</h2>
                        <div className="flex justify-center space-x-2">
                            <div className="mb-2">
                                <label htmlFor="typeSelect" className="block text-sm font-medium text-gray-700">
                                    Tipul verificării:
                                </label>
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
                                <label htmlFor="durationSelect" className="block text-sm font-medium text-gray-700">
                                    Perioadă:
                                </label>
                                <select
                                    id="durationSelect"
                                    name="durationSelect"
                                    value={selectedDuration}
                                    onChange={handleDurationChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="" className="text-gray-400">Alegeți perioada</option>
                                    <option value="1week">7 zile</option>
                                    <option value="2weeks">14 zile</option>
                                    <option value="month">30 zile</option>
                                </select>
                            </div>
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
                                        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                                            {selectedDuration && selectedType &&
                                                <h2 className="text-xl font-semibold mb-4 text-center">
                                                    <span className="text-red-600 font-bold">{renderTypeText()}</span> următoarelor <span className="text-red-600 font-bold">{dueCars.length}</span> mașini expiră în <span className="text-red-600 font-bold">{renderDurationText()}</span>
                                                </h2>
                                            }
                                            <div className="table-wrapper overflow-y-auto max-h-70 border-2">
                                                <table className="min-w-full divide-y divide-blue-200 text-center">
                                                    <thead className="bg-blue-500 sticky top-0">
                                                        <tr>
                                                            <th className="py-3 text-sm text-gray-800 uppercase text-center">Serie șasiu</th>
                                                            <th className="py-3 text-sm text-gray-800 uppercase text-center">Proprietar</th>
                                                            <th className="py-3 text-sm text-gray-800 uppercase text-center">Număr Înmatriculare</th>
                                                            <th className="py-3 text-sm text-gray-800 uppercase text-center">Dată expirare</th>
                                                            <th className="py-3 text-sm text-gray-800 uppercase text-center">Acțiuni</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {dueCars.map((car, index) => (
                                                            <tr key={index}>
                                                                <td className="py-2 whitespace-nowrap">{car.carVin}</td>
                                                                <td className="py-2 whitespace-nowrap">{car.owner}</td>
                                                                <td className="py-2 whitespace-nowrap">{formatLicensePlate(car.plateNumber)}</td>
                                                                <td className="py-2 whitespace-nowrap">
                                                                    {renderTypeText() === 'Rovinieta' ? formatTimestamp(car.vignetteExpirationDate) : formatTimestamp(car.checkUpExpirationDate)}
                                                                    <span className="text-gray-400"> ({renderTypeText() === 'Rovinieta' ? countRemainingDays(car.vignetteExpirationDate) : countRemainingDays(car.checkUpExpirationDate)} zile)</span>
                                                                </td>
                                                                <td className="py-2 whitespace-nowrap">
                                                                    <Button variant="blue" className="tiny" onClick={() => navigate(`/cars/${car._id}`)}>
                                                                        <DotsHorizontalIcon className="h-4 w-4" />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {selectedDuration && selectedType && (
                                                <div className="flex text-center justify-center text-lg text-red-500 font-bold">
                                                    <h1>În următoarele {renderDurationText()} nu expiră {renderTypeText() === 'ITP-ul' ? "niciun ITP!" : "nicio Rovinietă!"}</h1>
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