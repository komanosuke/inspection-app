"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Site } from "@/types/site";

export function useSites() {
    const [sites, setSites] = useState<Site[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSites = async (siteId?: string, companyId?: string) => {
        setLoading(true);
        try {
            let query = supabase.from("sites").select("*");

            if (siteId) {
                query = query.eq("id", siteId).single();
            } else if (companyId) {
                query = query.eq("company_id", companyId);
            }

            const { data, error } = await query;
            if (error) throw error;
            setSites(Array.isArray(data) ? data : [data]);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const createSite = async (site: Site) => {
        try {
            const { data, error } = await supabase.from("sites").insert([site]).select("*");
    
            // UNIQUE制約違反のエラーハンドリング
            if (error) {
                if (error.code === "23505") {
                    console.warn("⚠️ すでに登録されているためスキップ:", site);
                    return { success: false, message: "すでに登録されています。" };
                }
                throw error;
            }
    
            setSites((prev) => (prev ? [...prev, data[0]] : [data[0]]));
            return { success: true, data, error };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };
    

    const updateSite = async (siteId: string, updatedData: Partial<Site>) => {
        try {
            const { data, error } = await supabase.from("sites").update(updatedData).eq("id", siteId).select("*");
            if (error) throw error;
            setSites((prev) => prev ? prev.map((s) => (s.id === siteId ? { ...s, ...updatedData } : s)) : null);
            return { success: true, data };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const deleteSite = async (siteId: string) => {
        try {
            const { data, error } = await supabase.from("sites").delete().eq("id", siteId);
            if (error) throw error;
            setSites((prev) => (prev ? prev.filter((s) => s.id !== siteId) : null));
            return { success: true, data };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    return { sites, fetchSites, createSite, updateSite, deleteSite, loading, error };
}
