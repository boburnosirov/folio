import Link from "next/link";
import { BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "./AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-56 shrink-0 flex-col border-r border-foreground/8 px-3 py-6">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background">
            <BookOpen className="h-3.5 w-3.5" />
          </div>
          <span className="font-semibold text-foreground">Folio</span>
          <span className="ml-auto rounded bg-[#0071e3]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#0071e3]">
            ADM
          </span>
        </Link>
        <AdminNav />
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
