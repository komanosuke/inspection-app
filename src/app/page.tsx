"use client";

import { useEffect, useState } from "react";
import { useSites } from "@/lib/hooks/useSites";
import { useInspectors } from "@/lib/hooks/useInspectors";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSiteCompanies } from "@/lib/hooks/useSiteCompanies";
import LoginCheck from "@/components/LoginCheck";

const StatisticsCards = () => {
    const [showCompanyAlertMessage, setShowCompanyAlertMessage] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<any[]>([]);

    const { sites, fetchSites, loading: sitesLoading } = useSites();
    const { inspectors, fetchInspectors } = useInspectors();
    const { siteCompanies, fetchSiteCompanies } = useSiteCompanies();
    const { getUserId } = useAuth();

    useEffect(() => {
        const fetchUserId = async () => {
            const uid = await getUserId();
            if (!uid) {
                console.error("❌ ユーザーIDが見つかりません。");
                alert("ユーザーIDが見つかりません。");
                setShowCompanyAlertMessage(true);
                return;
            }
            setUserId(uid);
            setShowCompanyAlertMessage(false);
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchSites(undefined, userId);
            fetchSiteCompanies();
            fetchInspectors(undefined, userId);
        }
    }, [userId]);
    
    useEffect(() => {
        if (sites && inspectors && siteCompanies) {
            const structuredData = sites.map(site => {
                const sortedCompanies = siteCompanies;
                
                return {
                    site,
                    inspectors,
                    companies: sortedCompanies
                };
            });

            setDashboardData(structuredData);
        }
    }, [sites, inspectors, siteCompanies]);

    return (
        <LoginCheck>
            <div className="p-8">
                {showCompanyAlertMessage && (
                    <div className="border border-red-500 p-4 mb-4 text-red-500 font-bold text-center rounded-lg">
                        まず会社情報を登録してください。
                        <a href="/profile" className="font-normal bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                            登録する
                        </a>
                    </div>
                )}

                {sitesLoading ? (
                    <p className="bg-white p-4 md:p-8 shadow rounded-lg text-center">読み込み中...</p>
                ) : dashboardData.length === 0 ? (
                    <p className="bg-white p-4 md:p-8 shadow rounded-lg text-center">まだ現場が登録されていません</p>
                ) : (
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        {dashboardData.map(({ site, inspectors, companies }, index) => (
                            <div key={index} className="bg-white p-6 shadow rounded-lg">
                                <p className="text-gray-600">{site.name}</p>
                                {companies.map((company, idx) => (
                                    <p key={idx} className="text-sm">{company.role} 現場代理人: {company.manager}</p>
                                ))}
                                {/* <p>{site.location}</p> */}

                                <div className="mt-4 border-t pt-2">
                                    <p className="text-sm font-semibold">検査者（記録？）:</p>
                                    {inspectors.length > 0 ? (
                                        <ul className="list-disc list-inside text-sm">
                                            {inspectors.map(inspector => (
                                                <li key={inspector.id}>{inspector.name}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 text-sm">検査者が登録されていません</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </LoginCheck>
    );
};

export default StatisticsCards;
