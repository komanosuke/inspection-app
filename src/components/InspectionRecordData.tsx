"use client";
import React, { useState } from "react";
import { InspectionRecord } from "@/types/inspection_record";

const InspectionRecordData: React.FC = (inspectionRecord) => {
    const [isExporting, setExporting] = useState(false);
    const handleExportToExcel = () => {
        setExporting(true);
        console.log("出力しました!");
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">検査記録詳細</h2>

            {/* Excelファイル出力ボタン */}
            <button
                className="p-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 min-w-[120px]"
                onClick={handleExportToExcel}
            >
                📂 Excel出力
            </button>

            <div className="grid gap-3">
                <Item label="検査番号" value={inspectionRecord.inspection_number} />
                <Item label="検査大項目" value={inspectionRecord.main_category} />
                {inspectionRecord.sub_category && <Item label="検査小項目" value={inspectionRecord.sub_category} />}
                <Item label="検査事項名" value={inspectionRecord.inspection_name} />
                <Item label="対象の有無" value={inspectionRecord.target_existence ? "あり" : "なし"} />
                <Item label="指摘なし" value={inspectionRecord.no_issue ? "✔️" : "❌"} />
                <Item label="要是正" value={inspectionRecord.needs_correction ? "✔️" : "❌"} />
                <Item label="既存不適格" value={inspectionRecord.existing_non_compliance ? "✔️" : "❌"} />
                {inspectionRecord.situation_measures && (
                    <Item label="状況・対策等" value={inspectionRecord.situation_measures} />
                )}
                <Item label="検査者番号" value={inspectionRecord.inspector_number} />
                <Item label="作成日時" value={new Date(inspectionRecord.created_at).toLocaleString()} />
                <Item label="更新日時" value={new Date(inspectionRecord.updated_at).toLocaleString()} />
            </div>
        </div>
    );
};

const Item: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex">
        <div className="w-40 font-semibold">{label}</div>
        <div>{value}</div>
    </div>
);

export default InspectionRecordData;
