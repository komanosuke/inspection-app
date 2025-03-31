"use client";

import { useState } from "react";
import { Company } from "@/types/company";
import { useCompanies } from "@/lib/hooks/useCompanies";

interface CompanyForPermissionSelectionProps {
    selectedCompanies: Company[];
    setSelectedCompanies: (companies: Company[]) => void;
}

export default function CompanyForPermissionSelection({
    selectedCompanies,
    setSelectedCompanies,
}: CompanyForPermissionSelectionProps) {
    const { fetchCompanyById } = useCompanies(); // ✅ `fetchCompanyById` を使用
    const [companyId, setCompanyId] = useState("");
    const [searchError, setSearchError] = useState<string | null>(null);

    // ✅ **会社検索処理**
    const handleCompanySearch = async () => {
        if (!companyId.trim()) return;

        const foundCompany = await fetchCompanyById(companyId);
        if (!foundCompany) {
            setSearchError("会社が見つかりませんでした。");
            return;
        }

        // ✅ 既に追加済みかどうか確認
        if (selectedCompanies.some((c) => c.id === foundCompany.id)) {
            setSearchError("この会社はすでに選択されています。");
            return;
        }

        setSelectedCompanies([...selectedCompanies, foundCompany]);
        setCompanyId(""); // ✅ 入力リセット
        setSearchError(null); // ✅ エラーリセット
    };

    // ✅ **選択済みの会社を解除**
    const removeSelectedCompany = (companyId: string) => {
        setSelectedCompanies(selectedCompanies.filter((c) => c.id !== companyId));
    };

    return (
        <div className="mb-4">
            <label className="block font-bold mb-2">会社IDで検索</label>
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="会社IDを入力"
                />
                <button
                    type="button"
                    onClick={handleCompanySearch}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-32"
                >
                    検索
                </button>
            </div>
            {searchError && <p className="text-red-500 text-sm mt-1">{searchError}</p>}

            <ul className="mt-2">
                {selectedCompanies.map((company) => (
                    <li
                        key={company.id}
                        className="flex justify-between items-center border p-2 rounded my-1 bg-gray-200"
                    >
                        {company.name}
                        <button
                            onClick={() => removeSelectedCompany(company.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                            解除
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
