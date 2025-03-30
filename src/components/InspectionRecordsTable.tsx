"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
import InspectionRecordData from "@/components/InspectionRecordData";
import InspectionRecordEditForm from "@/components/InspectionRecordEditForm";
import { useInspectionRecords } from "@/lib/hooks/useInspectionRecords";

const InspectionRecordsTable = ({ inspectionRecords }) => {
    // ✅ モーダルの状態管理
    const [isInspectionRecordModalOpen, setIsInspectionRecordModalOpen] = useState(false);
    const [isInspectionRecordEditModalOpen, setIsInspectionRecordEditModalOpen] = useState(false);
    const [selectedInspectionRecord, setSelectedInspectionRecord] = useState(null);
    const { deleteInspectionRecord } = useInspectionRecords();

    // ✅ モーダル表示ハンドラー
    const handleViewRecord = (record) => {
        setSelectedInspectionRecord(record);
        setIsInspectionRecordModalOpen(true);
    };

    // ✅ モーダル表示ハンドラー
    const handleViewRecordEdit = (record) => {
        setSelectedInspectionRecord(record);
        setIsInspectionRecordEditModalOpen(true);
    };

    // ✅ 削除ハンドラー
    const handleDeleteRecord = async (id) => {
        const isConfirmed = confirm("本当にこの検査記録を削除しますか？");
        if (!isConfirmed) return;

        try {
            const result = await deleteInspectionRecord(id);

            if (result.success) {
                alert("✅ 検査記録を削除しました。");

                // ✅ records から削除済みデータを除去
                setRecords(records.filter((record) => record.id !== id));
            } else {
                alert(`⚠️ 削除に失敗しました: ${result.error}`);
            }
        } catch (error) {
            console.error("削除エラー:", error);
            alert("⚠️ 削除時にエラーが発生しました。");
        }
    };

    return (
        <div className="">
            {/* ✅ モーダルで InspectionRecordData を表示 */}
            <Modal
                isOpen={isInspectionRecordModalOpen}
                onClose={() => setIsInspectionRecordModalOpen(false)}
            >
                {selectedInspectionRecord && (
                    <InspectionRecordData inspectionRecord={selectedInspectionRecord} />
                )}
            </Modal>
            <Modal
                isOpen={isInspectionRecordEditModalOpen}
                onClose={() => setIsInspectionRecordEditModalOpen(false)}
            >
                {selectedInspectionRecord && (
                    <InspectionRecordEditForm
                        inspectionRecord={selectedInspectionRecord}
                        onClose={() => setIsInspectionRecordEditModalOpen(false)}
                    />
                )}
            </Modal>
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
                                <td className="border border-gray-300 px-0 py-0 w-24 h-[100px]">
                                    <div className="w-full h-full flex flex-col">
                                        <div className="border-b border-gray-300 border-dashed text-center px-2 flex-1 flex items-center justify-center">
                                            {index+1}
                                        </div>
                                        <div className="text-center px-2 flex-1 flex items-center justify-center">
                                            {/* 👀 モーダル表示ボタン */}
                                            <button
                                                onClick={() => handleViewRecord(inspectionRecord)}
                                                className="block text-blue-500 hover:text-blue-700 text-lg"
                                                title="検査記録を表示"
                                            >
                                                👀
                                            </button>
                                            {/* ✏️ 編集ボタン（未実装） */}
                                            <button
                                                className="block ml-2 text-yellow-500 hover:text-yellow-700 text-lg"
                                                title="編集"
                                                onClick={() => handleViewRecordEdit(inspectionRecord)}
                                            >
                                                ✏️
                                            </button>
                                            {/* 🗑️ 削除ボタン（未実装） */}
                                            <button
                                                className="block ml-2 text-red-500 hover:text-red-700 text-lg"
                                                title="削除"
                                                onClick={() => handleDeleteRecord(inspectionRecord.id)}
                                            >
                                                🗑️
                                            </button>
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
