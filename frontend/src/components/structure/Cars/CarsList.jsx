import React, { useState } from "react";
import { TrashIcon, PencilIcon } from '@heroicons/react/outline';
import Button from "../../elements/Button";
import SearchInput from "../../elements/Search";
import Modal from "../../elements/Modal";

function CarsList({ cars, deleteCar }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCarId, setSelectedCarId] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleDelete = () => {
        deleteCar(selectedCarId);
        setIsDeleteModalOpen(false);
    }

    const filteredCars = cars.filter(car => {
        return car.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.plateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="flex flex-col justify-center align-center p-4 text-center max-h-screen space-y-4">
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
                                <td className="border px-4 py-2">{car?.expirationDate}</td>
                                <td className="border px-4 py-2">
                                    <div className="space-x-2">
                                        <Button variant="blue"><PencilIcon className="h-5 w-5" /></Button>
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
        </div>
    );
}

export default CarsList;
