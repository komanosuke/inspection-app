"use client";

import React, { useState, useEffect } from "react";
import CompanySelection from "./CompanySelection";
import { useSites } from "@/lib/hooks/useSites";
import { useSiteCompanies } from "@/lib/hooks/useSiteCompanies";
import { Site } from "@/types/site";

const SiteEditForm = ({ onClose, site, company, permittedCompanies }: { onClose: () => void; site: Site; company: any; permittedCompanies: any[]; }) => {
    const { updateSite } = useSites();
    const { fetchSiteCompanies, siteCompanies, createSiteCompany, deleteSiteCompany } = useSiteCompanies();
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [formData, setFormData] = useState({
        company_id: "", // ログイン会社（管理会社）
        name: "",
        owner_name: "",
        address: "",
    });

    // ✅ 初期データ設定
    useEffect(() => {
        if (site) {
            setFormData({
                company_id: site.company_id || company.id,
                name: site.name || "",
                owner_name: site.owner_name || "",
                address: site.address || "",
            });
            fetchSiteCompanies(site.id); // 会社情報をフェッチ
        }
    }, [site, company]);

    // ✅ `siteCompanies` から協力会社をセット
    useEffect(() => {
        if (siteCompanies && siteCompanies?.length > 0 && permittedCompanies?.length > 0) {
            // ✅ `siteCompanies` の `company_id` に一致する `permittedCompanies` を見つける
            const matchedCompanies = permittedCompanies.filter((company) =>
                siteCompanies.some((siteCompany) => String(siteCompany.company_id) === String(company.id))
            );
    
            if (matchedCompanies.length > 0) {
                // ✅ 最初にマッチした会社を `selectedCompany` にセット
                setSelectedCompany(matchedCompanies[0]);
            } else {
                console.warn("⚠️ 一致する協力会社が見つかりませんでした。");
            }
        }
    }, [siteCompanies, permittedCompanies]);
    

    // ✅ 入力変更時
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
            // **Step 1: 現場 (`sites`) を更新**
            const { success, data } = await updateSite(site.id, formData);
            if (!success) throw new Error();

            const newSiteId = data[0]?.id; // 更新された現場ID
            console.log("✅ 現場更新成功! site_id:", newSiteId);

            // **Step 2: `site_companies` を更新**
            console.log("🚀 Step 2: `site_companies` 更新開始");

            // **Step 2: `site_companies` の更新**
            console.log("🚀 Step 2: `site_companies` を更新");

            const currentCompanyId = siteCompanies[0]?.company_id;
            const newCompanyId = selectedCompany?.id;

            if (currentCompanyId !== newCompanyId) {
                // 協力会社が変更された場合のみ更新
                if (currentCompanyId) {
                    // 旧協力会社の削除
                    const deleteResult = await deleteSiteCompany(currentCompanyId);
                    if (!deleteResult.success) {
                        throw new Error(deleteResult.message);
                    }
                }

                if (newCompanyId) {
                    // 新協力会社の追加
                    const createResult = await createSiteCompany({
                        site_id: site.id,
                        company_id: newCompanyId,
                    });
                    if (!createResult.success) {
                        throw new Error(createResult.message);
                    }
                }
            }

            alert("✅ 現場情報を更新しました！");
            onClose(); // モーダルを閉じる
            window.location.reload();
        } catch (error: any) {
            console.error("❌ 登録エラー:", error.message);
            alert(`エラー: ${error.message}`);
        }
    };

    return (
        <div className="md:p-6">
            <h1 className="text-2xl font-bold mb-4">現場情報編集</h1>
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
                        selectedCompany={selectedCompany}
                        setSelectedCompany={setSelectedCompany}
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

                        {/* 更新ボタン */}
                        <div className="flex justify-end">
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                更新
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default SiteEditForm;
