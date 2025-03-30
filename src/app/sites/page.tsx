"use client";

import React, { useState, useEffect } from "react";
import LoginCheck from "@/components/LoginCheck";
import SitesTable from "@/components/SitesTable";
import Modal from "@/components/Modal";
import SiteRegisterForm from "@/components/SiteRegisterForm";
import { useCompanies } from "@/lib/hooks/useCompanies";
import { useSites } from "@/lib/hooks/useSites";
import { useCompanyPermissions } from "@/lib/hooks/useCompanyPermissions";

const SitesPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [permittedCompanies, setPermittedCompanies] = useState([]);
    
    const { fetchMyCompany, fetchCompanies, myCompany, companies, loading: companyLoading } = useCompanies();
    const { fetchMyCompanyPermissions, myCompanyPermissions } = useCompanyPermissions();
    const { fetchSites, sites, loading: sitesLoading } = useSites();
    const [userCompanyId, setUserCompanyId] = useState<string | null>(null);

    useEffect(() => {
        const user_id = localStorage.getItem("user_id");
        setUserCompanyId(user_id);
    }, []);

    useEffect(() => {
        if (userCompanyId) {
            fetchMyCompany(userCompanyId);
            fetchCompanies(userCompanyId);
            fetchMyCompanyPermissions(userCompanyId);
            fetchSites(undefined, userCompanyId);
        }
    }, [userCompanyId]);

    useEffect(() => {
        if (myCompanyPermissions) {
            // 許可された会社のID一覧を抽出
            const permittedCompanyIds = myCompanyPermissions.map(p => p.granter_company_id);
            // console.log("myCompanyPermissions: ", myCompanyPermissions);
            // console.log("permittedCompanyIds: ", permittedCompanyIds);
            // console.log("companies: ", companies);
            
            // 許可された会社の情報を `fetchCompanies` の結果からフィルタリングし、view_inspectors を追加
            const permittedCompaniesList = (companies || []).filter(c => 
                permittedCompanyIds.includes(c.id)
            ).map(company => {
                // 対応する permission を見つけて view_inspectors を取得
                const permission = myCompanyPermissions.find(p => p.granter_company_id === company.id);
                return {
                    ...company,
                    view_inspectors: permission ? permission.view_inspectors : false // デフォルト値を false にする
                };
            });
            setPermittedCompanies(permittedCompaniesList);
        }
    }, [myCompanyPermissions, companies]); // ✅ `myCompanyPermissions` & `companies` の変更を検知    

    return (
        <LoginCheck>
            <div className="bg-white p-4 md:p-8 shadow rounded-lg">
                <div className="sm:flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold mb-2 sm:mb-0">現場一覧</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        ＋ 新規作成
                    </button>
                </div>

                {/* 🔄 ローディング表示 */}
                {companyLoading && <></>}
                {sitesLoading && <div className="text-center p-6">🔄 現場データを取得中...</div>}

                {/* ✅ 会社情報がない場合の警告メッセージ */}
                {!companyLoading && !myCompany && (
                    <div className="text-center text-red-500 p-4 border border-red-500 rounded-md">
                        会社情報が登録されていません。<br />
                        <a href="/profile" className="text-blue-500 hover:underline">会社情報を登録する</a>
                    </div>
                )}

                {/* ✅ 現場一覧テーブル */}
                {!sitesLoading && sites && sites.length > 0 ? (
                    <SitesTable sites={sites} />
                ) : (
                    !sitesLoading && (
                        <div className="text-center p-6">📂 現場データがありません</div>
                    )
                )}

                {/* モーダル（新規登録） */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <SiteRegisterForm 
                        company={myCompany}
                        permittedCompanies={permittedCompanies} // 自分以外の許可された会社一覧を渡す
                        onClose={() => setIsModalOpen(false)} 
                    />
                </Modal>
            </div>
        </LoginCheck>
    );
};

export default SitesPage;
