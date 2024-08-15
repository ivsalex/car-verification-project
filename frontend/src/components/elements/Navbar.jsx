import { useState, useRef, useEffect } from 'react';
import { UserIcon, MenuIcon, XIcon } from '@heroicons/react/outline';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative bg-blue-700 p-4">
            <div className="flex items-center md:p-2">
                <div className="sm:hidden flex items-center">
                    <button onClick={toggleMenu} className="text-white">
                        {isOpen ? <XIcon className="h-7 w-8" /> : <MenuIcon className="h-7 w-7" />}
                    </button>
                </div>
                <div className="flex-grow flex justify-center">
                    <ul className="hidden sm:flex space-x-6 text-base text-white">
                        <li className="border-b-2 border-transparent font-bold transition duration-300 ease-in-out">
                            <a className="hover:text-blue-200 transition-all duration-200 ease-in-out py-1 px-2" href="/">
                                ACASĂ
                            </a>
                        </li>
                        <li className="font-bold transition duration-300 ease-in-out">
                            <a className="hover:text-blue-200 transition-all duration-200 ease-in-out px-2" href="/expirari">
                                EXPIRĂRI
                            </a>
                        </li>
                        <li className="font-bold transition duration-300 ease-in-out">
                            <a className="hover:text-blue-200 transition-all duration-200 ease-in-out px-2" href="/cars">
                                MAȘINI
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="ml-auto border rounded-full p-1 border-white border-opacity-70 hover:border-opacity-100 cursor-pointer hover:bg-blue-700">
                    <a href='https://accounts.ivaiondan.ro/user'>
                        <UserIcon className="h-7 w-7 text-white hover:font-bold" />
                    </a>
                </div>
            </div>
            <div ref={menuRef} className={`sm:hidden absolute border-y border-blue-500 left-0 w-full bg-blue-700 mt-2 ${isOpen ? 'block' : 'hidden'} z-50`}>
                <ul className="space-y-4 text-white text-base px-4 py-4">
                    <li className="font-bold transition duration-300 ease-in-out">
                        <a className="hover:text-blue-200 transition-all duration-200 ease-in-out py-1 px-2" href="/">
                            ACASĂ
                        </a>
                    </li>
                    <li className="font-bold transition duration-300 ease-in-out">
                        <a className="hover:text-blue-200 transition-all duration-200 ease-in-out px-2" href="/expirari">
                            EXPIRĂRI
                        </a>
                    </li>
                    <li className="font-bold transition duration-300 ease-in-out">
                        <a className="hover:text-blue-200 transition-all duration-200 ease-in-out px-2" href="/cars">
                            MAȘINI
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};