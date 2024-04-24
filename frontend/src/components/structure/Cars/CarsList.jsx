import React, { useState, useEffect } from "react";
import { DotsHorizontalIcon, TrashIcon } from '@heroicons/react/outline';
import { useNavigate } from "react-router-dom";
import Button from "../../elements/Button";
import Spinner from "../../elements/Spinner";
import SearchInput from "../../elements/Search";
import Modal from "../../elements/Modal";

function CarsList({ cars, deleteCar }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCarId, setSelectedCarId] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 10;
    const navigate = useNavigate();

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleDelete = () => {
        deleteCar(selectedCarId);
        setIsDeleteModalOpen(false);
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = (date.getUTCFullYear()).toString().padStart(2, '0');

        return `${day}.${month}.${year}`;
    }

    function formatLicensePlate(plateNumber) {
        if (!plateNumber) return '';

        plateNumber = plateNumber.replace(/\s/g, '');

        return plateNumber.replace(/([A-Z]+)([0-9]+)/g, `$1 $2 `);
    }

    const filteredCars = cars.filter(car => {
        return car.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.carVin.toLowerCase().includes(searchTerm.toLowerCase());
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="flex flex-col justify-center align-center p-4 text-center space-y-4 mx-auto w-fit h-100">
            {loading && (
                <div role="status">
                    <Spinner />
                </div>
            )}
            {!loading && (
                <>
                    <div className="flex align-center justify-between">
                        <Button variant="gray" onClick={() => navigate("/")}>Înapoi</Button>
                        <SearchInput onSearch={handleSearch} />
                        <Button variant="green" onClick={() => navigate("/adauga")}>Adaugă</Button>
                    </div>
                    <div className="overflow-y-auto justify-center flex-grow">
                        <table>
                            <thead className="bg-blue-500 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2">Serie șasiu</th>
                                    <th className="px-4 py-2">Proprietar</th>
                                    <th className="px-4 py-2">Număr înmatriculare</th>
                                    <th className="px-4 py-2">Dată expirare ITP</th>
                                    <th className="px-4 py-2">Dată expirare Rovinietă</th>
                                    <th className="px-4 py-2">Acțiuni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCars.map((car) => (
                                    <tr key={car?._id}>
                                        <td className="border px-4 py-1">{car?.carVin}</td>
                                        <td className="border px-4 py-1">{car?.owner}</td>
                                        <td className="border px-4 py-1">{formatLicensePlate(car?.plateNumber)}</td>
                                        <td className="border px-4 py-1">{formatTimestamp(car?.vignetteExpirationDate)}</td>
                                        <td className="border px-4 py-1">{formatTimestamp(car?.checkUpExpirationDate)}</td>
                                        <td className="border px-4 py-1">
                                            <div className="space-x-2">
                                                <Button variant="blue"
                                                    onClick={() => {
                                                        navigate(`/cars/${car._id}`);
                                                    }}
                                                ><DotsHorizontalIcon className="h-5 w-5" /></Button>
                                                <Button variant="red"
                                                    onClick={() => {
                                                        setIsDeleteModalOpen(true)
                                                        setSelectedCarId(car?._id)
                                                    }}
                                                ><TrashIcon className="h-5 w-5" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-center my-4 space-x-1">
                            {Array.from({ length: Math.ceil(filteredCars.length / carsPerPage) }, (_, i) => (
                                <Button
                                    key={i}
                                    onClick={() => paginate(i + 1)}
                                    size="tiny"
                                    variant={`${currentPage === i + 1 ? 'blue' : 'gray'}`}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </div>
                        {isDeleteModalOpen && (
                            <Modal
                                title="Dorești să ștergi autovehiculul?"
                                onConfirm={handleDelete}
                                onCancel={() => setIsDeleteModalOpen(false)}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default CarsList;
