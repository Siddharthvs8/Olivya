import { isAuthConfigured } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return <LoginForm configured={isAuthConfigured} />;
}
