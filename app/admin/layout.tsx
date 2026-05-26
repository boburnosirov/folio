import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "./AdminNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { SettingsMenu } from "@/components/layout/SettingsMenu";

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

        {/* Settings + back to site at bottom of sidebar */}
        <div className="mt-auto flex flex-col gap-2 border-t border-foreground/8 pt-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-foreground/40">
              Оформление
            </span>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <SettingsMenu compact />
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-foreground/55 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
          >
            <ExternalLink className="h-3 w-3" />
            На сайт
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
