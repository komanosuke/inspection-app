// app/lib/hooks/useCompanies.ts
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Company } from "@/types/company";

export function useCompanies() {
    const [companies, setCompanies] = useState<Company[] | null>(null);
    const [myCompany, setMyCompany] = useState<Company | null>(null);
    const [myCompanyType, setMyCompanyType] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ **自分の会社情報を取得**
    const fetchMyCompany = async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from("companies")
                .select("*")
                .eq("id", userId)
                .single();

            if (error) throw error;
            setMyCompany(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // // ✅ **自分以外の会社情報を取得**
    // const fetchCompanies = async (excludeId: string) => {
    //     setLoading(true);
    //     setError(null);
    //     try {
    //         const { data, error } = await supabase
    //             .from("companies")
    //             .select("*")
    //             .not("id", "eq", excludeId);

    //         if (error) throw error;
    //         setCompanies(data);
    //     } catch (error: any) {
    //         setError(error.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // ✅ **自分以外の会社情報を取得（id, name, representative_name のみ）**
    const fetchCompanies = async (excludeId: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from("companies")
                .select("id, name, representative_name")
                .not("id", "eq", excludeId);

            if (error) throw error;
            setCompanies(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ **自分の会社のタイプ（type）だけを取得**
    const fetchMyCompanyType = async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from("companies")
                .select("type")
                .eq("id", userId)
                .single();

            if (error) throw error;
            setMyCompanyType(data.type || null);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const createCompany = async (company: Company) => {
        try {
            const { data, error } = await supabase.from("companies").insert([company]).select("*");;
            if (error) throw error;
            setCompanies((prev) => (prev ? [...prev, data[0]] : [data[0]]));
            return { success: true, data };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const updateCompany = async (companyId: string, updatedData: Partial<Company>) => {
        try {
            const { data, error } = await supabase.from("companies").update(updatedData).eq("id", companyId);
            if (error) throw error;
            setCompanies((prev) => prev ? prev.map((c) => (c.id === companyId ? { ...c, ...updatedData } : c)) : null);
            return { success: true, data };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const deleteCompany = async (companyId: string) => {
        try {
            const { data, error } = await supabase.from("companies").delete().eq("id", companyId);
            if (error) throw error;
            setCompanies((prev) => (prev ? prev.filter((c) => c.id !== companyId) : null));
            return { success: true, data };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    return { 
        companies, 
        myCompany, 
        myCompanyType,
        fetchMyCompany, 
        fetchMyCompanyType,
        fetchCompanies, 
        createCompany, 
        updateCompany, 
        deleteCompany, 
        loading,
        error 
    };
}
