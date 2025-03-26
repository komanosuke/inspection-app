"use client";

import React, { useState, useEffect, useCallback } from "react";
import LoginCheck from '@/components/LoginCheck';
import InspectorsTable from "@/components/InspectorsTable";
import Modal from "@/components/Modal";
import InspectorRegisterForm from "@/components/InspectorRegisterForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useInspectors } from "@/lib/hooks/useInspectors";
import { useSites } from "@/lib/hooks/useSites";

const InspectorsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExporting, setExporting] = useState(false);
    
    const { fetchInspectors, fetchInspectorsByIds, setInspectors, loading, error } = useInspectors();
    const inspectors = [
        {
            "id": "929e0448-ac6c-4457-8587-3d6d12c9a0c1",
            "company_id": "400f5f74-4d7b-42f6-9ce4-52f79916d285",
            "name": "山田 太郎1",
            "inspector_number": "1234",
            "created_at": "2025-03-12T11:50:26.992Z",
            "updated_at": "2025-03-12T11:50:26.997Z"
        },
        {
            "id": "2e14e247-9cfa-4a0a-8f0b-bb26dd866e9b",
            "company_id": "400f5f74-4d7b-42f6-9ce4-52f79916d285",
            "name": "山田 太郎2",
            "furigana": "やまだ2",
            "inspector_number": "1234",
            "created_at": "2025-03-12T11:50:26.992Z",
            "updated_at": "2025-03-12T11:50:26.997Z"
        },
        {
            "id": "a3b8b26a-2f01-43c8-9020-d0a7b1508691",
            "company_id": "400f5f74-4d7b-42f6-9ce4-52f79916d285",
            "name": "山田 太郎3",
            "inspector_number": "1234",
            "created_at": "2025-03-12T11:50:26.992Z",
            "updated_at": "2025-03-12T11:50:26.997Z"
        }
    ];

    // ✅ `userCompanyId` を `localStorage` から取得
    const [userCompanyId, setUserCompanyId] = useState<string | null>(null);
    useEffect(() => {
        const id = localStorage.getItem("user_id");
        setUserCompanyId(id);
    }, []);
    const [selectedSiteId, setSelectedSiteId] = useState<string | "all">("all");
    const { fetchSites, sites } = useSites();

    // ✅ `fetchInspectors` を `useCallback` でメモ化（無駄なレンダリング防止）
    const getInspectors = useCallback(async () => {
        if (!userCompanyId) return;
        // 自社検査者と自社に属するフリーの検査者を取得
        await fetchInspectors(undefined, userCompanyId);
    }, [selectedSiteId]); // `fetchInspectors` への依存を解除

    const getSites = useCallback(async () => {
        if (userCompanyId) {
            await fetchSites(undefined, userCompanyId);
        }
    }, []); // `getSites` への依存を解除

    // ✅ `useEffect` で `fetchInspectors`と`getSites` を実行（初回のみ）
    useEffect(() => {
        getInspectors();
        getSites();
    }, [getInspectors, getSites]);

    return (
        <LoginCheck>
            { isExporting && (
                <LoadingSpinner/>
            )}
            <div className="bg-white p-4 md:p-8 shadow rounded-lg">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">検査者一覧</h1>
                    {/* ✅ セレクトボックスを追加 */}
                    <select
                        title="現場を選択"
                        value={selectedSiteId}
                        onChange={(e) => setSelectedSiteId(e.target.value)}
                        className="border p-2 rounded-md"
                    >
                        <option value="all">自社登録の全ての検査者</option>
                        {sites && sites.map((site) => (
                            <option key={site.id} value={site.id}>
                                {site.name}
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
                {loading && <div className="text-center p-6">🔄 検査者データを取得中...</div>}

                {/* ❌ エラー表示 */}
                {error && (
                    <div className="text-center text-red-500 p-4 border border-red-500 rounded-md">
                        検査者データの取得に失敗しました。<br />
                        <p className="text-xs">{error}</p>
                    </div>
                )}

                {/* ✅ 検査者一覧テーブル */}
                {!loading && !error && inspectors && inspectors.length > 0 ? (
                    <InspectorsTable inspectors={inspectors} />
                ) : (
                    !loading && !error && (
                        <div className="text-center p-6">📂 検査者データがありません</div>
                    )
                )}

                {/* モーダル（新規登録） */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <InspectorRegisterForm onClose={() => setIsModalOpen(false)} />
                </Modal>
            </div>
        </LoginCheck>
    );
};

export default InspectorsPage;
