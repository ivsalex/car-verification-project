import React, { useEffect, useState } from 'react';
import Button from "../../elements/Button";
import Spinner from "../../elements/Spinner";
import { useNavigate } from "react-router-dom";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import { TruckIcon } from '@heroicons/react/outline';
import { formatTimeStamp } from "../../../utils/utils";

function CarAddCard({ handleSubmit, setCarData, carData, errorMessage }) {
    const [loading, setLoading] = useState(true);
    const [vignetteRequired, setVignetteRequired] = useState(true);
    const navigate = useNavigate();

    const today = new Date();
    const currentYear = today.getFullYear();
    const nextYear = currentYear + 3;

    const minDate = new Date(currentYear, 0, 1);
    const maxDate = new Date(nextYear, 11, 31);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarData({ ...carData, [name]: value.toUpperCase() });
    };

    const handleInsuranceDateChange = (date) => {
        formatTimeStamp(date);
        setCarData({ ...carData, insuranceExpirationDate: date || null });
    };

    const handleCheckUpDateChange = (date) => {
        formatTimeStamp(date);
        setCarData({ ...carData, checkUpExpirationDate: date || null });
    };

    const handleVignetteDateChange = (date) => {
        formatTimeStamp(date);
        setCarData({ ...carData, vignetteExpirationDate: date });
    };

    const handleVignetteRequiredChange = (e) => {
        const checked = e.target.checked;
        setVignetteRequired(checked);
        setCarData({ ...carData, vignetteRequired: checked });
    };

    useEffect(() => {
        setVignetteRequired(carData.vignetteRequired !== false);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

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
                    <form onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}>
                        <div className="flex flex-col bg-gray-200 text-x space-y-4 p-6 text-center rounded-2xl w-auto">
                            <h1 className="font-bold text-xl">Adaugă autovehicul</h1>
                            <input
                                type="text"
                                name="plateNumber"
                                value={carData.plateNumber || ''}
                                onChange={handleChange}
                                placeholder="Număr înmatriculare (ex: BV01TST)"
                                pattern="^(B(0\d{1,2}|[1-9]\d{1,2}|1000)[A-Z]{3}|(?:AB|AR|AG|BC|BH|BN|BR|BT|BV|BZ|CS|CL|CJ|CT|CV|DB|DJ|GL|GR|GJ|HR|HD|IL|IS|IF|MM|MH|MS|NT|OT|PH|SM|SJ|SB|SV|TR|TM|TL|VS|VL|VN|XX)(0[1-9]|[1-9][0-9])[A-Z]{2,3})$"
                                className="border border-gray-400 p-2 rounded-lg"
                                title="Număr incorect! Verficați formatul acestuia."
                                autoComplete="off"
                            />
                            <input
                                type="text"
                                name="carVin"
                                value={carData.carVin || ''}
                                onChange={handleChange}
                                placeholder="Serie șasiu (ex: VF1EM0J0H31170664)"
                                className="border border-gray-400 p-2 rounded-lg"
                                title="Verificați formatul seriei de șasiu (17 caractere)"
                                autoComplete="off"
                            />
                            <input
                                type="text"
                                name="carCiv"
                                value={carData.carCiv || ''}
                                onChange={handleChange}
                                placeholder="Serie C.I.V (ex: C-123456)"
                                pattern="^[A-Za-z]-\d{6}$"
                                className="border border-gray-400 p-2 rounded-lg"
                                title="Verificați formatul seriei C.I.V"
                                autoComplete="off"
                            />
                            <input
                                type="text"
                                name="owner"
                                value={carData.owner || ''}
                                onChange={handleChange}
                                placeholder="Proprietar (ex: Popescu Ion)"
                                className="border border-gray-400 p-2 rounded-lg"
                                autoComplete="off"
                            />
                            <input
                                type="text"
                                name="ownerPhoneNumber"
                                value={carData.ownerPhoneNumber || ''}
                                onChange={handleChange}
                                placeholder="Număr de telefon: (ex: 0785346926)"
                                className="border border-gray-400 p-2 rounded-lg"
                                autoComplete="off"
                                pattern="07\d{8}"
                                title="Verificați formatul numărului de telefon!"
                            />
                            <div className="flex justify-center space-x-2 relative">
                                <DatePicker
                                    name="checkUpExpirationDate"
                                    placeholderText="Expirare ITP"
                                    selected={carData.checkUpExpirationDate}
                                    onChange={handleCheckUpDateChange}
                                    dateFormat="dd-MM-yyyy"
                                    className="border border-gray-400 p-2 rounded w-full"
                                    autoComplete="off"
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    showYearDropdown
                                />
                                <DatePicker
                                    name="insuranceExpirationDate"
                                    placeholderText="Expirare RCA"
                                    selected={carData.insuranceExpirationDate}
                                    onChange={handleInsuranceDateChange}
                                    dateFormat="dd-MM-yyyy"
                                    className="border border-gray-400 p-2 rounded w-full"
                                    autoComplete="off"
                                />
                                <DatePicker
                                    name="vignetteExpirationDate"
                                    placeholderText="Expirare Rovinietă"
                                    selected={carData.vignetteExpirationDate}
                                    onChange={handleVignetteDateChange}
                                    dateFormat="dd-MM-yyyy"
                                    className="border border-gray-400 p-2 rounded w-full hidden"
                                    autoComplete="off"
                                    disabled
                                />
                                <div>
                                    <div className="flex items-center justify-center text-center"><TruckIcon className="h-6 w-6" /></div>
                                    <input
                                        title="Debifați la adăugarea unei remorci sau moto!"
                                        type="checkbox"
                                        checked={vignetteRequired}
                                        onChange={handleVignetteRequiredChange}
                                    />
                                </div>
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
                </div >
            )
            }
        </div >
    );
}

export default CarAddCard;
