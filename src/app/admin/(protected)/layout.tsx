import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  isAuthConfigured,
  verifySessionToken,
  SESSION_COOKIE,
} from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAuthConfigured) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div className="max-w-md">
          <h1 className="font-serif text-3xl text-cream">Set up the admin</h1>
          <p className="mt-4 text-muted">
            Add <code className="text-cream">ADMIN_PASSWORD</code> and{" "}
            <code className="text-cream">AUTH_SECRET</code> to your environment
            variables to enable the admin panel. See{" "}
            <code className="text-cream">README.md</code>.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block text-sm text-gold hover:underline"
          >
            ← Back to website
          </Link>
        </div>
      </main>
    );
  }

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminNav />
      <main className="flex-1 overflow-x-hidden px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        {children}
      </main>
    </div>
  );
}
