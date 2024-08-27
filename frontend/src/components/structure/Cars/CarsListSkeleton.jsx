import React from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import Button from "../../elements/Button";
import SearchInput from "../../elements/Search";

import { ArrowLeftIcon, ArrowRightIcon, TruckIcon, PlusIcon, DotsHorizontalIcon, TrashIcon } from '@heroicons/react/outline';

function CarsListSkeleton() {
    const rows = 8; // Number of rows to show in the skeleton
    const pageNumbers = [1, 2, 3, 4, 5, '...', 99]; // Example page numbers

    return (
        <div className="lg:flex flex-col justify-center align-center text-center p-4 space-y-4 mx-auto max-xl:w-full xl:h-100 w-fit">
            <div className="flex items-center justify-between gap-2">
                <Button variant="gray" className="flex items-center lg:text-xl lg:py-3 lg:px-4">
                    <ArrowLeftIcon className="h-5 w-5 md:hidden block" />
                    <span className="md:block hidden">Înapoi</span>
                </Button>
                <SearchInput disabled />
                <Button variant="green" className="flex items-center lg:text-xl lg:py-3 lg:px-4">
                    <PlusIcon className="h-5 w-5 md:hidden block" />
                    <span className="md:block hidden">Adaugă</span>
                </Button>
            </div>

            <div className="justify-center flex-grow">
                {/* Table Layout - visible only on large screens */}
                <table className="w-full table-auto hidden lg:table">
                    <thead className="bg-blue-500 sticky top-0">
                        <tr>
                            <th className="px-4 py-2">#</th>
                            <th className="px-4 py-2">Serie șasiu</th>
                            <th className="px-4 py-2">Serie CIV</th>
                            <th className="px-4 py-2">Proprietar</th>
                            <th className="px-4 py-2">Număr înmatriculare</th>
                            <th className="px-4 py-2">RCA</th>
                            <th className="px-4 py-2">ITP</th>
                            <th className="px-4 py-2">Rovinietă</th>
                            <th className="px-4 py-2 flex items-center justify-center text-center">
                                <TruckIcon className="h-6 w-6" />
                            </th>
                            <th className="px-4 py-2">Acțiuni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 8 }, (_, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-1 w-16"><Skeleton width={10} height={8} /></td>
                                <td className="border px-4 py-1 w-56"><Skeleton width={150} height={8} /></td>
                                <td className="border px-4 py-1 w-32"><Skeleton width={80} height={8} /></td>
                                <td className="border px-4 py-1"><Skeleton width={240} height={8} /></td>
                                <td className="border px-4 py-1"><Skeleton width={110} height={8} /></td>
                                <td className="border px-4 py-1"><Skeleton width={82} height={8} /></td>
                                <td className="border px-4 py-1"><Skeleton width={82} height={8} /></td>
                                <td className="border px-4 py-1"><Skeleton width={82} height={8} /></td>
                                <td className="border px-8 py-1 text-center"><Skeleton width={15} height={15} /></td>
                                <td className="border px-4 py-1">
                                    <div className="space-x-2">
                                        <Button variant="blue">
                                            <DotsHorizontalIcon className="h-5 w-5" />
                                        </Button>
                                        <Button variant="red">
                                            <TrashIcon className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Card Layout - visible on mobile and tablet */}
                <div className="block md:block lg:hidden">
                    {Array.from({ length: 8 }, (_, index) => (
                        <div key={index} className="border rounded-lg mb-4 p-4">
                            <div className="">
                                <Skeleton width={70} height={20} />
                            </div>
                            <p><strong>Serie șasiu:</strong> <Skeleton width={180} height={20} /></p>
                            <p><strong>Serie CIV:</strong> <Skeleton width={80} height={20} /></p>
                            <p><strong>Proprietar:</strong> <Skeleton width={200} height={20} /></p>
                            <p><strong>Număr înmatriculare:</strong> <Skeleton width={60} height={20} /></p>
                            <p><strong>RCA:</strong> <Skeleton width={60} height={20} /></p>
                            <p><strong>ITP:</strong> <Skeleton width={60} height={20} /></p>
                            <p><strong>Rovinietă:</strong> <Skeleton width={60} height={20} /></p>
                            <div className="flex justify-center items-center space-x-1">
                                <span><strong>Rovinietă necesară:</strong></span>
                                <Skeleton width={20} height={20} />
                            </div>
                            <div className="flex justify-center space-x-2 mt-2">
                                <Button variant="blue">
                                    <DotsHorizontalIcon className="h-5 w-5" />
                                </Button>
                                <Button variant="red">
                                    <TrashIcon className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center space-x-1 max-sm:pb-4 md:my-4">
                <Button
                    size="tiny"
                    variant="lightgray"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </Button>
                {pageNumbers.map((number, index) => (
                    <Button
                        key={index}
                        size="tiny"
                        variant={'gray'}
                        className="w-7 h-7 flex items-center justify-center"
                    >
                        {number}
                    </Button>
                ))}
                <Button
                    size="tiny"
                    variant="lightgray"
                >
                    <ArrowRightIcon className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}

export default CarsListSkeleton;
