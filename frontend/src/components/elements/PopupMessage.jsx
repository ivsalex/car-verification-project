import React from 'react';

const PopupMessage = ({ message }) => {
    if (!message) return null;

    const bgColorMap = {
        'Datele rovinietei au fost actualizate!': 'bg-green-500',
        'Datele autovehicului au fost actualizate!': 'bg-green-500'
    };

    const bgColor = bgColorMap[message] || 'bg-red-500';

    return (
        <div className="fixed left-0 right-0 flex items-center justify-center z-40 max-sm:top-24 md:top-24 lg:top-32">
            <div className={`px-4 py-2 rounded-lg shadow-lg text-white ${bgColor}`}>
                <p className="text-md md:text-lg font-bold text-center">{message}</p>
            </div>
        </div>
    );
};

export default PopupMessage;
