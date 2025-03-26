"use client";

import React from "react";
import CompanyCheckbox from "./CompanyCheckbox"; // ✅ 新コンポーネントをインポート

const CompanySelection = ({ selectedCompanies, setSelectedCompanies, permittedCompanies }) => {
    // ✅ 会社の選択・解除
    const toggleCompanySelection = (company) => {
        setSelectedCompanies((prev) => {
            const isSelected = prev.some((c) => c.id === company.id);
            if (isSelected) {
                return prev.filter((c) => c.id !== company.id); // 選択解除
            } else {
                return [...prev, { 
                    id: company.id, 
                    name: company.name,
                    view_inspectors: company.view_inspectors, // boolean
                }];
            }
        });
    };

    return (
        <div className="border rounded-lg p-4 mb-4">
            {/* ✅ チェックボックス形式で会社を選択 */}
            {permittedCompanies.map((company, index) => (
                <CompanyCheckbox
                    key={company.id}
                    company={company}
                    selectedCompanies={selectedCompanies}
                    toggleCompanySelection={toggleCompanySelection}
                    isLast={index === permittedCompanies.length - 1}
                />
            ))}
        </div>
    );
};

export default CompanySelection;
