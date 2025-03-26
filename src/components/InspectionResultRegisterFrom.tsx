import React from "react";
import { InspectionResult } from "@/types/inspection_result";

type Props = {
    index: number;
    result: InspectionResult;
    onChange: (index: number, updated: Partial<InspectionResult>) => void;
};

const InspectionResultRegisterFrom: React.FC<Props> = ({ index, result, onChange }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target;
        onChange(index, { [name]: type === "checkbox" ? checked : value });
    };

    return (
        <div className="mb-6 border p-4 rounded-md shadow">
            <div className="font-semibold mb-2">
                {result.main_category} / {result.sub_category} / {result.inspection_name}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center">
                    <input type="checkbox" name="target_existence" checked={result.target_existence} onChange={handleInputChange} />
                    <span className="ml-2">対象あり</span>
                </label>
                <label className="flex items-center">
                    <input type="checkbox" name="no_issue" checked={result.no_issue || false} onChange={handleInputChange} />
                    <span className="ml-2">指摘なし</span>
                </label>
                <label className="flex items-center">
                    <input type="checkbox" name="needs_correction" checked={result.needs_correction || false} onChange={handleInputChange} />
                    <span className="ml-2">要是正</span>
                </label>
                <label className="flex items-center">
                    <input type="checkbox" name="existing_non_compliance" checked={result.existing_non_compliance || false} onChange={handleInputChange} />
                    <span className="ml-2">既存不適格</span>
                </label>
            </div>

            <textarea
                name="situation_measures"
                className="w-full mt-4 p-2 border rounded"
                placeholder="状況、対策等"
                value={result.situation_measures || ""}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default InspectionResultRegisterFrom;
