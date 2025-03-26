"use client";

import React, { useState } from "react";
// import { useInspectionRecords } from "@/lib/hooks/useInspectionRecords";
import InspectionResultRegisterFrom from "./InspectionResultRegisterFrom";
import { InspectionRecord } from "@/types/inspection_record";
import { InspectionResult } from "@/types/inspection_result";
import { inspectionItems } from "@/data/inspectionItems";

const InspectionRecordRegisterForm = ({ onClose }: { onClose: () => void }) => {
    // const { createInspectionRecord, updateInspectionRecord, deleteInspectionRecord } = useInspectionRecords();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const companyId = localStorage.getItem("user_id") || "";

    const [inspectionResults, setInspectionResults] = useState<InspectionResult[]>(
        inspectionItems.map((item, index) => ({
            inspection_number: `No.${index + 1}`,
            main_category: item.main_category,
            sub_category: item.sub_category || "",
            inspection_name: item.inspection_name,
            target_existence: false,
            no_issue: true,
            needs_correction: false,
            existing_non_compliance: false,
            situation_measures: "",
            inspector_number: "1",
        }))
    );

    const handleResultChange = (index: number, updated: Partial<InspectionResult>) => {
        const newResults = [...inspectionResults];
        newResults[index] = { ...newResults[index], ...updated };
        setInspectionResults(newResults);
    };

    const [formData, setFormData] = useState<InspectionRecord>({
        shutter_id: companyId,
        inspection_date: "", // YYYY-MM-DD
        lead_inspector: "",
        sub_inspector_1: "",
        sub_inspector_2: ""
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
    
        //     // ✅ まず "保存失敗" として Supabase に inspectionRecord を登録
        //     const initialInspectionRecordData = { ...formData, face_image_url: "保存失敗" };
        //     console.log("🟢 1. 仮のデータを Supabase に登録:", JSON.stringify(initialInspectionRecordData, null, 2));

        //     const sanitizedFormData = {
        //         ...formData,
        //         inspection_date: formData.inspection_date || null,
        //     };
    
        //     const createResult = await createInspectionRecord(sanitizedFormData);
    
        //     if (!createResult.success) {
        //         throw new Error(`Supabase 登録に失敗: ${createResult.error}`);
        //     }
    
        //     const inspectionRecordId = createResult.data[0]?.id;
        //     if (!inspectionRecordId) {
        //         throw new Error("Supabase の登録データから inspectionRecordId を取得できませんでした");
        //     }
    
        //     console.log(`🟢 2. inspectionRecordId: ${inspectionRecordId} が登録完了`);
            
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
                <h1 className="text-2xl font-bold">検査記録作成</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="inspection_date">検査日（必須）</label>
                    <input className="w-full px-4 py-2 border rounded-lg" type="date" id="inspection_date" value={formData.inspection_date} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="lead_inspector">代表検査者（必須）</label>
                    <input className="w-full px-4 py-2 border rounded-lg" type="text" id="lead_inspector" value={formData.lead_inspector} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="sub_inspector_1">検査者1</label>
                    <input className="w-full px-4 py-2 border rounded-lg" type="text" id="sub_inspector_1" value={formData.sub_inspector_1} onChange={handleChange} />
                </div>

                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="sub_inspector_2">検査者2</label>
                    <input className="w-full px-4 py-2 border rounded-lg" type="text" id="sub_inspector_2" value={formData.sub_inspector_2} onChange={handleChange} />
                </div>

                {inspectionResults.map((result, index) => (
                    <InspectionResultRegisterFrom
                        key={index}
                        index={index}
                        result={result}
                        onChange={handleResultChange}
                    />
                ))}

                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">登録</button>
                </div>
            </form>
        </div>
    );
};

export default InspectionRecordRegisterForm;
