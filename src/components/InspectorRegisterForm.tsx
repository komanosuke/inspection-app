"use client";

import React, { useState } from "react";
import { useInspectors } from "@/lib/hooks/useInspectors";
import { Inspector } from "@/types/inspector";

const InspectorRegisterForm = ({ onClose }: { onClose: () => void }) => {
    const { createInspector, updateInspector, deleteInspector } = useInspectors();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const companyId = localStorage.getItem("user_id") || "";

    const [formData, setFormData] = useState<Inspector>({
        company_id: companyId,
        name: "",
        inspector_number: ""
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
    
            const sanitizedFormData = {
                ...formData,
                // hire_date: formData.hire_date || null,
                // birthdate: formData.birthdate || null,
                // health_check_date: formData.health_check_date || null,
                // special_health_check_date: formData.special_health_check_date || null,
                // sending_education_date: formData.sending_education_date || null,
                // receiving_education_date: formData.receiving_education_date || null,
            };
    
            const createResult = await createInspector(sanitizedFormData);
    
            if (!createResult.success) {
                throw new Error(`Supabase 登録に失敗: ${createResult.error}`);
            }
    
            alert("新規の検査者を登録しました。");
            
            // ✅ 成功したらモーダルを閉じる
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
                <h1 className="text-2xl font-bold">検査者情報登録</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="name">氏名（必須）</label>
                    <input className="w-full px-4 py-2 border rounded-lg" type="text" id="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="inspector_number">検査者番号（必須）</label>
                    <input className="w-full px-4 py-2 border rounded-lg" type="text" id="inspector_number" value={formData.inspector_number} onChange={handleChange} required />
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">登録</button>
                </div>
            </form>
        </div>
    );
};

export default InspectorRegisterForm;
