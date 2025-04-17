"use client";

import React, { useState, useEffect } from "react";
import { useInspectors } from "@/lib/hooks/useInspectors";
import { Inspector, inspectorFields } from "@/types/inspector";
import InputField from "@/components/InputField";

const InspectorRegisterForm = ({ onClose }: { onClose: () => void }) => {
    const { createInspector, updateInspector, deleteInspector } = useInspectors();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
    const companyId = localStorage.getItem("user_id") || "";

    const [formData, setFormData] = useState<Inspector>({
        company_id: companyId,
        name: "",
        inspector_number: "",
        furigana: "",
        architect_name: "",
        architect_registration_name: "",
        architect_registration_number: "",
        fire_protection_inspector_number: "",
        workplace_name: "",
        architect_office_name: "",
        governor_registration_name: "",
        governor_registration_number: "",
        post_number: "",
        address: "",
        phone_number: "",
    });

    useEffect(() => {
        setFormData({
            company_id: companyId,
            name: "山田 太郎",
            furigana: "やまだ たろう",
            post_number: "1234567",
            address: "東京都新宿区テスト1-1-1",
            phone_number: "03-1234-5678",
            inspector_number: "INS-001",
            workplace_name: "株式会社テスト建設",
            architect_office_name: "プロ",
            architect_name: "一級",
            architect_registration_name: "東京都知事",
            architect_registration_number: "12345",
            fire_protection_inspector_number: "FP-999",
            governor_registration_name: "東京都",
            governor_registration_number: "67890",
        });
    }, []);
    

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

        // 🔍 入力バリデーションチェック
        const newErrors: { [key: string]: string | null } = {};
        let hasError = false;

        inspectorFields.forEach((field) => {
            const value = formData[field.id as keyof Inspector]?.toString() || "";
            const isValid = field.validation ? field.validation(value) : true;

            if (!isValid) {
                newErrors[field.id] = `${field.label}の形式が正しくありません。`;
                hasError = true;
            } else {
                newErrors[field.id] = null;
            }
        });

        setErrors(newErrors);

        if (hasError) {
            setLoading(false);
            return;
        }
    
        try {
            // console.log(formData);
    
            const sanitizedFormData = {
                ...formData,
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
            // console.error("🔴 エラー:", err);
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
                {inspectorFields.map((field) => (
                    <InputField
                        key={field.id}
                        id={field.id}
                        label={field.label}
                        value={formData[field.id as keyof Inspector] as string | number}
                        type={field.type || "text"}
                        required={field.required}
                        onChange={handleChange}
                        error={errors[field.id] || undefined}
                    />
                ))}

                <div className="">
                    {/* 建築士事務所 */}
                    <label className="block mb-4">
                        <input
                            type="text"
                            name="architect_office_name"
                            className="w-64 px-4 py-2 border rounded-lg"
                            value={formData.architect_office_name || ""}
                            onChange={handleChange}
                        /> 建築士事務所
                    </label>

                    {/* 知事登録 第 ○○号 */}
                    <label className="block mb-4">
                        <input
                            type="text"
                            className="w-64 px-4 py-2 border rounded-lg"
                            name="governor_registration_name"
                            value={formData.governor_registration_name || ""}
                            onChange={handleChange}
                        /> 知事登録 第 
                        <input
                            type="text"
                            className="ml-2 w-64 px-4 py-2 border rounded-lg"
                            name="governor_registration_number"
                            value={formData.governor_registration_number || ""}
                            onChange={handleChange}
                        /> 号
                    </label>
                </div>

                {/* 建築士 */}
                <div className="block text-gray-700 font-bold mb-4">
                    資格
                </div>
                <div className="">
                    <label className="block mb-4">
                        <input
                            type="text"
                            className="w-64 px-4 py-2 border rounded-lg"
                            name="architect_name"
                            value={formData.architect_name || ""}
                            onChange={handleChange}
                        /> 建築士
                    </label>

                    {/* 登録 第 ○○号 */}
                    <label className="block mb-4">
                        <input
                            type="text"
                            className="w-64 px-4 py-2 border rounded-lg"
                            name="architect_registration_name"
                            value={formData.architect_registration_name || ""}
                            onChange={handleChange}
                        /> 登録 第 
                        <input
                            type="text"
                            className="ml-2 w-64 px-4 py-2 border rounded-lg"
                            name="architect_registration_number"
                            value={formData.architect_registration_number || ""}
                            onChange={handleChange}
                        /> 号
                    </label>
                </div>

                {/* 防火設備検査員 第 ○○号 */}
                <label className="block mb-2">
                    防火設備検査員第
                    <input
                        type="text"
                        className="ml-2 w-64 px-4 py-2 border rounded-lg"
                        name="fire_protection_inspector_number"
                        value={formData.fire_protection_inspector_number || ""}
                        onChange={handleChange}
                    /> 号
                </label>

                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">登録</button>
                </div>
            </form>
        </div>
    );
};

export default InspectorRegisterForm;
