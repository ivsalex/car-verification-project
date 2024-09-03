import React, { useState } from 'react';
import Button from "../elements/Button"
import 'react-datepicker/dist/react-datepicker.css';
import { TruckIcon } from '@heroicons/react/outline';
import DatePicker from "react-datepicker";
import "../../utils/datepicker.css"

const ModifyModal = ({ car, carId, modifyCar, onClose }) => {
    const [showModal, setShowModal] = useState(true);

    const currentYear = new Date().getFullYear();

    // ITP DatePicker: 3 years max date
    const itpMinDate = new Date(`${currentYear}-01-01`);
    const itpMaxDate = new Date(`${currentYear + 3}-12-31`);

    // RCA DatePicker: 1 year max date
    const rcaMinDate = new Date(`${currentYear}-01-01`);
    const rcaMaxDate = new Date(`${currentYear + 1}-12-31`);

    const [modifiedCar, setModifiedCar] = useState({
        carVin: car.carVin,
        carCiv: car.carCiv,
        owner: car.owner,
        ownerPhoneNumber: car.ownerPhoneNumber,
        plateNumber: car.plateNumber,
        insuranceExpirationDate: car.insuranceExpirationDate,
        checkUpExpirationDate: car.checkUpExpirationDate,
        vignetteExpirationDate: car.vignetteExpirationDate,
        lastNotificationDate: car.lastNotificationDate,
        vignetteRequired: car.vignetteRequired
    });

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setModifiedCar(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleInsuranceDateChange = (date) => {
        setModifiedCar(prevState => ({ ...prevState, insuranceExpirationDate: date || null }));
    };

    const handleCheckUpDateChange = (date) => {
        setModifiedCar(prevState => ({ ...prevState, checkUpExpirationDate: date || null }));
    };

    const handleVignetteDateChange = (date) => {
        setModifiedCar(prevState => ({ ...prevState, vignetteExpirationDate: date }));
    };

    const handleCancel = () => {
        setShowModal(false);
        onClose();
        setModifiedCar(car);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        onClose();
        await modifyCar(carId, modifiedCar);
    };

    return (
        <>
            {showModal &&
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-800 bg-opacity-50 p-4 backdrop-blur-sm sm:p-8">
                    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md w-full max-w-md mx-0 sm:mx-0">
                        <h2 className="text-lg font-semibold mb-4 text-center">Modifică proprietățile mașinii</h2>
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
                                <label htmlFor="carVin" className="block text-sm font-medium text-gray-700">
                                    Serie C.I.V
                                </label>
                                <input
                                    type="text"
                                    id="carCiv"
                                    name="carCiv"
                                    value={modifiedCar.carCiv}
                                    onChange={handleChange}
                                    pattern="^[A-Za-z]-\d{6}$"
                                    title="Verificați formatul seriei C.I.V"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    autoComplete="off"
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
                                <label htmlFor="owner" className="block text-sm font-medium text-gray-700">
                                    Număr de telefon
                                </label>
                                <input
                                    type="text"
                                    id="ownerPhoneNumber"
                                    name="ownerPhoneNumber"
                                    value={modifiedCar.ownerPhoneNumber}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    pattern="07\d{8}"
                                    title="Verificați formatul numărului de telefon!"
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
                                    pattern="^(B(0\d{1,2}|[1-9]\d{1,2}|1000)[A-Z]{3}|(?:AB|AR|AG|BC|BH|BN|BR|BT|BV|BZ|CS|CL|CJ|CT|CV|DB|DJ|GL|GR|GJ|HR|HD|IL|IS|IF|MM|MH|MS|NT|OT|PH|SM|SJ|SB|SV|TR|TM|TL|VS|VL|VN|XX)(0[1-9]|[1-9][0-9])[A-Z]{2,3})$"
                                    title="Număr incorect! Verficați formatul acestuia."
                                    value={modifiedCar.plateNumber?.toUpperCase()}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div className="flex flex-row space-x-1">
                                <div className="flex flex-row space-x-1 text-center">
                                    <div>
                                        <p>ITP</p>
                                        <DatePicker
                                            title="abc"
                                            name="checkUpExpirationDate"
                                            placeholderText="Expirare ITP"
                                            selected={modifiedCar.checkUpExpirationDate}
                                            onChange={handleCheckUpDateChange}
                                            dateFormat="dd.MM.yyyy"
                                            className="border border-gray-400 p-2 rounded w-full caret-transparent"
                                            autoComplete="off"
                                            withPortal
                                            fixedHeight
                                            showYearDropdown
                                            showMonthDropdown
                                            dropdownMode="select"
                                            minDate={itpMinDate}
                                            maxDate={itpMaxDate}
                                            customInput={<input inputMode='none' />}
                                        />
                                    </div>
                                    <div>
                                        <p>RCA</p>
                                        <DatePicker
                                            title="abc"
                                            name="insuranceExpirationDate"
                                            placeholderText="Expirare RCA"
                                            selected={modifiedCar.insuranceExpirationDate}
                                            onChange={handleInsuranceDateChange}
                                            dateFormat="dd.MM.yyyy"
                                            className="border border-gray-400 p-2 rounded w-full caret-transparent"
                                            autoComplete="off"
                                            withPortal
                                            fixedHeight
                                            showYearDropdown
                                            showMonthDropdown
                                            dropdownMode="select"
                                            minDate={rcaMinDate}
                                            maxDate={rcaMaxDate}
                                            customInput={<input inputMode='none' />}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center align-center items-center">
                                    <div className="flex flex-col space-y-1">
                                        <p><TruckIcon className="h-6 w-6" /></p>
                                        <input
                                            title="Debifați la adăugarea unei remorci sau moto!"
                                            type="checkbox"
                                            name="vignetteRequired"
                                            checked={modifiedCar.vignetteRequired}
                                            onChange={handleChange}
                                        />
                                    </div>
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
