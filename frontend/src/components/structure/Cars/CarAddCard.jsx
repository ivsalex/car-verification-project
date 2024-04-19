import React, { useEffect, useState } from 'react';
import Button from "../../elements/Button";
import Spinner from "../../elements/Spinner";
import { useNavigate } from "react-router-dom";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";

function CarAddCard({ handleSubmit, setCarData, carData, errorMessage }) {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarData({ ...carData, [name]: value });
    };

    const handleCheckUpDateChange = (date) => {
        const options = { timeZone: 'Europe/Bucharest' };
        const adjustedDate = date.toLocaleString('en-GB', options);
        setCarData({ ...carData, checkUpExpirationDate: adjustedDate });
    };

    const handleVignetteDateChange = (date) => {
        const options = { timeZone: 'Europe/Bucharest' };
        const adjustedDate = date.toLocaleString('en-GB', options);
        setCarData({ ...carData, vignetteExpirationDate: adjustedDate });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

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
                <div className="flex flex-col space-y-2">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col bg-gray-200 text-x space-y-4 p-6 text-center rounded-2xl w-auto">
                            <h1 className="font-bold text-xl">Adaugă autovehicul</h1>
                            <input
                                type="text"
                                name="carVin"
                                value={carData.carVin}
                                onChange={handleChange}
                                placeholder="Serie șasiu (ex: VF1EM0J0H31170664)"
                                className="border border-gray-400 p-2 rounded-lg"
                            />
                            <input
                                type="text"
                                name="owner"
                                value={carData.owner}
                                onChange={handleChange}
                                placeholder="Proprietar (ex: Popescu Ion)"
                                className="border border-gray-400 p-2 rounded-lg"
                            />
                            <input
                                type="text"
                                name="plateNumber"
                                value={carData.plateNumber}
                                onChange={handleChange}
                                placeholder="Număr înmatriculare (ex: BV01TST)"
                                pattern="^(B\d{2,3}[A-Z]{3}|BV\d{2}[A-Z]{2,3})$"
                                className="border border-gray-400 p-2 rounded-lg"
                            />
                            <div className="flex justify-center space-x-2 text-center">
                                <DatePicker
                                    name="checkUpExpirationDate"
                                    placeholderText="Dată expirare ITP"
                                    selected={carData.checkUpExpirationDate}
                                    onChange={handleCheckUpDateChange}
                                    minDate={new Date(Date.now() + 86400000)}
                                    dateFormat="dd-MM-yyyy"
                                    className="border border-gray-400 p-2 rounded w-full"
                                />
                                <DatePicker
                                    name="vignetteExpirationDate"
                                    placeholderText="Dată expirare Rovinietă"
                                    selected={carData.vignetteExpirationDate}
                                    onChange={handleVignetteDateChange}
                                    minDate={new Date(Date.now() + 86400000)}
                                    dateFormat="dd-MM-yyyy"
                                    className="border border-gray-400 p-2 rounded w-full"
                                />
                            </div>
                            {errorMessage && <p className="text-red-500 text-lg font-bold text-center animate-shake">{errorMessage}</p>}
                            <div className="space-x-2 flex justify-center">
                                <Button variant="red" onClick={() => navigate('/cars')}>
                                    Anulează
                                </Button>
                                <Button type="submit" variant="green">
                                    Adaugă
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default CarAddCard;
