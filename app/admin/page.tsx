import { isAdmin } from "@/lib/auth";
import { readState } from "@/lib/store";
import { catalog } from "@/lib/catalog";
import { AdminClient } from "@/components/admin-client";
import { AdminLogin } from "@/components/admin-login";

export const dynamic = "force-dynamic";
export const metadata = { title: "Stock admin | Lavie Kenya", robots: { index: false } };

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <AdminLogin configured={Boolean(process.env.ADMIN_PASSWORD)} />;
  }
  const state = await readState();
  return <AdminClient catalog={catalog} initial={state.products} />;
}
