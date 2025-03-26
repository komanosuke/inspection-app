"use client";

import React, { useState } from "react";
import CompanySelection from "./CompanySelection";
import InspectorsSelection from "./InspectorsSelection";
import { useSites } from "@/lib/hooks/useSites";
import { useSiteCompanies } from "@/lib/hooks/useSiteCompanies";

const SiteRegisterForm = ({ onClose, company, permittedCompanies }: { onClose: () => void; company: any; permittedCompanies: any[]; }) => {
    const { createSite } = useSites();
    const { createSiteCompany } = useSiteCompanies();

    const [formData, setFormData] = useState({
        company_id: company.id, // ログイン会社（管理会社）
        name: "",
        owner_name: "",
        address: "",
    });

    const [selectedCompanies, setSelectedCompanies] = useState<any[]>([]);
    const [selectedInspectors, setSelectedInspectors] = useState<any[]>([]);

    const handleSiteDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSiteDataSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // console.log("📤 登録データ:", formData);
        // console.log("selectedCompanies: ", selectedCompanies);
        // console.log("selectedInspectors: ", selectedInspectors);
        // データ確認中のため一時的にここで終了
        // return;

        try {
            // **Step 1: 現場 (`sites`) を作成**
            const { success, data, message } = await createSite(formData);
            if (!success) throw new Error(message);

            const newSiteId = data[0]?.id; // 作成された現場ID
            console.log("✅ 現場作成成功! site_id:", newSiteId);

            // **Step 2: `site_companies` に「ログインしている会社」を登録**
            console.log("🚀 Step 2: `site_companies` にログイン会社を登録");
            const mainCompanyResult = await createSiteCompany({
                site_id: newSiteId,
                company_id: formData.company_id
            });
            if (!mainCompanyResult.success) {
                console.error("❌ createSiteCompany (管理会社) エラー:", mainCompanyResult.message);
                throw new Error(mainCompanyResult.message);
            }

            // **Step 3: `site_companies` に「選択した協力会社」を登録**
            console.log("🚀 Step 3: `site_companies` に協力会社を登録");
            for (const company of selectedCompanies) {
                if (company.id && company.role) {
                    const result = await createSiteCompany({
                        site_id: newSiteId,
                        company_id: company.id,
                    });
                    if (!result.success) {
                        console.error(`❌ createSiteCompany (${company.name}) エラー:`, result.message);
                        throw new Error(result.message);
                    }
                }
            }

            alert("✅ 現場を登録しました！");
            onClose(); // 登録後にモーダルを閉じる
            window.location.reload();
        } catch (error: any) {
            console.error("❌ 登録エラー:", error.message);
            alert(`エラー: ${error.message}`);
        }
    };

    return (
        <div className="md:p-6">
            <h1 className="text-2xl font-bold mb-4">現場情報登録</h1>
            {/* <CreateUserForm /> */}
            <form onSubmit={handleSiteDataSubmit}>
                <h2 className="text-lg font-bold mb-2">管理会社</h2>
                <p className="mb-4">{ company.name }</p>

                <h2 className="text-lg font-bold mb-2">協力会社</h2>
                {/* 🚨 協力会社がいない場合の警告メッセージ */}
                {permittedCompanies.length === 0 ? (
                    <p className="border border-red-500 text-red-500 p-4 mb-4 rounded-lg">
                        協力会社が登録されていません。協力会社に当アプリのアカウント作成を依頼してください。
                    </p>
                ) : (
                    // 会社選択コンポーネント
                    <CompanySelection
                        selectedCompanies={selectedCompanies}
                        setSelectedCompanies={setSelectedCompanies}
                        permittedCompanies={permittedCompanies}
                    />
                )}

                {permittedCompanies.length !== 0 && (
                    <>
                        {/* 現場名 */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">現場名（必須）</label>
                            <input 
                                className="w-full px-4 py-2 border rounded-lg" 
                                type="text" 
                                id="name" 
                                value={formData.name} 
                                onChange={handleSiteDataChange} 
                                required
                            />
                        </div>

                        {/* オーナー名 */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="owner_name">オーナー名（必須）</label>
                            <input 
                                className="w-full px-4 py-2 border rounded-lg" 
                                type="text" 
                                id="owner_name" 
                                value={formData.owner_name} 
                                onChange={handleSiteDataChange} 
                                required
                            />
                        </div>

                        {/* 所在地 */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="address">所在地（必須）</label>
                            <input 
                                className="w-full px-4 py-2 border rounded-lg" 
                                type="text" 
                                id="address" 
                                value={formData.address} 
                                onChange={handleSiteDataChange} 
                                required
                            />
                        </div>

                        {/* 登録ボタン */}
                        <div className="flex justify-end">
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                登録
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default SiteRegisterForm;
