import React from "react";
import { useUser } from "@clerk/clerk-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function DueCarsSkeleton({ isLoading, selectedDuration }) {
    const { user } = useUser();

    const renderSkeletonRow = (index) => (
        <tr
            key={index}
            className="p-1 block border-b border-gray-300 md:table-row md:mb-0"
        >
            <td className="p-1 whitespace-nowrap flex justify-center md:table-cell">
                <Skeleton width={170} />
            </td>
            <td className="p-1 whitespace-nowrap flex justify-center md:table-cell">
                <Skeleton width={210} />
            </td>
            <td className="p-1 whitespace-nowrap flex justify-center md:table-cell">
                <Skeleton width={100} />
            </td>
            <td className="p-1 whitespace-nowrap flex justify-center md:table-cell">
                <Skeleton width={120} />
            </td>
            <td className="p-1 whitespace-nowrap flex justify-center md:table-cell">
                <Skeleton width={60} />
            </td>
            <td className="p-2 whitespace-nowrap flex justify-center md:table-cell">
                <div className="flex justify-center space-x-1">
                    {selectedDuration === 'expired'
                        ?
                        <Skeleton width={48} height={36} />
                        :
                        <>
                            <Skeleton width={48} height={36} />
                            <Skeleton width={48} height={36} />
                        </>
                    }
                </div>
            </td>
        </tr>
    );

    return (
        user && (
            <>
                <div className="overflow-hidden">
                    <h2 className="duration-300 text-lg md:text-xl font-semibold text-center">
                        <Skeleton width={440} height={20} />
                    </h2>
                    {isLoading ? (
                        <div className="rounded-lg">
                            <div className="table-wrapper overflow-y-auto max-h-[calc(100vh-280px)] h-86 scrollbar-thin">
                                <table className="min-w-full divide-y md:border-2 divide-blue-200 table text-center block">
                                    <thead className="bg-blue-500 sticky top-0 hidden md:table-header-group">
                                        <tr className="md:table-row hidden">
                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                                                <Skeleton width={100} />
                                            </th>
                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                                                <Skeleton width={100} />
                                            </th>
                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                                                <Skeleton width={100} />
                                            </th>
                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                                                <Skeleton width={100} />
                                            </th>
                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                                                <Skeleton width={100} />
                                            </th>
                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                                                <Skeleton width={100} />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white md:divide-y md:divide-gray-200 block md:table-row-group">
                                        {Array.from({ length: 10 }).map((_, index) =>
                                            renderSkeletonRow(index)
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg">
                            <h2 className="duration-300 text-lg md:text-xl font-semibold my-2 md:my-4 text-center">
                                {/* Your header logic here */}
                            </h2>
                            <div className="table-wrapper max-h-[calc(100vh-280px)] md:h-86">
                                <table className="min-w-full divide-y md:border-2 divide-blue-200 table text-center block">
                                    <thead className="bg-blue-500 sticky top-0 hidden md:table-header-group">
                                        <tr className="md:table-row hidden">
                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                                                Serie șasiu
                                            </th>
                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                                                Proprietar
                                            </th>
                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                                                Număr Înmatriculare
                                            </th>
                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                                                Dată expirare
                                            </th>
                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                                                Ultima Notificare
                                            </th>
                                            <th className="py-3 text-sm text-gray-800 uppercase md:table-cell">
                                                Acțiuni
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white md:divide-y md:divide-gray-200 block md:table-row-group">
                                        {Array.from({ length: 10 }).map((_, index) =>
                                            renderSkeletonRow(index)
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </>
        )
    );
}

export default DueCarsSkeleton;
