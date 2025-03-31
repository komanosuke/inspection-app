"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LoginCheck from "@/components/LoginCheck";
import PageLockGuard from "@/components/PageLockGuard";
import CompanyForPermissionSelection from "@/components/CompanyForPermissionSelection";
import { useCompanies } from "@/lib/hooks/useCompanies";
import { useCompanyPermissions } from "@/lib/hooks/useCompanyPermissions";
import { Company } from "@/types/company";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

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
    const [userCompanyId, setUserCompanyId] = useState<string | null>(null);
    // ✅ パスワードの表示/非表示トグル状態
    const [showPassword, setShowPassword] = useState(false);
    // ✅ パスワード変更フラグ
    const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);


    const { fetchCompanies, fetchMyCompany, createCompany, updateCompany, myCompany, companies } = useCompanies();
    const { fetchMyCompanyPermissions, createCompanyPermission, updateCompanyPermission, deleteCompanyPermission, myCompanyPermissions } = useCompanyPermissions();

    useEffect(() => {
        const user_id = localStorage.getItem("user_id") || "";
        if (!user_id) {
            console.error("❌ ユーザーIDが見つかりません。");
            alert("ユーザーIDが見つかりません。");
            setIsLoading(false);
            return;
        }
        setUserCompanyId(user_id);

        setForm((prev) => ({ ...prev, id: user_id }));

        fetchMyCompany(user_id);
        fetchCompanies(user_id);

        fetchMyCompanyPermissions(user_id);
        setIsLoading(false);
    }, [userCompanyId]);

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
        // ✅ 協力会社の場合、選択された会社があるか確認
        if (form.type === "協力会社" && selectedCompanies.length === 0) {
            newErrors.selectedCompanies = "協力会社の場合、少なくとも1つの会社を選択してください。";
        }
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

        // ✅ パスワードが空の場合、更新データから除外
        const updatedData = { ...form };
        if (isRegistered && !form.page_lock_password) {
            delete updatedData.page_lock_password;
        }

        try {
            const { success, error } = isRegistered ? await action(form.id, updatedData) : await action(form);

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

    // ✅ パスワード用のリアルタイムバリデーション関数
    const handlePasswordChange = (value: string) => {
        if (/^[A-Za-z0-9]{6,20}$/.test(value)) {
            setForm({ ...form, page_lock_password: value });
            setErrors({ ...errors, page_lock_password: "" }); // ✅ エラーリセット
        } else {
            setForm({ ...form, page_lock_password: value });
            setErrors({
                ...errors,
                page_lock_password: "半角英数字6〜20文字で入力してください。",
            });
        }
    };


    return (
        <LoginCheck>
            <PageLockGuard
                company={myCompany}
            >
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
                                <label className="block font-bold mb-2">利用モード（必須）</label>
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
                                    selectedCompanies={selectedCompanies}
                                    setSelectedCompanies={setSelectedCompanies}
                                />
                            )}
                            {errors.selectedCompanies && <p className="text-red-500 text-sm mb-4">{errors.selectedCompanies}</p>}

                            <div className="mb-4 relative">
                                <div className="flex items-center justify-between">
                                    <label className="block font-bold mb-2">
                                        {isRegistered
                                            ? "設定・管理ページのページロックパスワード（任意変更）"
                                            : "設定・管理ページのページロックパスワード（必須）"}
                                    </label>
                                    {isRegistered && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditingPassword(!isEditingPassword);
                                                if (!isEditingPassword) {
                                                    // ✅ 編集開始時に値をリセット
                                                    setForm({ ...form, page_lock_password: "" });
                                                }
                                            }}
                                            className="text-sm text-blue-500 underline"
                                        >
                                            {isEditingPassword ? "キャンセル" : "変更する"}
                                        </button>
                                    )}
                                </div>

                                {(!isRegistered || isEditingPassword) && (
                                    <>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="page_lock_password"
                                            value={form.page_lock_password || ""}
                                            onChange={(e) => handlePasswordChange(e.target.value)}
                                            className="w-full p-2 border rounded"
                                            placeholder="半角英数6文字以上20文字以内"
                                            minLength={6}
                                            maxLength={20}
                                            pattern="[A-Za-z0-9]{6,20}"
                                            required={!isRegistered} // ✅ 新規登録の場合のみ必須
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-10 text-gray-500"
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="w-5 h-5" />
                                            ) : (
                                                <EyeIcon className="w-5 h-5" />
                                            )}
                                        </button>
                                        {errors.page_lock_password && (
                                            <p className="text-red-500 text-sm">{errors.page_lock_password}</p>
                                        )}
                                    </>
                                )}
                            </div>

                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                {isRegistered ? "更新" : "登録"}
                            </button>
                        </form>
                    )}
                </div>

                {!isLoading && (
                    <>
                        {!myCompany ? (
                            <div className="mt-8 bg-white p-4 md:p-8 shadow rounded-lg">
                                <div className="text-xl font-bold mb-4">管理ページへのリンク</div>
                                <p>会社情報を登録後、表示されます。</p>
                            </div>
                        ) : (
                            <>
                                <div className="mt-8 bg-white p-4 md:p-8 shadow rounded-lg">
                                    {isRegistered && myCompany && myCompany.type === "管理会社" && (
                                        <div className="">
                                            <div className="text-xl font-bold mb-4">あなたの会社のID <span className="text-sm text-red-400">※ 協力会社に教えてください。</span></div>
                                            <p>{myCompany.id}</p>
                                        </div>
                                    )}
                                </div>
                            
                                <div className="mt-8 bg-white p-4 md:p-8 shadow rounded-lg">
                                    <div className="text-xl font-bold mb-4">管理ページへのリンク</div>
                                    <div className="sm:flex flex-wrap justify-between gap-4">
                                        {myCompany.type === "管理会社" && (
                                            <Link
                                                href="/sites"
                                                className="flex-1 mb-2 sm:mb-0 block text-center bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                                            >
                                                📍 現場管理
                                            </Link>
                                        )}
                                        <Link
                                            href="/inspectors"
                                            className="flex-1 mb-2 sm:mb-0 block text-center bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                                        >
                                            👷 検査者管理
                                        </Link>
                                        <Link
                                            href="/shutters"
                                            className="flex-1 mb-2 sm:mb-0 block text-center bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                                        >
                                            🏗️ シャッター管理
                                        </Link>
                                        <Link
                                            href="/inspection_records"
                                            className="flex-1 mb-2 sm:mb-0 block text-center bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                                        >
                                            📋 検査記録管理
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </PageLockGuard>
        </LoginCheck>
    );
}
