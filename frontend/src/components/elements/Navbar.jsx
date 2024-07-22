import { UserIcon } from '@heroicons/react/outline';

export const Navbar = () => {
    return (
        <div className="bg-blue-700 p-4">
            <div className="flex items-center p-2">
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
                <div className="ml-auto border rounded-full p-1 border-white border-opacity-70 hover:border-opacity-100 cursor-pointer">
                    <a href='https://accounts.ivaiondan.ro/user'><UserIcon className="h-7 w-7 text-white hover:font-bold" /></a>
                </div>
            </div>
        </div>
    );
};
