"use client";

import { useEffect, useState, useCallback } from "react";
import LoginCheck from "@/components/LoginCheck";
import CompanyForPermissionSelection from "@/components/CompanyForPermissionSelection";
import { useCompanies } from "@/lib/hooks/useCompanies";
import { useCompanyPermissions } from "@/lib/hooks/useCompanyPermissions";
import { Company } from "@/types/company";

export default function ProfilePage() {
    const [form, setForm] = useState({
        id: "",
        name: "",
        representative_name: "",
        type: "",
        can_access_setting_page: false,
        page_lock_password: ""
    } as Company);

    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({}); // ✅ エラーメッセージ管理

    const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);

    const { fetchCompanies, fetchMyCompany, createCompany, updateCompany, myCompany, companies } = useCompanies();
    const { fetchMyCompanyPermissions, createCompanyPermission, updateCompanyPermission, deleteCompanyPermission, myCompanyPermissions } = useCompanyPermissions();

    // ✅ `fetchMyCompany` を useCallback でメモ化（依存配列を `[]` に固定）
    const getMyCompany = useCallback(async (userId: string) => {
        try {
            await fetchMyCompany(userId);
            await fetchCompanies(userId);
        } catch (error) {
            console.error("❌ 会社情報取得エラー:", error);
        } finally {
            setIsLoading(false); // ✅ データ取得後にローディングを解除
        }
    }, []); // ✅ `fetchMyCompany` への依存を解除

    const getMyCompanyPermission = useCallback(async (userId: string) => {
        try {
            await fetchMyCompanyPermissions(userId);
        } catch (error) {
            console.error("❌ 会社情報取得エラー:", error);
        } finally {
            setIsLoading(false); // ✅ データ取得後にローディングを解除
        }
    }, []);

    useEffect(() => {
        const userId = localStorage.getItem("user_id") || "";
        if (!userId) {
            console.error("❌ ユーザーIDが見つかりません。");
            alert("ユーザーIDが見つかりません。");
            setIsLoading(false);
            return;
        }

        console.log("✅ ローカルストレージから取得したユーザーID:", userId);
        setForm((prev) => ({ ...prev, id: userId }));

        getMyCompany(userId); // ✅ メモ化した関数を実行
        getMyCompanyPermission(userId);
    }, [getMyCompany, getMyCompanyPermission]); // ✅ `useEffect` の依存配列

    useEffect(() => {
        if (myCompany) {
            setForm((prev) => ({
                ...prev,
                ...myCompany,
            }));
            setIsRegistered(true);
        }
    }, [myCompany]);

    useEffect(() => {
        if (myCompanyPermissions) {
            // 許可された会社のID一覧を抽出
            const permittedCompanyIds = myCompanyPermissions.map(p => p.receiver_company_id);
            
            // 許可された会社の情報を `fetchCompanies` の結果からフィルタリング
            const permittedCompaniesList = (companies || []).filter(c => 
                permittedCompanyIds.includes(c.id)
            );
    
            setSelectedCompanies(permittedCompaniesList);
        }
    }, [myCompanyPermissions, companies]);

    // ✅ **バリデーション関数**
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!form.name.trim()) newErrors.name = "会社名を入力してください。";
        if (!form.representative_name.trim()) newErrors.representative_name = "代表者名を入力してください。";
        if (!form.type?.trim()) newErrors.type = "契約形態を選択してください。";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // ✅ エラーがなければ true を返す
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log(form);

        if (!validateForm()) {
            alert("必須項目を入力してください。");
            return;
        }

        console.log("📤 送信データ:", form);
        const action = isRegistered ? updateCompany : createCompany;

        try {
            const { success, error } = isRegistered ? await action(form.id, form) : await action(form);

            if (!success) {
                throw new Error(error || "エラーが発生しました");
            }
            localStorage.setItem("company_type", form.type);

            // 会社登録後にパーミッションを処理
            if (form.type === "協力会社") {
                handlePermissionsUpdate(form.id);
            }

            alert("登録/更新が成功しました！");
            window.location.reload() // サイドバー更新のためページリロード
        } catch (error) {
            console.error("❌ データ送信エラー:", error);
            alert("データの送信に失敗しました。");
        }
    };

    const handlePermissionsUpdate = async (companyId: string) => {
        console.log("🔄 パーミッションの更新を開始...");
    
        const existingPermissions = myCompanyPermissions || [];
        const selectedCompanyIds = selectedCompanies.map((c) => c.id);
    
        // 追加すべきパーミッション
        const permissionsToAdd = selectedCompanies.filter(
            (c) => !existingPermissions.some((p) => p.receiver_company_id === c.id)
        );
    
        // 更新すべきパーミッション
        const permissionsToUpdate = existingPermissions.filter(
            (p) => selectedCompanyIds.includes(p.receiver_company_id)
        );
    
        // 削除すべきパーミッション
        const permissionsToDelete = existingPermissions.filter(
            (p) => !selectedCompanyIds.includes(p.receiver_company_id)
        );
    
        console.log("✅ 追加:", permissionsToAdd);
        console.log("✅ 更新:", permissionsToUpdate);
        console.log("✅ 削除:", permissionsToDelete);
    
        try {
            // **パーミッションを追加**
            await Promise.all(
                permissionsToAdd.map((company) =>
                    createCompanyPermission({
                        granter_company_id: companyId,
                        receiver_company_id: company.id,
                        view_inspectors: true,
                        view_inspectors_status: "許可",
                    })
                )
            );
    
            // **既存のパーミッションを更新**
            await Promise.all(
                permissionsToUpdate.map((permission) =>
                    updateCompanyPermission(permission.id!, {
                        view_inspectors: true,
                        view_inspectors_status: "許可",
                    })
                )
            );
    
            // **不要なパーミッションを削除**
            await Promise.all(
                permissionsToDelete.map((permission) => deleteCompanyPermission(permission.id!))
            );
    
            console.log("✅ パーミッション更新完了");
        } catch (error) {
            console.error("❌ パーミッション更新エラー:", error);
        }
    };    

    return (
        <LoginCheck>
            <div className="bg-white p-4 md:p-8 shadow rounded-lg">
                <h1 className="text-xl font-bold mb-4">会社プロフィール設定</h1>

                {isLoading ? (
                    <p className="text-center">🔄 データを取得中...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block font-bold mb-2">会社名（必須）</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block font-bold mb-2">代表者名（必須）</label>
                            <input
                                type="text"
                                name="representative_name"
                                value={form.representative_name}
                                onChange={(e) => setForm({ ...form, representative_name: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            />
                            {errors.representative_name && <p className="text-red-500 text-sm">{errors.representative_name}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block font-bold mb-2">利用モード（必須）<span className="text-red-500 text-xs">※ サイドバーの表示が変わります。常時切り替え可能です。</span></label>
                            <select
                                name="type"
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">選択してください</option>
                                <option value="管理会社">管理会社</option>
                                <option value="協力会社">協力会社</option>
                            </select>
                            {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                        </div>

                        {form.type === "協力会社" && (
                            <CompanyForPermissionSelection
                                availableCompanies={companies || []}
                                selectedCompanies={selectedCompanies}
                                setSelectedCompanies={setSelectedCompanies}
                            />
                        )}

                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                            {isRegistered ? "更新" : "登録"}
                        </button>
                    </form>
                )}
            </div>
        </LoginCheck>
    );
}
