"use client";

import React, { useState } from "react";
import Image from "next/image";
// import { useShutters } from "@/lib/hooks/useShutters";
import { Shutter } from "@/types/shutter";

const ShutterRegisterForm = ({ onClose }: { onClose: () => void }) => {
    // const { createShutter, updateShutter, deleteShutter } = useShutters();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEmergencyMode, setIsEmergencyMode] = useState(false); // ✅ 緊急モードのstate
    const companyId = localStorage.getItem("user_id") || "";

    const [formData, setFormData] = useState<Shutter>({
        site_id: companyId, // 現場IDに対応（例）
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
    
        // try {
        //     console.log(formData);
    
        //     // ✅ まず "保存失敗" として Supabase に shutter を登録
        //     const initialShutterData = { ...formData, face_image_url: "保存失敗" };
        //     console.log("🟢 1. 仮のデータを Supabase に登録:", JSON.stringify(initialShutterData, null, 2));

        //     const sanitizedFormData = {
        //         ...formData,
        //         inspection_date: formData.inspection_date || null,
        //     };
    
        //     const createResult = await createShutter(sanitizedFormData);
    
        //     if (!createResult.success) {
        //         throw new Error(`Supabase 登録に失敗: ${createResult.error}`);
        //     }
    
        //     const shutterId = createResult.data[0]?.id;
        //     if (!shutterId) {
        //         throw new Error("Supabase の登録データから shutterId を取得できませんでした");
        //     }
    
        //     console.log(`🟢 2. shutterId: ${shutterId} が登録完了`);
            
        //     // ✅ 成功したらモーダルを閉じる
        //     onClose();
        //     window.location.reload()        
        // } catch (err: any) {
        //     console.error("🔴 エラー:", err);
        //     setError(err.message);
        // } finally {
        //     setLoading(false);
        // }
    };    
    

    return (
        <div className="md:p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">シャッター登録</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="name">シャッター名（必須）</label>
                    <input className="w-full px-4 py-2 border rounded-lg" type="date" id="name" value={formData.name} onChange={handleChange} required={!isEmergencyMode} />
                </div>

                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="model_number">モデル番号（必須）</label>
                    <input className="w-full px-4 py-2 border rounded-lg" type="text" id="model_number" value={formData.model_number} onChange={handleChange} required />
                </div>

                {/* ここに各検査項目をループで登録 */}

                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">登録</button>
                </div>
            </form>
        </div>
    );
};

export default ShutterRegisterForm;
