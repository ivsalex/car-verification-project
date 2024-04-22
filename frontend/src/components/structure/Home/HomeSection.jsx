import React, { useState, useEffect } from "react";
import Spinner from "../../elements/Spinner";

function HomeSection({ dueCars, fetchCarsData }) {
    const [selectedType, setSelectedType] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("");
    const [loading, setLoading] = useState();

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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 text-center">Bază de date ITP / Rovinietă</h1>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6 w-1/2 mx-auto">
                <h2 className="text-xl font-bold mb-4">Alegeți tipul verificării și perioada:</h2>
                <div className="mb-4">
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

                <div className="mb-4">
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
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                {selectedDuration && selectedType &&
                    <h2 className="text-xl font-semibold mb-4 text-center"><span className="text-red-600 font-bold">{renderTypeText()}</span> următoarelor mașini expiră în <span className="text-red-600 font-bold">{renderDurationText()}</span></h2>
                }
                {loading && (
                    <div role="status">
                        <Spinner />
                    </div>
                )}
                {!loading && (
                    <>
                        <table className="min-w-full divide-y divide-gray-200 text-center">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-sm text-gray-500 uppercase text-center">Serie șasiu</th>
                                    <th className="px-6 py-3 text-sm text-gray-500 uppercase text-center">Proprietar</th>
                                    <th className="px-6 py-3 text-sm text-gray-500 uppercase text-center">Număr Înmatriculare</th>
                                    <th className="px-6 py-3 text-sm text-gray-500 uppercase text-center">Dată expirare</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dueCars?.map((car, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{car.carVin}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{car.owner}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{car.plateNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{formatTimestamp(car.checkUpExpirationDate)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
}

export default HomeSection;
