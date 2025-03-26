"use client";

import React, { useState } from "react";

const InspectorsTable = ({ inspectors }) => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="">
            {/* 検索バーとExcelファイル出力ボタン */}
            <div className="flex items-center gap-4 mb-4">
                {/* 検索バー */}
                <input
                    type="text"
                    placeholder="🔍 検索..."
                    className="p-2 border rounded-full w-full shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex text-xs md:text-base">
                <table className="border-collapse border border-gray-300 text-center">
                    <thead className="text-gray-700">
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-2 py-1 min-w-[50px] md:min-w-[70px]">番号</th>
                            <th className="border border-gray-300 px-2 py-1 min-w-[50px] md:min-w-[150px]">氏名</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inspectors.map((inspector, index) => (
                            <tr key={inspector.id} className="bg-gray-200">
                                <td className="border border-gray-300 px-0 py-0 h-[50px]">
                                    <div className="w-full h-full flex flex-col">
                                        <div className="text-center px-2 flex-1 flex items-center justify-center">
                                            {index+1}
                                        </div>
                                    </div>
                                </td>

                                <td className="border border-gray-300 px-0 py-0 h-[50px]">
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
                            {inspectors.map((inspector) => (
                                <tr key={inspector.id} className="bg-white">
                                    <td className="border border-gray-300 px-2 py-1 h-[50px]"><div className="overflow-hidden line-clamp-3">{inspector.inspector_number}</div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InspectorsTable;
