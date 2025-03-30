// components/PageLockGuard.tsx
"use client";
import { useState } from "react";
import { Company } from "@/types/company"; // ✅ Company 型のインポート

interface PageLockGuardProps {
    company: Company | null; // ✅ `myCompany` を受け取る
    children: React.ReactNode; // ✅ ブロックしたい中身
}

export default function PageLockGuard({ company, children }: PageLockGuardProps) {
    const [inputPassword, setInputPassword] = useState<string>(""); // ✅ パスワード入力
    const [error, setError] = useState<string>(""); // ✅ エラー管理

    // ✅ `company === null` ならロックせず即時表示
    if (!company) {
        return <>{children}</>;
    }

    // ✅ アクセス権限ありなら即時表示
    if (!company.can_access_setting_page) {
        return <>{children}</>;
    }

    // ✅ パスワード一致したらページ表示
    if (inputPassword === company.page_lock_password) {
        return <>{children}</>;
    }

    // 🚫 ブロック画面（パスワード入力用）
    return (
        <div className="fixed inset-0 ml-64 flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-lg w-80">
                <h2 className="text-lg font-bold mb-4">🔒 ページロック解除</h2>
                <input
                    type="password"
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    placeholder="パスワードを入力してください"
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            </div>
        </div>
    );
}
