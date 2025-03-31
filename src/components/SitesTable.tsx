"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { useSites } from "@/lib/hooks/useSites";
import SiteEditForm from "@/components/SiteEditForm";
import { useSiteCompanies } from "@/lib/hooks/useSiteCompanies";

const SitesTable = ({ sites, company, permittedCompanies }) => {
    const { fetchSiteCompanies, siteCompanies } = useSiteCompanies();
    const [siteData, setSiteData] = useState([]);
    const [isSiteEditModalOpen, setIsSiteEditModalOpen] = useState(false);
    const [selectedSite, setSelectedSite] = useState(null);
    const { deleteSite } = useSites();

    // 初回マウント時に `fetchSiteCompanies` を実行
    useEffect(() => {
        if (sites.length > 0) {
            sites.forEach((site) => {
                fetchSiteCompanies(site.id);
            });
        }
    }, [sites]);

    // `siteCompanies` の変更を監視し、`siteData` を更新
    useEffect(() => {
        if (!siteCompanies) return;
    
        const updatedSites = sites.map((site) => {
            const companies = siteCompanies.filter(c => c.site_id === site.id);
    
            // `role` を数値化してソート（管理会社は除外）
            const sortedCompanies = companies;
    
            return { ...site, site_companies: sortedCompanies };
        });
    
        setSiteData(updatedSites);
    }, [siteCompanies, sites]);

    // ✅ モーダル表示ハンドラー
    const handleViewRecordEdit = (record) => {
        setSelectedSite(record);
        setIsSiteEditModalOpen(true);
    };

    // ✅ 削除ハンドラー
    const handleDeleteRecord = async (id) => {
        const isConfirmed = confirm("本当にこの現場を削除しますか？");
        if (!isConfirmed) return;

        try {
            const result = await deleteSite(id);

            if (result.success) {
                alert("✅ 現場を削除しました。");
                window.location.reload();
            } else {
                alert(`⚠️ 削除に失敗しました: ${result.error}`);
            }
        } catch (error) {
            console.error("削除エラー:", error);
            alert("⚠️ 削除時にエラーが発生しました。");
        }
    };

    return (
        <div className="">
            <Modal
                isOpen={isSiteEditModalOpen}
                onClose={() => setIsSiteEditModalOpen(false)}
            >
                {selectedSite && (
                    <SiteEditForm
                        site={selectedSite}
                        company={company}
                        permittedCompanies={permittedCompanies}
                        onClose={() => setIsSiteEditModalOpen(false)}
                    />
                )}
            </Modal>
            <div className="flex text-xs md:text-base">
                <table className="border-collapse border border-gray-300 text-center">
                    <thead className="text-gray-700">
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-2 py-1 min-w-[50px] md:min-w-[70px]">番号</th>
                            <th className="border border-gray-300 px-0 py-0 min-w-[100px] md:min-w-[150px]">現場名</th>
                        </tr>
                    </thead>
                    <tbody>
                        {siteData.map((site, index) => (
                            <tr key={site.id} className="bg-gray-200">
                                <td className="border border-gray-300 px-0 py-0 h-[100px]">
                                    <div className="w-full h-full flex flex-col">
                                        <div className="border-b border-gray-300 border-dashed text-center px-2 flex-1 flex items-center justify-center">
                                            {index+1}
                                        </div>
                                        <div className="text-center px-2 flex-1 flex items-center justify-center">
                                            {/* ✏️ 編集ボタン（未実装） */}
                                            <button
                                                className="block ml-2 text-yellow-500 hover:text-yellow-700 text-lg"
                                                title="編集"
                                                onClick={() => handleViewRecordEdit(site)}
                                            >
                                                ✏️
                                            </button>
                                            {/* 🗑️ 削除ボタン（未実装） */}
                                            <button
                                                className="block ml-2 text-red-500 hover:text-red-700 text-lg"
                                                title="削除"
                                                onClick={() => handleDeleteRecord(site.id)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                <td className="border border-gray-300 px-0 py-0 h-[100px]">
                                    <div className="overflow-hidden line-clamp-3">{site.name}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                <div className="overflow-y-auto">
                    <table className="w-full border-collapse border border-gray-300 text-center">
                        <thead className="text-gray-700">
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-2 py-1 min-w-[100px] md:min-w-[150px]">オーナー名</th>
                                <th className="border border-gray-300 px-2 py-1 min-w-[100px] md:min-w-[150px]">住所</th>
                            </tr>
                        </thead>
                        <tbody>
                            {siteData.map((site) => (
                                <tr key={site.id} className="bg-white">
                                    <td className="border border-gray-300 px-2 py-1 h-[100px]"><div className="overflow-hidden line-clamp-3">{site.owner_name}</div></td>
                                    <td className="border border-gray-300 px-2 py-1 h-[100px]"><div className="overflow-hidden line-clamp-3">{site.address}</div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SitesTable;
