"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Users, Calendar, BarChart3, ClipboardList, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRole } from "@/lib/supabase/useRole";

const navLinks = [
  { href: "/jogadores",    label: "Jogadores",    icon: Users },
  { href: "/escalacao",    label: "Escalação",    icon: ClipboardList },
  { href: "/jogos",        label: "Jogos",        icon: Calendar },
  { href: "/estatisticas", label: "Estatísticas", icon: BarChart3 },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useRole();

  if (pathname === "/login") return null;

  const isAuthenticated = role !== null;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header
      style={{
        backgroundColor: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo-lendarios.png"
            alt="Lendários Esporte Clube"
            width={0}
            height={56}
            sizes="100vw"
            style={{ width: "auto", height: "56px" }}
            className="object-contain"
          />
        </Link>

        <div className="flex items-center gap-1">
          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    backgroundColor: active ? "var(--bg-tertiary)" : "transparent",
                    borderRadius: "var(--radius-md)",
                    transition: "color 0.15s, background-color 0.15s",
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:[color:var(--text-primary)]"
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Separador + role badge + logout */}
          <div
            style={{
              width: "1px",
              height: "20px",
              backgroundColor: "var(--border-subtle)",
              margin: "0 8px",
            }}
          />

          {role && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: role === "gestao" ? "var(--accent-orange)" : "var(--accent-blue)",
                backgroundColor:
                  role === "gestao"
                    ? "rgba(244,162,97,0.12)"
                    : "rgba(58,134,255,0.12)",
                padding: "3px 8px",
                borderRadius: "var(--radius-full)",
              }}
            >
              {role === "gestao" ? "Gestão" : "Atleta"}
            </span>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              title="Sair"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--text-tertiary)",
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "var(--radius-md)",
                padding: "6px 10px",
                cursor: "pointer",
                transition: "color 0.15s",
              }}
            >
              <LogOut size={14} />
              Sair
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
