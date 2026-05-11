"use client";

import { useEffect, useState } from "react";
import { createClient } from "./client";

export type Role = "gestao" | "atleta";

export function useRole() {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("perfis")
        .select("role")
        .eq("id", user.id)
        .single();
      setRole((data?.role as Role) ?? null);
      setLoading(false);
    });
  }, []);

  return { role, loading };
}
