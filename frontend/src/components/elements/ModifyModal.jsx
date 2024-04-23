import React, { useState } from 'react';
import Button from "../elements/Button"
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";

const ModifyModal = ({ car, modifyCar }) => {
    const [showModal, setShowModal] = useState(true);

    const [modifiedCar, setModifiedCar] = useState({
        carVin: car.carVin,
        owner: car.owner,
        plateNumber: car.plateNumber,
        checkUpExpirationDate: car.checkUpExpirationDate,
        vignetteExpirationDate: car.vignetteExpirationDate
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setModifiedCar({
            ...modifiedCar,
            [name]: value,
        });
    };

    const handleCheckUpDateChange = (date) => {
        setModifiedCar({ ...car, checkUpExpirationDate: date });
    };

    const handleVignetteDateChange = (date) => {
        setModifiedCar({ ...car, vignetteExpirationDate: date });
    };

    const handleCancel = () => {
        setShowModal(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await modifyCar(car._id, modifiedCar);
        setShowModal(false);
    };

    return (
        <>
            {showModal &&
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-md w-96">
                        <h2 className="text-lg font-semibold mb-4">Modifică proprietățile mașinii</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="carVin" className="block text-sm font-medium text-gray-700">
                                    Serie șasiu
                                </label>
                                <input
                                    type="text"
                                    id="carVin"
                                    name="carVin"
                                    value={modifiedCar.carVin}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="owner" className="block text-sm font-medium text-gray-700">
                                    Proprietar
                                </label>
                                <input
                                    type="text"
                                    id="owner"
                                    name="owner"
                                    value={modifiedCar.owner}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700">
                                    Număr Înmatriculare
                                </label>
                                <input
                                    type="text"
                                    id="plateNumber"
                                    name="plateNumber"
                                    value={modifiedCar.plateNumber}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div className="flex flex-row space-x-1 text-center">
                                <div>
                                    <p>ITP</p>
                                    <DatePicker
                                        title="abc"
                                        name="checkUpExpirationDate"
                                        placeholderText="Dată expirare ITP"
                                        selected={modifiedCar.checkUpExpirationDate}
                                        onChange={handleCheckUpDateChange}
                                        minDate={new Date(Date.now() + 86400000)}
                                        dateFormat="dd.MM.yyyy"
                                        className="border border-gray-400 p-2 rounded w-full"
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                                <div>
                                    <p>Rovinietă</p>
                                    <DatePicker
                                        name="vignetteExpirationDate"
                                        placeholderText="Dată expirare Rovinietă"
                                        selected={modifiedCar.vignetteExpirationDate}
                                        onChange={handleVignetteDateChange}
                                        minDate={new Date(Date.now() + 86400000)}
                                        dateFormat="dd.MM.yyyy"
                                        className="border border-gray-400 p-2 rounded w-full"
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center mt-6">
                                <Button
                                    size="small"
                                    variant="gray"
                                    onClick={handleCancel}
                                    className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
                                >
                                    Anulare
                                </Button>
                                <Button
                                    type="submit"
                                    size="small"
                                    variant="green"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                                >
                                    Salvare
                                </Button>
                            </div>
                        </form>
                    </div >
                </div >
            }
        </>
    );
}

export default ModifyModal;
