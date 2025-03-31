"use client";

import React, { useState, useEffect } from "react";
import { useShutters } from "@/lib/hooks/useShutters";
import { Shutter } from "@/types/shutter";
import LoadingSpinner from "@/components/LoadingSpinner";

const ShutterRegisterForm = ({
    onClose,
    siteId,
    siteName,
}: {
    onClose: () => void;
    siteId: string;
    siteName: string;
}) => {
    const { createShutter, updateShutter, deleteShutter } = useShutters();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const userId = localStorage.getItem("user_id");
    const [formData, setFormData] = useState<Shutter>({
        site_id: siteId, // 現場IDに対応（例）
        company_id: userId || "",
        name: "",
        model_number: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;
    
        setFormData((prev) => ({
            ...prev,
            [id]: type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : type === "number"
                    ? (value !== "" ? parseInt(value, 10) : null)  // "" のみ null にする
                    : value
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            console.log(formData);
            if (!userId) {
                alert("ユーザーIDが不明です。処理を実行できません。");
            }

            const sanitizedFormData = {
                ...formData,
                company_id: userId,
                // inspection_date: formData.inspection_date || null,
            };
    
            const createResult = await createShutter(sanitizedFormData);
    
            if (!createResult.success) {
                throw new Error(`Supabase 登録に失敗: ${createResult.error}`);
            }
    
            alert("新規のシャッターを登録しました。");
            
            // ✅ 成功したらモーダルを閉じる
            onClose();
            window.location.reload()        
        } catch (err: any) {
            console.error("🔴 エラー:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };    
    

    return (
        <div className="md:p-6">
            {loading && <LoadingSpinner />}

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">シャッター登録</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="name">現場（必須）</label>
                    { siteName ? (
                        <p className="">{siteName}</p>
                    ) : (
                        <p className="text-red-500">画面を一度閉じて、追加先の現場を選択してください。</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="name">シャッター名（必須）</label>
                    <input className="w-full px-4 py-2 border rounded-lg" type="text" id="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="model_number">モデル番号（必須）</label>
                    <input className="w-full px-4 py-2 border rounded-lg" type="text" id="model_number" value={formData.model_number} onChange={handleChange} required />
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">登録</button>
                </div>
            </form>
        </div>
    );
};

export default ShutterRegisterForm;
