export type Shutter = {
    id?: string;
    company_id: string;
    site_id: string;
    name: string;
    model_number: string;
    created_at?: string;
    updated_at?: string;
};

export const shutterFields = [
    { id: "name", label: "シャッター名" },
    { id: "model_number", label: "型番号" }
];