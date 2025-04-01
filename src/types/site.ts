export type Site = {
    id?: string; // UUID
    company_id: string; // 会社ID
    name: string; // 現場名
    furigana?: string; // 現場名フリガナ
    address: string; // 現場住所
    purpose?: string; // 現場の用途
    owner_name: string; // オーナー名
    owner_furigana?: string; // オーナー名フリガナ
    owner_post_number?: string; // オーナー郵便番号
    owner_address: string; // オーナー住所
    owner_phone_number?: string; // オーナー電話番号
    manager_name?: string; // 管理者名
    manager_furigana?: string; // 管理者名フリガナ
    manager_post_number?: string; // 管理者郵便番号
    manager_address?: string; // 管理者住所
    manager_phone_number?: string; // 管理者電話番号
    num_floors_above?: number; // 階数（地上階数）
    num_floors_below?: number; // 階数（地下階数）
    building_area?: number; // 建築面積（㎡）
    total_floor_area?: number; // 延べ面積（㎡）
    confirmation_certificate_date?: string; // 確認済証交付年月日
    confirmation_certificate_number?: string; // 確認済証番号
    is_confirmation_by_building_officer?: boolean; // 確認済証交付者_建築主事等
    is_confirmation_by_agency?: boolean; // 確認済証交付者_指定機関
    confirmation_agency_name?: string; // 確認済証交付者_指定機関名
    inspection_certificate_date?: string; // 検査済証交付年月日
    inspection_certificate_number?: string; // 検査済証番号
    is_inspection_by_building_officer?: boolean; // 検査済証交付者_建築主事等
    is_inspection_by_agency?: boolean; // 検査済証交付者_指定機関
    inspection_agency_name?: string; // 検査済証交付者_指定機関名
    created_at?: string; // 作成日時
    updated_at?: string; // 更新日時
};

export const siteFields = [
    // 現場名（必須）
    { id: "name", label: "現場名", required: true, validation: (value: string) => value.trim() !== "" },
    // 現場名フリガナ（必須）
    { id: "furigana", label: "現場名フリガナ", required: true, validation: (value: string) => value.trim() !== "" },
    // 所在地（必須）
    { id: "address", label: "所在地", required: true, validation: (value: string) => value.trim() !== "" },
    // 現場の用途（必須）
    { id: "purpose", label: "現場の用途", required: true, validation: (value: string) => value.trim() !== "" },
    // オーナー名（必須）
    { id: "owner_name", label: "オーナー名", required: true, validation: (value: string) => value.trim() !== "" },
    // オーナー名フリガナ（必須）
    { id: "owner_furigana", label: "オーナー名フリガナ", required: true, validation: (value: string) => value.trim() !== "" },
    // オーナー郵便番号（7桁の数字である必要あり）
    { id: "owner_post_number", label: "オーナー郵便番号", required: true, validation: (value: string) => /^[0-9]{7}$/.test(value) },
    // オーナー住所（必須）
    { id: "owner_address", label: "オーナー住所", required: true, validation: (value: string) => value.trim() !== "" },
    // オーナー電話番号（半角数字・ハイフンのみ許可）
    { id: "owner_phone_number", label: "オーナー電話番号", required: true, validation: (value: string) => /^[0-9-]+$/.test(value) },
    // 管理者名（必須）
    { id: "manager_name", label: "管理者名", required: true, validation: (value: string) => value.trim() !== "" },
    // 管理者名フリガナ（必須）
    { id: "manager_furigana", label: "管理者名フリガナ", required: true, validation: (value: string) => value.trim() !== "" },
    // 管理者郵便番号（7桁の数字である必要あり）
    { id: "manager_post_number", label: "管理者郵便番号", required: true, validation: (value: string) => /^[0-9]{7}$/.test(value) },
    // 管理者住所（必須）
    { id: "manager_address", label: "管理者住所", required: true, validation: (value: string) => value.trim() !== "" },
    // 管理者電話番号（半角数字・ハイフンのみ許可）
    { id: "manager_phone_number", label: "管理者電話番号", required: true, validation: (value: string) => /^[0-9-]+$/.test(value) },
    // 階数（地上）（0 以上の数値である必要あり）
    { id: "num_floors_above", label: "階数（地上）", type: "number", required: true, validation: (value: number) => value >= 0 },
    // 階数（地下）（0 以上の数値である必要あり）
    { id: "num_floors_below", label: "階数（地下）", type: "number", required: true, validation: (value: number) => value >= 0 },
    // 建築面積（㎡）（0 より大きく、小数点以下 2 桁以内である必要あり）
    {
        id: "building_area",
        label: "建築面積（㎡）",
        type: "number",
        required: true,
        validation: (value: number) => value > 0 && /^\d+(\.\d{1,2})?$/.test(String(value)),
    },
    // 延べ面積（㎡）（0 より大きく、小数点以下 2 桁以内である必要あり）
    {
        id: "total_floor_area",
        label: "延べ面積（㎡）",
        type: "number",
        required: true,
        validation: (value: number) => value > 0 && /^\d+(\.\d{1,2})?$/.test(String(value)),
    },
    // 確認済証交付年月日（有効な日付形式である必要あり）
    { id: "confirmation_certificate_date", label: "確認済証交付年月日", type: "date", required: true, validation: (value: string) => !!Date.parse(value) },
    // 確認済証番号（必須）
    { id: "confirmation_certificate_number", label: "確認済証番号", required: true, validation: (value: string) => value.trim() !== "" },
    // 確認済証交付者_建築主事等（チェックボックス：true/false）
    {
        id: "is_confirmation_by_building_officer",
        label: "確認済証交付者_建築主事等",
        type: "checkbox",
        required: false
    },
    // 確認済証交付者_指定機関（チェックボックス：true/false）
    {
        id: "is_confirmation_by_agency",
        label: "確認済証交付者_指定機関",
        type: "checkbox",
        required: false
    },
    // 確認済証交付者_指定機関名（任意）
    {
        id: "confirmation_agency_name",
        label: "確認済証交付者_指定機関名",
        required: false,
        validation: (value: string) => value === "" || value.trim() !== "",
    },
    // 検査済証交付年月日（有効な日付形式である必要あり）
    { id: "inspection_certificate_date", label: "検査済証交付年月日", type: "date", required: true, validation: (value: string) => !!Date.parse(value) },
    // 検査済証番号（必須）
    { id: "inspection_certificate_number", label: "検査済証番号", required: true, validation: (value: string) => value.trim() !== "" },
    // 検査済証交付者_建築主事等（チェックボックス：true/false）
    {
        id: "is_inspection_by_building_officer",
        label: "検査済証交付者_建築主事等",
        type: "checkbox",
        required: false
    },
    // 検査済証交付者_指定機関（チェックボックス：true/false）
    {
        id: "is_inspection_by_agency",
        label: "検査済証交付者_指定機関",
        type: "checkbox",
        required: false
    },
    // 検査済証交付者_指定機関名（任意）
    {
        id: "inspection_agency_name",
        label: "検査済証交付者_指定機関名",
        required: false,
        validation: (value: string) => value === "" || value.trim() !== "",
    },
];
