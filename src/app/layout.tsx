"use client";

import "./globals.css";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCompanies } from "@/lib/hooks/useCompanies";


const Layout = ({ children }: { children: React.ReactNode }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { getUserId } = useAuth();
    const { fetchMyCompanyType, myCompanyType } = useCompanies();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const fetchCompanyType = async () => {
            const userId = await getUserId();
            if (!userId) return;
            await fetchMyCompanyType(userId);
        }
        fetchCompanyType();
    }, [myCompanyType]);

    return (
        <html lang="ja">
            <body className="bg-gray-100 text-gray-700">
                <div className="flex h-screen relative">
                    {/* サイドバー */}
                    <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} myCompanyType={myCompanyType} />

                    {/* メインコンテンツ */}
                    <div 
                        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
                            isSidebarOpen ? "md:ml-64" : "md:ml-0"
                        }`}
                    >
                        <main className="flex-1 overflow-auto">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
};

export default Layout;
