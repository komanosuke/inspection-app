"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import LoginCheck from '@/components/LoginCheck';
import InspectionRecordsTable from "@/components/InspectionRecordsTable";
import Modal from "@/components/Modal";
import InspectionRecordData from "@/components/InspectionRecordData";
// import { useInspectionRecords } from "@/lib/hooks/useInspectionRecords";
import { useShutters } from "@/lib/hooks/useShutters";

const InspectionRecordsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInspectionRecordModalOpen, setIsInspectionRecordModalOpen] = useState(false);
    const loading = false;
    const error = false;
    
    // const { fetchInspectionRecords, fetchInspectionRecordsByIds, setInspectionRecords, loading, error } = useInspectionRecords();
    const inspectionRecords = [
        {
            id: "1a7b0eac-94f1-48e7-a6a0-1234567890ab",
            shutter_id: "400f5f74-4d7b-42f6-9ce4-52f79916d285",
            inspection_date: "2025-03-10",
            lead_inspector: "山田 太郎",
            sub_inspector_1: "佐藤 花子",
            sub_inspector_2: "鈴木 次郎",
            created_at: "2025-03-10T09:00:00.000Z",
            updated_at: "2025-03-10T09:00:00.000Z",
            inspection_result: [
                {
                    id: "r001",
                    inspection_record_id: "1a7b0eac-94f1-48e7-a6a0-1234567890ab",
                    inspection_number: "001",
                    main_category: "外観",
                    sub_category: "塗装",
                    inspection_name: "シャッター表面の塗装状態",
                    target_existence: true,
                    inspection_result: "no_issue",
                    situation_measures: "良好な状態を確認",
                    inspector_number: "YMD001",
                    created_at: "2025-03-10T09:00:00.000Z",
                    updated_at: "2025-03-10T09:00:00.000Z"
                },
                {
                    id: "r002",
                    inspection_record_id: "1a7b0eac-94f1-48e7-a6a0-1234567890ab",
                    inspection_number: "002",
                    main_category: "動作",
                    sub_category: "開閉機構",
                    inspection_name: "開閉時の異音有無",
                    target_existence: true,
                    inspection_result: "no_issue",
                    situation_measures: "異音あり、注油と部品交換が必要",
                    inspector_number: "YMD002",
                    created_at: "2025-03-10T09:00:00.000Z",
                    updated_at: "2025-03-10T09:00:00.000Z"
                }
            ]
        },
        {
            id: "2b8f1d34-6c2e-4ecb-9134-2345678901cd",
            shutter_id: "400f5f74-4d7b-42f6-9ce4-52f79916d285",
            inspection_date: "2025-03-15",
            lead_inspector: "田中 三郎",
            sub_inspector_1: "中村 美咲",
            sub_inspector_2: null,
            created_at: "2025-03-15T10:30:00.000Z",
            updated_at: "2025-03-15T10:30:00.000Z",
            inspection_result: [
                {
                    id: "r003",
                    inspection_record_id: "2b8f1d34-6c2e-4ecb-9134-2345678901cd",
                    inspection_number: "003",
                    main_category: "電気系統",
                    sub_category: "配線",
                    inspection_name: "制御盤内配線の状態",
                    target_existence: true,
                    inspection_result: "no_issue",
                    situation_measures: "古い規格の配線が使用されている",
                    inspector_number: "TNS001",
                    created_at: "2025-03-15T10:30:00.000Z",
                    updated_at: "2025-03-15T10:30:00.000Z"
                }
            ]
        }
    ];

    // ✅ `userCompanyId` を `localStorage` から取得
    const [userCompanyId, setUserCompanyId] = useState<string | null>(null);
    useEffect(() => {
        const id = localStorage.getItem("user_id");
        setUserCompanyId(id);
    }, []);
    const [selectedShutterId, setSelectedShutterId] = useState<string | "all">("all");
    const { fetchShutters, shutters } = useShutters();

    // ✅ `fetchInspectionRecords` を `useCallback` でメモ化（無駄なレンダリング防止）
    const getInspectionRecords = useCallback(async () => {
        if (!userCompanyId) return;
        // await fetchInspectionRecords(undefined, userCompanyId);
    }, [userCompanyId]);

    const getShutters = useCallback(async () => {
        if (userCompanyId) {
            await fetchShutters(undefined, userCompanyId);
        }
    }, [userCompanyId]);

    // ✅ `useEffect` で `fetchInspectionRecords`と`getShutters` を実行（初回のみ）
    useEffect(() => {
        getInspectionRecords();
        getShutters();
    }, [getInspectionRecords, getShutters]);
    
    return (
        <LoginCheck>
            <div className="bg-white p-4 md:p-8 shadow rounded-lg">
                <div className="sm:flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold mb-2 sm:mb-0">検査記録一覧</h1>
                    {/* ✅ セレクトボックスを追加 */}
                    <select
                        title="シャッターを選択"
                        value={selectedShutterId}
                        onChange={(e) => setSelectedShutterId(e.target.value)}
                        className="border p-2 rounded-md mb-2 sm:mb-0"
                    >
                        <option value="all">シャッターを選択</option>
                        {shutters && shutters.map((shutter) => (
                            <option key={shutter.id} value={shutter.id}>
                                {shutter.name}
                            </option>
                        ))}
                    </select>
                    
                    <button
                        onClick={() => setIsInspectionRecordModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        記録を見る（表につける）
                    </button>

                    <Link
                        href="/inspection_records/new"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        ＋ 新規作成
                    </Link>
                </div>

                {/* 🔄 ローディング表示 */}
                {loading && <div className="text-center p-6">🔄 検査記録データを取得中...</div>}

                {/* ❌ エラー表示 */}
                {error && (
                    <div className="text-center text-red-500 p-4 border border-red-500 rounded-md">
                        検査記録データの取得に失敗しました。<br />
                        <p className="text-xs">{error}</p>
                    </div>
                )}

                {/* ✅ 検査記録一覧テーブル */}
                {!loading && !error && inspectionRecords && inspectionRecords.length > 0 ? (
                    <InspectionRecordsTable inspectionRecords={inspectionRecords} />
                ) : (
                    !loading && !error && (
                        <div className="text-center p-6">📂 検査記録データがありません</div>
                    )
                )}
                
                {/* モーダル（個別の記録表示） */}
                <Modal isOpen={isInspectionRecordModalOpen} onClose={() => setIsInspectionRecordModalOpen(false)}>
                    <InspectionRecordData inspectionRecord={inspectionRecords[0]} />
                </Modal>
            </div>
        </LoginCheck>
    );
};

export default InspectionRecordsPage;
