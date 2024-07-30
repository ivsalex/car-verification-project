import React, { useState } from 'react';
import { SearchIcon, XIcon } from '@heroicons/react/outline';

function SearchInput({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchDone, setIsSearchDone] = useState(false);

    const handleChange = (event) => {
        setSearchTerm(event.target.value.toUpperCase());
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchTerm) {
            onSearch(searchTerm);
            setIsSearchDone(true);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setIsSearchDone(false);
        onSearch('');
    };

    return (
        <div className="flex justify-center items-center">
            <form onSubmit={handleSubmit} className="flex items-center">
                <input
                    type="text"
                    placeholder="Exemplu: BV01TST"
                    value={searchTerm}
                    onChange={handleChange}
                    className='border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500'
                />
                {!isSearchDone && (
                    <button
                        type="submit"
                        className="ml-2 px-2 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        <SearchIcon className="h-4 w-4" />
                    </button>
                )}
                {isSearchDone && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="ml-2 px-2 py-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 focus:outline-none"
                    >
                        <XIcon className="h-4 w-4" />
                    </button>
                )}
            </form>
        </div>
    );
}

export default SearchInput;
