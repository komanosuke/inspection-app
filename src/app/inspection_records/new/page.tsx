"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LoginCheck from '@/components/LoginCheck';
import InspectionRecordRegisterForm from "@/components/InspectionRecordRegisterForm";

const NewInspectionRecordPage = () => {
    const router = useRouter();

    // ✅ 新規登録完了時に前のページへ戻る
    const handleClose = () => {
        router.push("/inspection_records");
    };

    return (
        <LoginCheck>
            <div className="bg-white p-4 md:p-8 shadow rounded-lg">
                {/* ✅ 新規登録フォーム */}
                <InspectionRecordRegisterForm onClose={handleClose} />
            </div>
        </LoginCheck>
    );
};

export default NewInspectionRecordPage;
