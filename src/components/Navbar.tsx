"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Users, Calendar, BarChart3, ClipboardList } from "lucide-react";

const navLinks = [
  { href: "/jogadores",    label: "Jogadores",    icon: Users },
  { href: "/escalacao",    label: "Escalação",    icon: ClipboardList },
  { href: "/jogos",        label: "Jogos",        icon: Calendar },
  { href: "/estatisticas", label: "Estatísticas", icon: BarChart3 },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      style={{
        backgroundColor: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo com wordmark integrado */}
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
      </div>
    </header>
  );
}
