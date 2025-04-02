"use client";

import React, { useState, useEffect } from "react";
import { useShutters } from "@/lib/hooks/useShutters";
import { Shutter } from "@/types/shutter";

const ShutterEditForm = ({
    onClose,
    siteId,
    siteName,
    editTarget,
}: {
    onClose: () => void;
    siteId: string;
    siteName: string;
    editTarget: Shutter;
}) => {
    const { updateShutter } = useShutters();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const userId = localStorage.getItem("user_id");

    const [formData, setFormData] = useState<Shutter>({
        id: editTarget.id,
        site_id: siteId,
        company_id: userId || "",
        name: editTarget.name || "",
        model_number: editTarget.model_number || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [id]: type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : type === "number"
                    ? (value !== "" ? parseInt(value, 10) : null)
                    : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!editTarget.id) {
            alert("編集対象が不明です。処理を実行できません。");
            return;
        }

        try {
            if (!userId) {
                alert("ユーザーIDが不明です。処理を実行できません。");
                return;
            }

            const sanitizedFormData = {
                ...formData,
                site_id: siteId,
                company_id: userId,
            };

            console.log("🟡 編集データ:", sanitizedFormData);

            const updateResult = await updateShutter(editTarget.id, sanitizedFormData);

            if (!updateResult.success) {
                throw new Error(`Supabase 更新に失敗: ${updateResult.error}`);
            }

            alert("シャッター情報を更新しました。");

            onClose();
            window.location.reload();
        } catch (err: any) {
            console.error("🔴 エラー:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">シャッター編集</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="name">現場</label>
                    <p className="">{siteName}</p>
                </div>

                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="name">シャッター名<span className="text-red-500">*</span></label>
                    <input className="w-full px-4 py-2 border rounded-lg" type="text" id="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="model_number">モデル番号<span className="text-red-500">*</span></label>
                    <input className="w-full px-4 py-2 border rounded-lg" type="text" id="model_number" value={formData.model_number} onChange={handleChange} required />
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700">更新</button>
                </div>
            </form>
        </div>
    );
};

export default ShutterEditForm;
