export type InspectionResult = {
    id?: string;
    inspection_record_id?: string | null;
    inspection_number: string;
    main_category: string;
    sub_category?: string;
    inspection_name: string;
    target_existence: boolean;
    no_issue?: boolean;
    needs_correction?: boolean;
    existing_non_compliance?: boolean;
    situation_measures?: string;
    inspector_number: string;
    created_at?: string;
    updated_at?: string;
};