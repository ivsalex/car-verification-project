import React, { useState, useEffect } from "react";
import { DotsHorizontalIcon, TrashIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import { useNavigate } from "react-router-dom";
import Button from "../../elements/Button";
import Spinner from "../../elements/Spinner";
import SearchInput from "../../elements/Search";
import Modal from "../../elements/Modal";
import { formatTimeStamp, isExpired } from "../../../utils/utils";

function CarsList({ cars, deleteCar }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCarId, setSelectedCarId] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 8;
    const navigate = useNavigate();

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleDelete = () => {
        deleteCar(selectedCarId);
        setIsDeleteModalOpen(false);
    }

    const filteredCars = cars.filter(car => {
        return car.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.carVin.toLowerCase().includes(searchTerm.toLowerCase());
    }).sort((a, b) => a.owner.localeCompare(b.owner));

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const indexOfLastCar = currentPage * carsPerPage;
    const indexOfFirstCar = indexOfLastCar - carsPerPage;
    const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getPageNumbers = () => {
        const totalPages = Math.ceil(filteredCars.length / carsPerPage);
        const pageNumbers = [];
        const maxPageNumbersToShow = 5;

        if (totalPages <= maxPageNumbersToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 4) {
                for (let i = 1; i <= 5; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage + 1 >= totalPages) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                pageNumbers.push(currentPage - 1);
                pageNumbers.push(currentPage);
                pageNumbers.push(currentPage + 1);
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

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
                    <div className="justify-center flex-grow">
                        <table>
                            <thead className="bg-blue-500 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2">Serie șasiu</th>
                                    <th className="px-4 py-2">Serie CIV</th>
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
                                        <td className="border px-4 py-1 w-52">{car?.carVin}</td>
                                        <td className="border px-4 py-1 w-52">{car?.carCiv || '-'}</td>
                                        <td className="border px-4 py-1 w-72">{car?.owner}</td>
                                        <td className="border px-4 py-1">{car?.plateNumber?.toUpperCase()}</td>
                                        <td className={`border px-4 py-1 ${isExpired(car?.checkUpExpirationDate) ? 'text-red-500 font-semibold' : ''}`}>
                                            {car?.checkUpExpirationDate === null ? '-' : formatTimeStamp(car?.checkUpExpirationDate)}
                                        </td>
                                        <td className={`border px-4 py-1 ${isExpired(car?.vignetteExpirationDate) ? 'text-red-500 font-semibold' : ''}`}>
                                            {car?.vignetteExpirationDate === null ? '-' : formatTimeStamp(car?.vignetteExpirationDate)}
                                        </td>
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
                        {isDeleteModalOpen && (
                            <Modal
                                title="Dorești să ștergi autovehiculul?"
                                onConfirm={handleDelete}
                                onCancel={() => setIsDeleteModalOpen(false)}
                            />
                        )}
                    </div>
                    <div className="flex justify-center my-4 space-x-1">
                        <Button
                            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                            size="tiny"
                            variant="lightgray"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Button>
                        {getPageNumbers().map((number, index) => (
                            <Button
                                key={index}
                                onClick={() => number !== '...' && paginate(number)}
                                size="tiny"
                                variant={`${currentPage === number ? 'blue' : 'gray'}`}
                            >
                                {number}
                            </Button>
                        ))}
                        <Button
                            onClick={() => currentPage < Math.ceil(filteredCars.length / carsPerPage) && paginate(currentPage + 1)}
                            size="tiny"
                            variant="lightgray"
                        >
                            <ArrowRightIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CarsList;
