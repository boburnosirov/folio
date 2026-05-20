"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ProfileLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 rounded-full border border-foreground/12 px-3 py-1.5 text-xs text-foreground/50 transition-colors hover:border-red-500/30 hover:text-red-500"
    >
      <LogOut className="h-3.5 w-3.5" />
      Выйти
    </button>
  );
}
