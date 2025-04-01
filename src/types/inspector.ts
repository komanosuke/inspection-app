export type Inspector = {
    id?: string;
    company_id: string;
    name: string;
    inspector_number?: string;
    furigana: string;
    architect_name?: string;
    architect_registration_name?: string;
    architect_registration_number?: string;
    fire_protection_inspector_number?: string;
    workplace_name: string;
    architect_office_name?: string;
    governor_registration_name?: string;
    governor_registration_number?: string;
    post_number: string;
    address: string;
    phone_number: string;
    created_at?: string;
    updated_at?: string;
};

export const inspectorFields = [
    // 検査者名（必須）
    { id: "name", label: "検査者名", required: true, validation: (value: string) => value.trim() !== "" },
    // 氏名のフリガナ（必須）
    { id: "furigana", label: "氏名のフリガナ", required: true, validation: (value: string) => value.trim() !== "" },
    // 郵便番号（必須, 7桁の数字）
    { id: "post_number", label: "郵便番号", required: true, validation: (value: string) => /^[0-9]{7}$/.test(value) },
    // 所在地（必須）
    { id: "address", label: "所在地", required: true, validation: (value: string) => value.trim() !== "" },
    // 電話番号（必須, 半角数字・ハイフンのみ）
    { id: "phone_number", label: "電話番号", required: true, validation: (value: string) => /^[0-9-]+$/.test(value) },
    // 検査者番号（必須）
    { id: "inspector_number", label: "検査者番号", required: true, validation: (value: string) => value === "" || value.trim() !== "" },
    // 勤務先名（必須）
    { id: "workplace_name", label: "勤務先名", required: true, validation: (value: string) => value.trim() !== "" },
];
