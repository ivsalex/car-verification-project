import React from "react";
import { TrashIcon, PencilIcon } from '@heroicons/react/outline';
import Button from "../../elements/Button";

function CarsList({ cars }) {
    return (
        <div className="flex justify-center align-center p-8 text-center">
            <table>
                <thead className="bg-blue-500">
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Proprietar</th>
                        <th className="px-4 py-2">Număr înmatriculare</th>
                        <th className="px-4 py-2">Dată expirare ITP</th>
                        <th className="px-4 py-2">Acțiuni</th>
                    </tr>
                </thead>
                <tbody>
                    {cars?.map((car) => (
                        <tr key={car?._id}>
                            <td className="border px-4 py-2">{car?._id}</td>
                            <td className="border px-4 py-2">{car?.owner}</td>
                            <td className="border px-4 py-2">{car?.plateNumber}</td>
                            <td className="border px-4 py-2">{car?.expirationDate}</td>
                            <td className="border px-4 py-2">
                                <div className="space-x-2">
                                    <Button variant="blue"><PencilIcon className="h-5 w-5" /></Button>
                                    <Button variant="red"><TrashIcon className="h-5 w-5" /></Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CarsList;