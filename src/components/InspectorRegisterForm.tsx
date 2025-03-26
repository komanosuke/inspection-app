"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useInspectors } from "@/lib/hooks/useInspectors";
import { Inspector } from "@/types/inspector";

const InspectorRegisterForm = ({ onClose }: { onClose: () => void }) => {
    const { createInspector, updateInspector, deleteInspector } = useInspectors();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEmergencyMode, setIsEmergencyMode] = useState(false); // ✅ 緊急モードのstate
    const companyId = localStorage.getItem("user_id") || "";

    const [formData, setFormData] = useState<Inspector>({
        company_id: companyId,
        name: "",
        furigana: "",
        skill_id: "",
        occupation: "",
        asterisk: "",
        hire_date: "",
        experience: "",
        birthdate: "",
        age: null,
        address: "",
        emergency_contact: "",
        health_check_date: "",
        highest_blood_pressure: null,
        lowest_blood_pressure: null,
        blood_type: "",
        special_health_check_date: "",
        special_health_check_type: "",
        health_insurance: "",
        pension_insurance: "",
        employment_insurance: "",
        employment_insurance_number: "",
        construction_retirement_fund: false,
        small_business_retirement_fund: false,
        leadership_education: "",
        skill_training: "",
        license: "",
        sending_education_date: "",
        receiving_education_date: "",
        face_image_url: "",
        employment_type: "",
    });

    const [faceImage, setFaceImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFaceImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            // ✅ 画像がある場合のみ通す
            if (!faceImage) {
                console.warn("⚠️ 顔写真がアップロードされていないため、登録はここで終了");
                setLoading(false);
                return;
            }
    
            console.log(formData);
    
            // ✅ まず "保存失敗" として Supabase に inspector を登録
            const initialInspectorData = { ...formData, face_image_url: "保存失敗" };
            console.log("🟢 1. 仮のデータを Supabase に登録:", JSON.stringify(initialInspectorData, null, 2));

            const sanitizedFormData = {
                ...formData,
                hire_date: formData.hire_date || null,
                birthdate: formData.birthdate || null,
                health_check_date: formData.health_check_date || null,
                special_health_check_date: formData.special_health_check_date || null,
                sending_education_date: formData.sending_education_date || null,
                receiving_education_date: formData.receiving_education_date || null,
            };
    
            const createResult = await createInspector(sanitizedFormData);
    
            if (!createResult.success) {
                throw new Error(`Supabase 登録に失敗: ${createResult.error}`);
            }
    
            const inspectorId = createResult.data[0]?.id;
            if (!inspectorId) {
                throw new Error("Supabase の登録データから inspectorId を取得できませんでした");
            }
    
            console.log(`🟢 2. inspectorId: ${inspectorId} が登録完了`);
            
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
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">検査者情報登録</h1>
                
                {/* おしゃれなトグルスイッチ */}
                <label className="inline-flex items-center cursor-pointer">
                    <span className="font-semibold mr-2">緊急登録モード:</span>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={isEmergencyMode}
                            onChange={() => setIsEmergencyMode(!isEmergencyMode)}
                            className="sr-only peer"
                        />
                        <div className="block w-14 h-8 bg-gray-300 rounded-full peer-checked:bg-red-500 transition-colors"></div>
                        <div className="dot absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                    </div>
                </label>
            </div>

            <p className="mb-8 text-sm">自社の検査者とフリーの検査者をこのアカウントに登録できます。</p>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="name">氏名（必須）</label>
                    <input className="w-full px-4 py-2 border rounded-lg" type="text" id="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="furigana">フリガナ（必須）</label>
                    <input className="w-full px-4 py-2 border rounded-lg" type="text" id="furigana" value={formData.furigana} onChange={handleChange} required />
                </div>

                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="employment_type">
                        自社所属確認（必須）
                    </label>
                    <select 
                        className="w-full px-4 py-2 border rounded-lg" 
                        id="employment_type" 
                        value={formData.employment_type} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">選択してください</option>
                        <option value="自社所属">自社所属</option>
                        <option value="フリーランス">フリーランス</option>
                    </select>
                </div>

                {/* 顔写真アップロード */}
                <div className="mb-4">
                    <label className="block font-bold mb-2" htmlFor="faceImage">顔写真（必須）</label>
                    <input
                        className="w-full px-4 py-2 border rounded-lg"
                        type="file"
                        id="faceImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                    {imagePreview && (
                        <div className="mt-2">
                            <Image src={imagePreview} alt="顔写真プレビュー" width={128} height={128} className="w-32 h-32 object-cover rounded-lg border" />
                        </div>
                    )}
                </div>

                {/* ✅ 緊急モード時の追加フォーム表示 */}
                {!isEmergencyMode && (
                    <>
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="occupation">職種（必須）</label>
                        <input className="w-full px-4 py-2 border rounded-lg" type="text" id="occupation" value={formData.occupation} onChange={handleChange} required={!isEmergencyMode}/>
                    </div>

                    {/* 検査者の属性（asterisk）の入力 */}
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="asterisk">※属性（必須）</label>
                        <select className="w-full px-4 py-2 border rounded-lg" id="asterisk" value={formData.asterisk} onChange={handleChange} required={!isEmergencyMode}>
                            <option value="">選択してください</option>
                            <option value="（現）">（現）現場代理人</option>
                            <option value="（作）">（作）作業主任者</option>
                            <option value="（女）">（女）女性検査者</option>
                            <option value="（未）">（未）18歳未満の検査者</option>
                            <option value="（主）">（主）主任技術者</option>
                            <option value="（職）">（職）職長</option>
                            <option value="（安）">（安）安全衛生責任者</option>
                            <option value="（能）">（能）能力向上教育</option>
                            <option value="（再）">（再）危険有害業務・再発防止教育</option>
                            <option value="（習）">（習）外国人技能実習生</option>
                            <option value="（就）">（就）外国人建設就労者</option>
                            <option value="（1特）">（1特）1号特定技能外国人</option>
                            <option value="（高）">（高）60歳以上の検査者</option>
                            <option value="（基）">（基）基幹技能者</option>
                            <option value="（専）">（専）専門技術者</option>
                            <option value="（推）">（推）安全衛生推進者</option>
                            <option value="（班）">（班）班長</option>
                        </select>
                    </div>
                    <p className="mb-6 text-xs">（作）作業主任者は作業を直接指揮する義務を負うので、同時に施工されている他の現場や、同一現場においても他の作業個所との作業主任者を兼務することは、法的に認められていないので、複数の専任としなければならない。</p>

                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="hire_date">雇入年月日（必須）</label>
                        <input className="w-full px-4 py-2 border rounded-lg" type="date" id="hire_date" value={formData.hire_date} onChange={handleChange} required={!isEmergencyMode} />
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="experience">経験年数（必須）<span className="text-red-500 text-xs">現在担当している仕事の経験年数を記入してください</span></label>
                        <input className="w-full px-4 py-2 border rounded-lg" type="number" id="experience" value={formData.experience} onChange={handleChange} min="0" required={!isEmergencyMode} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-bold mb-2" htmlFor="birthdate">生年月日（必須）</label>
                            <input 
                                className="w-full px-4 py-2 border rounded-lg" 
                                type="date" 
                                id="birthdate" 
                                value={formData.birthdate ?? ""} 
                                onChange={handleChange} 
                                required={!isEmergencyMode}
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-2" htmlFor="age">年齢（必須）</label>
                            <input 
                                className="w-full px-4 py-2 border rounded-lg" 
                                type="number" 
                                id="age" 
                                value={formData.age ?? ""} 
                                onChange={handleChange} 
                                min="0"
                                required={!isEmergencyMode}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="address">現住所（必須）</label>
                        <input className="w-full px-4 py-2 border rounded-lg" type="text" id="address" value={formData.address} onChange={handleChange} required={!isEmergencyMode}/>
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="emergency_contact">緊急連絡先（必須）</label>
                        <input 
                            className="w-full px-4 py-2 border rounded-lg" 
                            type="text" 
                            id="emergency_contact" 
                            value={formData.emergency_contact} 
                            onChange={handleChange} 
                            pattern="^[0-9]*$"  // 半角数字のみ許可
                            inputMode="numeric" // スマホで数字キーボードを表示
                            placeholder="例: 09012345678"
                            required={!isEmergencyMode} 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="health_check_date">最近の健康診断日</label>
                        <input className="w-full px-4 py-2 border rounded-lg" type="date" id="health_check_date" value={formData.health_check_date} onChange={handleChange} required={!isEmergencyMode}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-bold mb-2" htmlFor="highest_blood_pressure">最高血圧（必須）</label>
                            <input 
                                className="w-full px-4 py-2 border rounded-lg" 
                                type="number" 
                                id="highest_blood_pressure" 
                                value={formData.highest_blood_pressure ?? ""} 
                                onChange={handleChange} 
                                min="0" 
                                required={!isEmergencyMode}
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-2" htmlFor="lowest_blood_pressure">最低血圧（必須）</label>
                            <input 
                                className="w-full px-4 py-2 border rounded-lg" 
                                type="number" 
                                id="lowest_blood_pressure" 
                                value={formData.lowest_blood_pressure ?? ""} 
                                onChange={handleChange} 
                                min="0" 
                                required={!isEmergencyMode}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="blood_type">血液型（必須）</label>
                        <select className="w-full px-4 py-2 border rounded-lg" id="blood_type" value={formData.blood_type} onChange={handleChange} required={!isEmergencyMode}>
                            <option value="">選択してください</option>
                            <option value="A">A型</option>
                            <option value="B">B型</option>
                            <option value="O">O型</option>
                            <option value="AB">AB型</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="health_insurance">健康保険（必須）</label>
                        <select id="health_insurance" className="w-full px-4 py-2 border rounded-lg" value={formData.health_insurance} onChange={handleChange} required={!isEmergencyMode}>
                            <option value="">選択してください</option>
                            <option value="健康保険組合">健康保険組合</option>
                            <option value="協会けんぽ">協会けんぽ</option>
                            <option value="建設国保">建設国保</option>
                            <option value="国民健康保険">国民健康保険</option>
                            <option value="適用除外">適用除外（後期高齢者の場合）</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="pension_insurance">年金保険（必須）</label>
                        <select id="pension_insurance" className="w-full px-4 py-2 border rounded-lg" value={formData.pension_insurance} onChange={handleChange} required={!isEmergencyMode}>
                            <option value="">選択してください</option>
                            <option value="厚生年金">厚生年金</option>
                            <option value="国民年金">国民年金</option>
                            <option value="受給者">受給者（65歳以上など）</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="employment_insurance">雇用保険（必須）</label>
                        <select 
                            id="employment_insurance" 
                            className="w-full px-4 py-2 border rounded-lg" 
                            value={formData.employment_insurance} 
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData(prev => ({
                                    ...prev,
                                    employment_insurance: value,
                                    employment_insurance_number: value === "適用除外" || value === "" ? "" : prev.employment_insurance_number, // 適用除外または未選択なら番号をリセット
                                }));
                            }} 
                            required={!isEmergencyMode}
                        >
                            <option value="">選択してください</option>
                            <option value="雇用保険">雇用保険（通常の検査者）</option>
                            <option value="日雇保険">日雇保険（日雇労働者）</option>
                            <option value="適用除外">適用除外（事業主やその親族、一人親方）</option>
                        </select>
                    </div>
                    {/* 「適用除外」または未選択の場合は、被保険者番号の入力欄を表示しない */}
                    {formData.employment_insurance !== "適用除外" && formData.employment_insurance !== "" && (
                        <div className="mb-4">
                            <label className="block font-bold mb-2" htmlFor="employment_insurance_number">被保険者番号の下4桁（必須）</label>
                            <input
                                className="w-32 px-4 py-2 border rounded-lg"
                                type="text"
                                id="employment_insurance_number"
                                value={formData.employment_insurance_number ?? ""}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d{4}$/.test(value)) { // 4桁の数字のみ許可
                                        setFormData(prev => ({ ...prev, employment_insurance_number: value }));
                                    }
                                }}
                                pattern="\d{4}" // ちょうど4桁の数字のみ許可
                                inputMode="numeric" // スマホで数字キーボードを表示
                                placeholder="下4桁"
                                required={formData.employment_insurance !== "適用除外" && !isEmergencyMode}
                                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity("4桁の数字を入力してください")}
                                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")} // 入力時にエラーメッセージをリセット
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block font-bold mb-2">退職金共済 <span className="text-red-500 text-xs">加入している場合はチェックを入れてください</span></label>
                        <div className="flex items-center">
                            <input type="checkbox" id="construction_retirement_fund" checked={formData.construction_retirement_fund} onChange={handleChange} className="mr-2"/>
                            <label htmlFor="construction_retirement_fund">建設業退職金共済制度（必須）</label>
                        </div>
                        <div className="flex items-center mt-2">
                            <input type="checkbox" id="small_business_retirement_fund" checked={formData.small_business_retirement_fund} onChange={handleChange} className="mr-2"/>
                            <label htmlFor="small_business_retirement_fund">中小企業退職金共済制度（必須）</label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="leadership_education">雇入･職長 特別教育（必須）</label>
                        <textarea className="w-full px-4 py-2 border rounded-lg" id="leadership_education" value={formData.leadership_education} onChange={handleChange} required={!isEmergencyMode}/>
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="license">免許（必須）<span className="text-red-500 text-xs">該当するものがない場合は「なし」と記入してください</span></label>
                        <textarea className="w-full px-4 py-2 border rounded-lg" id="license" value={formData.license} onChange={handleChange} required={!isEmergencyMode}/>
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="skill_training">技能講習（必須）<span className="text-red-500 text-xs">該当するものがない場合は「なし」と記入してください</span></label>
                        <textarea className="w-full px-4 py-2 border rounded-lg" id="skill_training" value={formData.skill_training} onChange={handleChange} required={!isEmergencyMode}/>
                    </div>

                    <hr className="mt-8 mb-8"/>

                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="special_health_check_date">特殊健康診断日</label>
                        <input className="w-full px-4 py-2 border rounded-lg" type="date" id="special_health_check_date" value={formData.special_health_check_date} onChange={handleChange}/>
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="special_health_check_type">特殊健康診断の種類</label>
                        <p className="mb-2 text-xs">じん肺、有機溶剤、鉛、電離放射線、特定化学物質、高気圧業務、四アルキル鉛、石綿など</p>
                        <input className="w-full px-4 py-2 border rounded-lg" type="text" id="special_health_check_type" value={formData.special_health_check_type} onChange={handleChange}/>
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="sending_education_date">送り出し教育 実施年月日</label>
                        <input className="w-full px-4 py-2 border rounded-lg" type="date" id="sending_education_date" value={formData.sending_education_date} onChange={handleChange}/>
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="receiving_education_date">受入教育 実施年月日</label>
                        <input className="w-full px-4 py-2 border rounded-lg" type="date" id="receiving_education_date" value={formData.receiving_education_date} onChange={handleChange}/>
                    </div>

                    {/* 通常時登録でもnullable */}
                    <div className="mb-4">
                        <label className="block font-bold mb-2" htmlFor="skill_id">技能者ID <span className="text-red-500 text-xs">※ 建設キャリアアップシステムに登録している場合記入してください</span></label>
                        <input className="w-full px-4 py-2 border rounded-lg" type="number" id="skill_id" value={formData.skill_id} onChange={handleChange} />
                    </div>

                    </>
                )}

                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">登録</button>
                </div>
            </form>
        </div>
    );
};

export default InspectorRegisterForm;
