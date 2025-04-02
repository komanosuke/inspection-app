"use client";

import React, { useState, useEffect } from "react";
import { InspectionRecord } from "@/types/inspection_record";
import { InspectionResult } from "@/types/inspection_result";
import { useInspectionResults } from "@/lib/hooks/useInspectionResults";
import { inspectionItems } from "@/data/inspectionItems";

const InspectionRecordData = ({ inspectionRecord, showExcelButton }: { inspectionRecord: InspectionRecord; showExcelButton: boolean; }) => {
    const { fetchInspectionResults, inspectionResults, error } = useInspectionResults();
    const [loading, setLoading] = useState<boolean>(true);
    const [isExporting, setExporting] = useState(false);
    const [originalResults, setOriginalResults] = useState<InspectionResult[]>([]);
    
    const handleExportToExcel = () => {
        setExporting(true);
        alert("出力しました!");
    };

    useEffect(() => {
        const loadData = async () => {
            if (inspectionRecord.id) {
                await fetchInspectionResults(inspectionRecord.id);
                setLoading(false);
            }
        };

        loadData();
    }, [inspectionRecord.id]);

    useEffect(() => {
        if (inspectionResults && inspectionResults.length > 0) {
            const sortedResults = sortInspectionResults(inspectionResults);
            // ✅ originalResults にデータ保存
            setOriginalResults(sortedResults);
        }
    }, [inspectionResults]);
    

    const sortInspectionResults = (results: InspectionResult[]) => {
        const itemOrder = inspectionItems.map((item) => item.inspection_name);
    
        return results.slice().sort((a, b) => {
            const indexA = itemOrder.indexOf(a.inspection_name);
            const indexB = itemOrder.indexOf(b.inspection_name);
            return indexA - indexB;
        });
    };    

    if (loading) {
        return <div className="text-center p-4">🔄 データを読み込み中...</div>;
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-4 border border-red-500 rounded-md">
                検査結果の取得に失敗しました。<br />
                <p className="text-xs">{error}</p>
            </div>
        );
    }

    if (!inspectionResults || inspectionResults.length === 0) {
        return <div className="text-center p-4">📂 検査結果がありません</div>;
    }

    return (
        <div className="overflow-x-auto p-0 sm:p-4 bg-white rounded-lg w-full">
            <h2 className="text-xl font-bold mb-4">検査記録データ</h2>
            {/* Excelファイル出力ボタン */}
            {showExcelButton &&
                <button
                    className="p-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 min-w-[120px]"
                    onClick={handleExportToExcel}
                >
                    📂 Excel出力
                </button>
            }
            <table className="w-full border-collapse border border-gray-300 text-xs mt-4">
                <tbody>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2 text-left w-1/4">点検日</th>
                        <td className="border px-4 py-2 w-1/4">{inspectionRecord.inspection_date}</td>
                    </tr>
                    <tr>
                        <th className="border px-4 py-2 text-left">代表検査者</th>
                        <td className="border px-4 py-2">{inspectionRecord.lead_inspector}</td>
                    </tr>
                    <tr>
                        <th className="border px-4 py-2 text-left">その他の検査者1</th>
                        <td className="border px-4 py-2">{inspectionRecord.sub_inspector_1 || "-"}</td>
                    </tr>
                    <tr>
                        <th className="border px-4 py-2 text-left">その他の検査者2</th>
                        <td className="border px-4 py-2">{inspectionRecord.sub_inspector_2 || "-"}</td>
                    </tr>
                </tbody>
            </table>

            <table className="w-full border-collapse border border-gray-300 text-xs mt-4">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2  min-w-[50px] md:min-w-[50px]">番号</th>
                        <th className="border px-4 py-2  min-w-[100px] md:min-w-[150px]">検査大項目</th>
                        <th className="border px-4 py-2  min-w-[100px] md:min-w-[150px]">検査小項目</th>
                        <th className="border px-4 py-2  min-w-[100px] md:min-w-[150px]">検査事項名</th>
                        <th className="border px-4 py-2  min-w-[100px] md:min-w-[150px]">対象の有無</th>
                        <th className="border px-4 py-2  min-w-[100px] md:min-w-[150px]">検査結果</th>
                        <th className="border px-4 py-2  min-w-[100px] md:min-w-[150px]">状況・対策</th>
                        <th className="border px-4 py-2  min-w-[100px] md:min-w-[150px]">担当検査者</th>
                    </tr>
                </thead>
                <tbody>
                    {originalResults.map((result: InspectionResult) => (
                        <tr key={result.id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{result.inspection_number}</td>
                            <td className="border px-4 py-2">{result.main_category}</td>
                            <td className="border px-4 py-2">{result.sub_category || "-"}</td>
                            <td className="border px-4 py-2">{result.inspection_name}</td>
                            <td className="border px-4 py-2">
                                {result.target_existence ? "✅" : "❌"}
                            </td>
                            <td className="border px-4 py-2">
                                {getResultLabel(result.inspection_result)}
                            </td>
                            <td className="border px-4 py-2">{result.situation_measures || "-"}</td>
                            <td className="border px-4 py-2">{result.inspector_number}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ✅ 検査結果の表示ラベルを取得
const getResultLabel = (result: string) => {
    switch (result) {
        case "no_issue":
            return "✅ 指摘なし";
        case "needs_correction":
            return "⚠️ 要是正";
        case "existing_non_compliance":
            return "❗️ 既存不適格";
        default:
            return "❓ 不明";
    }
};

export default InspectionRecordData;
