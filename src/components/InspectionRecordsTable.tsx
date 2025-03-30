"use client";

import React, { useState } from "react";

const InspectionRecordsTable = ({ inspectionRecords }) => {

    return (
        <div className="">
            <div className="flex text-xs md:text-base">
                <table className="border-collapse border border-gray-300 text-center">
                    <thead className="text-gray-700">
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-2 py-1 min-w-[50px] md:min-w-[70px]">番号</th>
                            <th className="border border-gray-300 px-2 py-1 min-w-[50px] md:min-w-[150px]">シャッター名</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inspectionRecords.map((inspectionRecord, index) => (
                            <tr key={inspectionRecord.id} className="bg-gray-200">
                                <td className="border border-gray-300 px-0 py-0 h-[100px]">
                                    <div className="w-full h-full flex flex-col">
                                        <div className="text-center px-2 flex-1 flex items-center justify-center">
                                            {index+1}
                                        </div>
                                    </div>
                                </td>

                                <td className="border border-gray-300 px-0 py-0 h-[100px]">
                                    <div className="w-full h-full flex flex-col">
                                        <div className="text-center px-2 flex-1 flex items-center justify-center">
                                            {inspectionRecord.shutter_id}
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
                                <th className="border border-gray-300 px-2 py-1 min-w-[100px] md:min-w-[150px]">日付</th>
                                <th className="border border-gray-300 px-2 py-1 min-w-[100px] md:min-w-[150px]">代表検査者</th>
                                <th className="border border-gray-300 px-2 py-1 min-w-[100px] md:min-w-[150px]">検査者1</th>
                                <th className="border border-gray-300 px-2 py-1 min-w-[100px] md:min-w-[150px]">検査者2</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {inspectionRecords.map((inspectionRecord) => (
                                <tr key={inspectionRecord.id} className="bg-white">
                                    <td className="border border-gray-300 px-2 py-1 h-[100px]"><div className="overflow-hidden line-clamp-3">{inspectionRecord.inspection_date}</div></td>
                                    <td className="border border-gray-300 px-2 py-1 h-[100px]"><div className="overflow-hidden line-clamp-3">{inspectionRecord.lead_inspector}</div></td>
                                    <td className="border border-gray-300 px-2 py-1 h-[100px]"><div className="overflow-hidden line-clamp-3">{inspectionRecord.sub_inspector_1}</div></td>
                                    <td className="border border-gray-300 px-2 py-1 h-[100px]"><div className="overflow-hidden line-clamp-3">{inspectionRecord.sub_inspector_2}</div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InspectionRecordsTable;
