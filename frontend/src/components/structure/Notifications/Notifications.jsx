import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SearchIcon } from '@heroicons/react/outline';

function NotificationsSection({ checkCredit, getAllNotifications, credit, notifications }) {
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
    });
    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        checkCredit();
        fetchNotifications(startDate, endDate);
    }, []);

    const fetchNotifications = async (start, end) => {
        try {
            const startOfDay = new Date(start.setHours(0, 0, 0, 0));
            const endOfDay = new Date(end.setHours(23, 59, 59, 999));

            const startISO = startOfDay.toISOString();
            const endISO = endOfDay.toISOString();
            await getAllNotifications(startISO, endISO);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const handleFetchNotifications = () => {
        fetchNotifications(startDate, endDate);
    };

    return (
        <div className='p-4'>
            <div className='flex justify-center'>
                <h2 className='text-xl'>
                    Credit disponibil: <span className='font-semibold'>{credit}</span>€ ({Math.ceil(credit / 0.0350)} SMS-uri)
                </h2>
            </div>
            <div className="flex justify-center py-2 space-x-1">
                <DatePicker
                    selected={startDate}
                    className="border border-blue-400 p-1 rounded-lg text-center focus:outline-none"
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd.MM.yyyy"
                />
                <DatePicker
                    selected={endDate}
                    className="border border-blue-400 p-1 rounded-lg text-center focus:outline-none"
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd.MM.yyyy"
                />
                <button
                    type="button"
                    onClick={handleFetchNotifications}
                    className="mx-2 px-2 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    <SearchIcon className="h-4 w-4" />
                </button>
            </div>
            <div className="overflow-y-auto max-h-[500px]">
                <table className="min-w-full divide-y border-2 divide-blue-200 text-center overflow-y-auto">
                    <thead className="bg-blue-500 sticky top-0">
                        <tr>
                            <th className="py-3 text-sm text-gray-800 uppercase text-center">Dată</th>
                            <th className="py-3 text-sm text-gray-800 uppercase text-center">Proprietar</th>
                            <th className="py-3 text-sm text-gray-800 uppercase text-center">Număr de înmatriculare</th>
                            <th className="py-3 text-sm text-gray-800 uppercase text-center">Număr de telefon</th>
                            <th className="py-3 text-sm text-gray-800 uppercase text-center">Mesaj</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {notifications?.map((notification, index) => (
                            <tr key={index}>
                                <td className="py-2 whitespace-nowrap">
                                    {new Date(notification.date).toLocaleString('ro-RO', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    })}
                                </td>
                                <td className="py-2 whitespace-nowrap">{notification.owner}</td>
                                <td className="py-2 whitespace-nowrap">{notification.plateNumber}</td>
                                <td className="py-2 whitespace-nowrap">{notification.ownerPhoneNumber}</td>
                                <td className="py-2 whitespace-nowrap">
                                    <div className='w-[550px] whitespace-normal break-words mx-auto text-center'>
                                        {notification.smsBody}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default NotificationsSection;
