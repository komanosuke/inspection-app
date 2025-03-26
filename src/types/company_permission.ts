export type CompanyPermission = {
    id?: string;
    granter_company_id: string;
    receiver_company_id: string;
    view_inspectors: boolean;
    view_inspectors_status: string;
    created_at?: string;
    updated_at?: string;
};
