import React, { useEffect } from 'react';

function NotificationsSection({ checkCredit, getAllNotifications, credit, notifications }) {

    useEffect(() => {
        checkCredit();
        getAllNotifications();
    }, []);

    return (
        <div className='p-4'>
            <div className='flex justify-center mb-4'>
                <h2 className='text-2xl'>Credit disponibil: <span className='font-semibold'>{credit}</span>€ ({Math.ceil(credit / 0.0350)} SMS-uri)</h2>
            </div>
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
                    {notifications.map((notification, index) => (
                        <tr key={index}>
                            <td className="py-2 whitespace-nowrap">{notification.date}</td>
                            <td className="py-2 whitespace-nowrap">{notification.owner}</td>
                            <td className="py-2 whitespace-nowrap">{notification.plateNumber}</td>
                            <td className="py-2 whitespace-nowrap">{notification.ownerPhoneNumber}</td>
                            <td className="py-2 whitespace-nowrap">{notification.smsBody}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default NotificationsSection;
