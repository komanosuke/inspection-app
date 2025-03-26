"use client";

import React, { useState, useEffect, useCallback } from "react";
import LoginCheck from '@/components/LoginCheck';
import ShuttersTable from "@/components/ShuttersTable";
import Modal from "@/components/Modal";
import ShutterRegisterForm from "@/components/ShutterRegisterForm";
import LoadingSpinner from "@/components/LoadingSpinner";
// import { useShutters } from "@/lib/hooks/useShutters";
import { useShutters } from "@/lib/hooks/useShutters";

const ShuttersPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExporting, setExporting] = useState(false);
    const loading = false;
    const error = false;
    
    // const { fetchShutters, fetchShuttersByIds, setShutters, loading, error } = useShutters();
    const shutters = [
        {
            id: "400f5f74-4d7b-42f6-9ce4-52f79916d285",
            site_id: "11111111-1111-1111-1111-111111111111", // 現場IDに対応（例）
            name: "北側シャッター",
            model_number: "SHTR-900XH",
            created_at: "2025-03-01T08:00:00.000Z",
            updated_at: "2025-03-01T08:00:00.000Z"
        },
        {
            id: "500f5f74-4d7b-42f6-9ce4-52f79916d285",
            site_id: "11111111-1111-1111-1111-111111111111",
            name: "A号シャッター",
            model_number: "SHTR-1200XS",
            created_at: "2025-03-02T09:30:00.000Z",
            updated_at: "2025-03-02T09:30:00.000Z"
        },
        {
            id: "600f5f74-4d7b-42f6-9ce4-52f79916d285",
            site_id: "22222222-2222-2222-2222-222222222222", // 別の現場IDの例
            name: "西側搬入口シャッター",
            model_number: "SHTR-1000XL",
            created_at: "2025-03-03T10:45:00.000Z",
            updated_at: "2025-03-03T10:45:00.000Z"
        }
    ];
      
      

    // ✅ `userCompanyId` を `localStorage` から取得
    const [userCompanyId, setUserCompanyId] = useState<string | null>(null);
    useEffect(() => {
        const id = localStorage.getItem("user_id");
        setUserCompanyId(id);
    }, []);
    const [selectedShutterId, setSelectedShutterId] = useState<string | "all">("all");
    // const { fetchShutters, shutters } = useShutters();

    // ✅ `fetchShutters` を `useCallback` でメモ化（無駄なレンダリング防止）
    const getShutters = useCallback(async () => {
        if (!userCompanyId) return;
        // await fetchShutters(undefined, userCompanyId);
    }, [userCompanyId]);

    // ✅ `useEffect` で `fetchShutters`と`getShutters` を実行（初回のみ）
    useEffect(() => {
        // getShutters();
    }, [getShutters]);
    
    const handleExportToExcel = () => {
        setExporting(true);
        console.log("出力しました!");
    };

    return (
        <LoginCheck>
            { isExporting && (
                <LoadingSpinner/>
            )}
            <div className="bg-white p-4 md:p-8 shadow rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">シャッター 一覧</h1>
                    {/* ✅ セレクトボックスを追加 */}
                    <select
                        title="シャッターを選択"
                        value={selectedShutterId}
                        onChange={(e) => setSelectedShutterId(e.target.value)}
                        className="border p-2 rounded-md"
                    >
                        <option value="all">現場を選択</option>
                        {shutters && shutters.map((shutter) => (
                            <option key={shutter.id} value={shutter.id}>
                                {shutter.name}
                            </option>
                        ))}
                    </select>
                    
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        ＋ 新規作成
                    </button>
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
                {!loading && !error && shutters && shutters.length > 0 ? (
                    <ShuttersTable shutters={shutters} />
                ) : (
                    !loading && !error && (
                        <div className="text-center p-6">📂 検査記録データがありません</div>
                    )
                )}

                {/* モーダル（新規登録） */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <ShutterRegisterForm onClose={() => setIsModalOpen(false)} />
                </Modal>
            </div>
        </LoginCheck>
    );
};

export default ShuttersPage;
