import React, { useState, useEffect } from "react";
import { DotsHorizontalIcon, TrashIcon, ArrowLeftIcon, ArrowRightIcon, TruckIcon, PlusIcon } from '@heroicons/react/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';
import { useNavigate, useSearchParams } from "react-router-dom";
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
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const page = parseInt(searchParams.get('page'), 10);
        if (page && !isNaN(page)) {
            setCurrentPage(page);
        } else {
            setCurrentPage(1);
        }
    }, [searchParams]);

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
        setSearchParams({ page: 1 });
    };

    const handleDelete = () => {
        deleteCar(selectedCarId);
        setIsDeleteModalOpen(false);
    };

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

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        setSearchParams({ page: pageNumber });
    };

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
        <div className="md:flex flex-col justify-center align-center text-center p-4 space-y-4 mx-auto max-lg:w-full lg:h-100 w-fit">
            {loading && (
                <div role="status" className="flex items-center justify-center h-[calc(100vh-200px)] md:h-[70vh]">
                    <Spinner />
                </div>
            )}
            {!loading && (
                <>
                    <div className="flex items-center justify-between gap-2">
                        <Button variant="gray" onClick={() => navigate("/")} className="flex items-center md:text-lg md:py-3 md:px-4">
                            <ArrowLeftIcon className="h-5 w-5 md:hidden block" />
                            <span className="md:block hidden">Înapoi</span>
                        </Button>
                        <SearchInput onSearch={handleSearch} />
                        <Button variant="green" onClick={() => navigate("/adauga")} className="flex items-center md:text-lg md:py-3 md:px-4">
                            <PlusIcon className="h-5 w-5 md:hidden block" />
                            <span className="md:block hidden">Adaugă</span>
                        </Button>
                    </div>

                    <div className="justify-center flex-grow">
                        {/* Table Layout - visible only on large screens */}
                        <table className="w-full table-auto hidden lg:table">
                            <thead className="bg-blue-500 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2">#</th>
                                    <th className="px-4 py-2">Serie șasiu</th>
                                    <th className="px-4 py-2">Serie CIV</th>
                                    <th className="px-4 py-2">Proprietar</th>
                                    <th className="px-4 py-2">Număr înmatriculare</th>
                                    <th className="px-4 py-2">RCA</th>
                                    <th className="px-4 py-2">ITP</th>
                                    <th className="px-4 py-2">Rovinietă</th>
                                    <th className="px-4 py-2 flex items-center justify-center text-center">
                                        <TruckIcon className="h-6 w-6" />
                                    </th>
                                    <th className="px-4 py-2">Acțiuni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCars.map((car, index) => (
                                    <tr key={car?._id}>
                                        <td className="border px-4 py-1 w-16 text-gray-400">{(currentPage - 1) * carsPerPage + index + 1}</td>
                                        <td className="border px-4 py-1 w-56">{car?.carVin}</td>
                                        <td className="border px-4 py-1 w-32">{car?.carCiv || '-'}</td>
                                        <td className="border px-4 py-1 w-72">{car?.owner}</td>
                                        <td className="border px-4 py-1">{car?.plateNumber?.toUpperCase()}</td>
                                        <td className={`w-28 border px-4 py-1 ${isExpired(car?.insuranceExpirationDate) ? 'text-red-500 font-semibold' : ''}`}>
                                            {car?.insuranceExpirationDate === null ? '-' : formatTimeStamp(car?.insuranceExpirationDate)}
                                        </td>
                                        <td className={`w-28 border px-4 py-1 ${isExpired(car?.checkUpExpirationDate) ? 'text-red-500 font-semibold' : ''}`}>
                                            {car?.checkUpExpirationDate === null ? '-' : formatTimeStamp(car?.checkUpExpirationDate)}
                                        </td>
                                        <td className={`w-28 border px-4 py-1 ${isExpired(car?.vignetteExpirationDate) ? 'text-red-500 font-semibold' : ''}`}>
                                            {car?.vignetteExpirationDate === null ? '-' : formatTimeStamp(car?.vignetteExpirationDate)}
                                        </td>
                                        <td className="border px-8 py-1 text-center">
                                            {car.vignetteRequired ? (
                                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <XCircleIcon className="h-5 w-5 text-red-500" />
                                            )}
                                        </td>
                                        <td className="border px-4 py-1">
                                            <div className="space-x-2">
                                                <Button variant="blue" onClick={() => navigate(`/cars/${car._id}?page=${currentPage}`)}>
                                                    <DotsHorizontalIcon className="h-5 w-5" />
                                                </Button>
                                                <Button variant="red" onClick={() => { setIsDeleteModalOpen(true); setSelectedCarId(car?._id); }}>
                                                    <TrashIcon className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Card Layout - visible on mobile and tablet */}
                        <div className="block md:block lg:hidden">
                            {currentCars.map((car, index) => (
                                <div key={car?._id} className="border rounded-lg mb-4 p-4">
                                    <div className="">
                                        <span className="font-semibold text-gray-400">Auto #{(currentPage - 1) * carsPerPage + index + 1}</span>
                                    </div>
                                    <p><strong>Serie șasiu:</strong> {car?.carVin}</p>
                                    <p><strong>Serie CIV:</strong> {car?.carCiv || '-'}</p>
                                    <p><strong>Proprietar:</strong> {car?.owner}</p>
                                    <p><strong>Număr înmatriculare:</strong> {car?.plateNumber?.toUpperCase()}</p>
                                    <p><strong>RCA:</strong> <span className={isExpired(car?.insuranceExpirationDate) ? 'text-red-500 font-semibold' : ''}>
                                        {car?.insuranceExpirationDate === null ? '-' : formatTimeStamp(car?.insuranceExpirationDate)}
                                    </span></p>
                                    <p><strong>ITP:</strong> <span className={isExpired(car?.checkUpExpirationDate) ? 'text-red-500 font-semibold' : ''}>
                                        {car?.checkUpExpirationDate === null ? '-' : formatTimeStamp(car?.checkUpExpirationDate)}
                                    </span></p>
                                    <p><strong>Rovinietă:</strong> <span className={isExpired(car?.vignetteExpirationDate) ? 'text-red-500 font-semibold' : ''}>
                                        {car?.vignetteExpirationDate === null ? '-' : formatTimeStamp(car?.vignetteExpirationDate)}
                                    </span></p>
                                    <div className="flex justify-center items-center space-x-1">
                                        <span><strong>Rovinietă necesară:</strong></span>
                                        {car.vignetteRequired ? (
                                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircleIcon className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                    <div className="flex justify-center space-x-2 mt-2">
                                        <Button variant="blue" onClick={() => navigate(`/cars/${car._id}?page=${currentPage}`)}>
                                            <DotsHorizontalIcon className="h-5 w-5" />
                                        </Button>
                                        <Button variant="red" onClick={() => { setIsDeleteModalOpen(true); setSelectedCarId(car?._id); }}>
                                            <TrashIcon className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center space-x-1 max-sm:pb-4 md:my-4">
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
                                className="w-7 h-7 flex items-center justify-center"
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

                    {isDeleteModalOpen && (
                        <Modal
                            title="Dorești să ștergi autovehiculul?"
                            onConfirm={handleDelete}
                            onCancel={() => setIsDeleteModalOpen(false)}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default CarsList;