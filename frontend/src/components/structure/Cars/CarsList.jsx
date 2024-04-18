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

    return (
        <div className="flex flex-col justify-center align-center p-4 text-center h-100 space-y-4 mx-auto w-fit">
            {loading && (
                <div role="status">
                    <Spinner />
                </div>
            )}
            {!loading && (
                <>
                    <SearchInput onSearch={handleSearch} />
                    <div className="overflow-y-auto flex justify-center">
                        <table>
                            <thead className="bg-blue-500">
                                <tr>
                                    <th className="px-4 py-2">Serie șasiu</th>
                                    <th className="px-4 py-2">Proprietar</th>
                                    <th className="px-4 py-2">Număr înmatriculare</th>
                                    <th className="px-4 py-2">Dată expirare ITP</th>
                                    <th className="px-4 py-2">Acțiuni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCars.map((car) => (
                                    <tr key={car?._id}>
                                        <td className="border px-4 py-2">{car?.carVin}</td>
                                        <td className="border px-4 py-2">{car?.owner}</td>
                                        <td className="border px-4 py-2">{car?.plateNumber}</td>
                                        <td className="border px-4 py-2">{formatTimestamp(car?.expirationDate)}</td>
                                        <td className="border px-4 py-2">
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
                </>
            )}
        </div>
    );
}

export default CarsList;
