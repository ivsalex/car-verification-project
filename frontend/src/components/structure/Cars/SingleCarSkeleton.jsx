import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Button from "../../elements/Button";
import { ArrowCircleLeftIcon, PencilIcon, TrashIcon, RefreshIcon } from '@heroicons/react/outline';

function SingleCarSkeleton() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-85.6px)] min-w-screen">
            <div className="flex flex-col w-full h-full max-w-6xl mx-auto">
                <div className="flex flex-col h-full bg-white shadow-md border-2 border-gray-100 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 flex-1">
                        {/* Left Column */}
                        <div className="col-span-1 p-2 text-center max-md:border border-gray-200 rounded-md">
                            <h2 className="text-xl font-bold mb-4 xl:text-2xl">DATE AUTOVEHICUL</h2>
                            <div className="space-y-3 text-lg xl:text-xl">
                                <p><span className="font-bold">Serie șasiu: </span><Skeleton width={195} /></p>
                                <p><span className="font-bold">Serie C.I.V: </span><Skeleton width={100} /></p>
                                <p><span className="font-bold">Proprietar: </span><Skeleton width={140} /></p>
                                <p><span className="font-bold">Număr de telefon: </span><Skeleton width={110} /></p>
                                <p><span className="font-bold">Număr înmatriculare: </span><Skeleton width={85} /></p>
                            </div>
                        </div>
                        {/* Middle Column */}
                        <div className="col-span-1 p-2 text-center max-md:border border-gray-200 rounded-md">
                            <h2 className="text-xl font-bold mb-4 xl:text-2xl">EXPIRĂRI</h2>
                            <div className="space-y-3 text-lg xl:text-xl">
                                <p><span className="font-bold">ITP: </span><Skeleton width={170} /></p>
                                <p><span className="font-bold">RCA: </span><Skeleton width={165} /></p>
                                <p><span className="font-bold">ROVINIETĂ: </span><Skeleton width={175} /></p>
                            </div>
                        </div>
                        {/* Right Column */}
                        <div className="col-span-1 p-2 text-center max-md:border border-gray-200 rounded-md">
                            <h2 className="text-xl font-bold mb-4 xl:text-2xl">NOTIFICĂRI</h2>
                            <div className="space-y-3 text-lg xl:text-xl">
                                <p><span className="font-bold">ITP: </span><Skeleton width={170} /></p>
                                <p><span className="font-bold">RCA: </span><Skeleton width={165} /></p>
                                <p><span className="font-bold">ROVINIETĂ: </span><Skeleton width={175} /></p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center p-4 space-x-2 border-t border-gray-200">
                        <Button variant="gray"><ArrowCircleLeftIcon className="h-7 w-7" /></Button>
                        <Button variant="blue"><PencilIcon className="h-7 w-7" /></Button>
                        <Button variant="red"><TrashIcon className="h-7 w-7" /></Button>
                        <Button variant="green"><RefreshIcon className="h-7 w-7" /></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleCarSkeleton;
