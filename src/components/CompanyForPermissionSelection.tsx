"use client";

import { useState } from "react";
import { Company } from "@/types/company";

interface CompanyForPermissionSelectionProps {
    availableCompanies: Company[];
    selectedCompanies: Company[];
    setSelectedCompanies: (companies: Company[]) => void;
}

export default function CompanyForPermissionSelection({
    availableCompanies,
    selectedCompanies,
    setSelectedCompanies,
}: CompanyForPermissionSelectionProps) {
    const [selectedCompanyId, setSelectedCompanyId] = useState("");

    const handleCompanySelect = (companyId: string) => {
        if (!companyId) return; // 空の値は無視

        const selectedCompany = availableCompanies.find((c) => c.id === companyId);
        if (selectedCompany && !selectedCompanies.some((c) => c.id === selectedCompany.id)) {
            setSelectedCompanies([...selectedCompanies, selectedCompany]);
        }

        setSelectedCompanyId(""); // 選択後にリセット
    };

    const removeSelectedCompany = (companyId: string) => {
        setSelectedCompanies(selectedCompanies.filter((c) => c.id !== companyId));
    };

    return (
        <div className="mb-4">
            <label className="block font-bold mb-2">自社検査者の閲覧を許可する会社</label>
            <select
                className="w-full p-2 border rounded"
                value={selectedCompanyId}
                onChange={(e) => {
                    setSelectedCompanyId(e.target.value);
                    handleCompanySelect(e.target.value);
                }}
            >
                <option value="">会社を選択</option>
                {availableCompanies.map((company) => (
                    <option key={company.id} value={company.id}>
                        {company.name}
                    </option>
                ))}
            </select>

            <ul className="mt-2">
                {selectedCompanies.map((company) => (
                    <li key={company.id} className="flex justify-between items-center border p-2 rounded my-1 bg-gray-200">
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
