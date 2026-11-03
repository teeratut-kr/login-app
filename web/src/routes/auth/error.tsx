import { createFileRoute } from "@tanstack/react-router";

const MESSAGES: Record<string, string> = {
  signup_disabled: "บัญชีนี้ยังไม่เคยผูก provider นี้ — กรุณา sign-in ด้วยอีเมลก่อนแล้วค่อยผูกที่หน้าโปรไฟล์",
};

export const Route = createFileRoute("/auth/error")({
  component: AuthErrorPage,
});

function AuthErrorPage() {
  const { error } = Route.useSearch() as { error?: string };
  return (
    <div className="flex justify-center my-auto p-4">
      <p>{(error && MESSAGES[error]) || "เกิดข้อผิดพลาดในการยืนยันตัวตน"},
      </p>
    </div>
  );
}