"use client";

import React, { useState } from "react";
import PaginationControls from "@/components/PaginationControls";

const InspectorsTable = ({ inspectors }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = inspectors.slice(startIndex, endIndex);
    const totalPages = Math.ceil(inspectors.length / itemsPerPage);

    return (
        <div className="">
            <div className="flex text-xs md:text-base">
                <table className="border-collapse border border-gray-300 text-center">
                    <thead className="text-gray-700">
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-2 py-1 min-w-[50px] md:min-w-[70px]">番号</th>
                            <th className="border border-gray-300 px-2 py-1 min-w-[50px] md:min-w-[150px]">氏名</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPageData.map((inspector, index) => (
                            <tr key={inspector.id} className="bg-gray-200">
                                <td className="border border-gray-300 px-0 py-0 h-[100px]">
                                    <div className="w-full h-full flex flex-col">
                                        <div className="border-b border-gray-300 border-dashed text-center px-2 flex-1 flex items-center justify-center">
                                            {(currentPage - 1) * itemsPerPage + index + 1}
                                        </div>
                                        <div className="text-center px-2 flex-1 flex items-center justify-center">
                                            👀 ✏️ 🗑️
                                        </div>
                                    </div>
                                </td>

                                <td className="border border-gray-300 px-0 py-0 h-[100px]">
                                    <div className="w-full h-full flex flex-col">
                                        <div className="text-center px-2 flex-1 flex items-center justify-center">
                                            {inspector.name}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <div className="overflow-y-auto">
                    <table className="w-full border-collapse border border-gray-300 text-center">
                        <thead className="text-gray-700">
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-2 py-1 min-w-[100px] md:min-w-[150px]">検査者番号</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentPageData.map((inspector) => (
                                <tr key={inspector.id} className="bg-white">
                                    <td className="border border-gray-300 px-2 py-1 h-[100px]"><div className="overflow-hidden line-clamp-3">{inspector.inspector_number}</div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
};

export default InspectorsTable;
