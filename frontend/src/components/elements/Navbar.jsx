export const Navbar = () => {
    return (
        <div className="border-b bg-blue-700 p-4">
            <div className="flex justify-center p-4">
                <div>
                    <ul className="hidden sm:flex space-x-6 text-base text-white">
                        <li className="border-b-2 border-transparent font-bold transition duration-300 ease-in-out">
                            <a className="hover:text-blue-200 transition-all duration-200 ease-in-out py-1 px-2"
                                href="/">
                                ACASĂ
                            </a>
                        </li>
                        <li className="font-bold transition duration-300 ease-in-out">
                            <a className="hover:text-blue-200 transition-all duration-200 ease-in-out px-2"
                                href="/cars">MAȘINI</a>
                        </li>
                        <li className="font-bold transition duration-300 ease-in-out">
                            <a className="hover:text-blue-200 transition-all duration-200 ease-in-out px-2"
                                href="/dashboard">DASHBOARD</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};