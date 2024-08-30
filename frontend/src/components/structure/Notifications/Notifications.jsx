import React, { useEffect, useState, useMemo } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SearchIcon } from '@heroicons/react/outline';
import Spinner from "../../elements/Spinner";

function NotificationsSection({ checkCredit, getAllNotifications, credit, notifications }) {
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
    });
    const [endDate, setEndDate] = useState(new Date());
    const [initialLoad, setInitialLoad] = useState(true);

    const smsCount = useMemo(() => {
        return Math.ceil(credit / 0.0350);
    }, [credit]);

    const fetchNotifications = async (start, end) => {
        setLoading(true);
        let timeoutId;
        try {
            const startOfDay = new Date(start.setHours(0, 0, 0, 0));
            const endOfDay = new Date(end.setHours(23, 59, 59, 999));

            const startISO = startOfDay.toISOString();
            const endISO = endOfDay.toISOString();
            await getAllNotifications(startISO, endISO);

            timeoutId = setTimeout(() => {
                setLoading(false);
                setInitialLoad(false);
            }, 1500);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            return () => clearTimeout(timeoutId);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                await fetchNotifications(startDate, endDate);
                checkCredit();
            } catch (error) {
                console.error("Failed to fetch initial data", error);
            }
        };
        fetchInitialData();
    }, []);

    const handleFetchNotifications = () => {
        if (!initialLoad) {
            fetchNotifications(startDate, endDate);
        }
    };

    return (
        <div className='p-4 overflow-y-hidden'>
            <div className="xl:hidden flex flex-col space-y-1">
                <div className="flex flex-row items-center justify-center md:space-y-2 space-y-0 space-x-2">
                    <div className="flex items-center space-x-2">
                        <DatePicker
                            selected={startDate}
                            className="border border-blue-400 py-1 md:p-0.5 rounded-lg text-center focus:outline-none w-40" // Adjusted padding and width
                            onChange={(date) => setStartDate(date)}
                            dateFormat="dd.MM.yyyy"
                            autoComplete="off"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            withPortal
                        />
                        <DatePicker
                            selected={endDate}
                            className="border border-blue-400 py-1 md:p-0.5 rounded-lg text-center focus:outline-none w-40"
                            onChange={(date) => setEndDate(date)}
                            dateFormat="dd.MM.yyyy"
                            autoComplete="off"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            withPortal
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleFetchNotifications}
                        className="px-2 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        <SearchIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="max-xl:hidden flex justify-center space-x-1">
                <DatePicker
                    selected={startDate}
                    className="border border-blue-400 p-1 rounded-lg text-center focus:outline-none hover:cursor-pointer caret-transparen"
                    onChange={(date) => setStartDate(date)}
                    dateFormat="dd.MM.yyyy"
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    withPortal
                />
                <DatePicker
                    selected={endDate}
                    className="border border-blue-400 p-1 rounded-lg text-center focus:outline-none hover:cursor-pointer caret-transparent"
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd.MM.yyyy"
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    withPortal
                />
                <button
                    type="button"
                    onClick={handleFetchNotifications}
                    className="mx-2 px-2 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                    <SearchIcon className="h-4 w-4" />
                </button>
            </div>

            {/* Loading spinner */}
            {loading ? (
                <div role="status" className="flex items-center justify-center h-[calc(100vh-200px)] md:h-[70vh]">
                    <Spinner />
                </div>
            ) : (
                <>
                    <div className='flex flex-col text-center md:flex-row justify-center py-2'>
                        <h2 className='text-xl'>
                            Credit disponibil: <span className='font-semibold'>{credit}€</span> ({smsCount} SMS-uri)
                        </h2>
                    </div>
                    <div className="overflow-hidden">
                        {/* Table - visible on large screens and above */}
                        <div className="hidden xl:block overflow-y-auto md:h-[calc(100vh-195px)]">
                            {notifications.length > 0
                                ?
                                <table className="min-w-full divide-y border-2 divide-blue-200 text-center">
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
                                :
                                <div className="flex justify-center text-red-500 text-xl font-bold">
                                    <h1>Nicio notificare trimisă în intervalul selectat.</h1>
                                </div>
                            }
                        </div>

                        {/* List view - visible on screens smaller than large */}
                        {notifications.length > 0
                            ?
                            <div className="block p-0 m-0 overflow-y-auto h-[calc(100vh-182px)] xl:hidden">
                                {notifications?.map((notification, index) => (
                                    <div key={index} className="border border-gray-300 text-center rounded-lg p-4 mb-4">
                                        <div className="text-md font-medium text-gray-800">
                                            <div><strong>Dată:</strong> {new Date(notification.date).toLocaleString('ro-RO', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                            })}</div>
                                            <div><strong>Proprietar:</strong> {notification.owner}</div>
                                            <div><strong>Număr de înmatriculare:</strong> {notification.plateNumber}</div>
                                            <div><strong>Număr de telefon:</strong> {notification.ownerPhoneNumber}</div>
                                            <div><strong>Mesaj:</strong> {notification.smsBody}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            :
                            <div className="flex justify-center text-red-500 text-sm font-bold xl:hidden">
                                <h1>Nicio notificare trimisă în intervalul selectat.</h1>
                            </div>
                        }
                    </div>
                </>
            )}
        </div>
    );
}

export default NotificationsSection;
