import React, { useEffect, useState } from 'react';

const PopupMessage = ({ message, position = 'center', duration = 3000, bgColor = 'bg-red-500', onClose, disableAnimation }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isSlidingOut, setIsSlidingOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSlidingOut(true);
        }, duration - 500);

        const hideTimer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, [duration, onClose]);

    if (!message || !isVisible) return null;

    const positionClassMap = {
        'center': 'left-0 right-0 flex items-center justify-center max-sm:top-24 md:top-24 lg:top-32',
        'bottom-right': 'bottom-4 right-4 flex items-end justify-end'
    };

    const positionClass = positionClassMap[position] || positionClassMap['center'];
    const animationClass = !disableAnimation ? (isSlidingOut ? 'animate-slideOutRight' : 'animate-slideInRight') : '';

    return (
        <div className={`fixed z-40 ${positionClass}`}>
            <div className={`px-4 py-2 rounded-lg shadow-lg text-white ${bgColor} ${animationClass}`}>
                <p className="text-md md:text-lg font-bold text-center">{message}</p>
            </div>
        </div>
    );
};

export default PopupMessage;
