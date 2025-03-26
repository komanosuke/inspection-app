export type InspectionRecord = {
    id?: string;
    shutter_id?: string | null;
    inspection_date: string; // YYYY-MM-DD
    lead_inspector: string;
    sub_inspector_1?: string;
    sub_inspector_2?: string;
    created_at?: string;
    updated_at?: string;
};