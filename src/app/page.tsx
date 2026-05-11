import Link from "next/link";
import { Users, Calendar, BarChart3 } from "lucide-react";

const sections = [
  {
    href: "/jogadores",
    title: "Jogadores",
    description: "Cadastre atletas, gerencie uniformes, atestados e inscrições nas competições.",
    icon: Users,
    accentVar: "--accent-blue",
  },
  {
    href: "/jogos",
    title: "Jogos",
    description: "Monte os times para cada partida e acompanhe o calendário de jogos.",
    icon: Calendar,
    accentVar: "--accent-red",
  },
  {
    href: "/estatisticas",
    title: "Estatísticas",
    description: "Visualize o desempenho do time e dos jogadores ao longo da temporada.",
    icon: BarChart3,
    accentVar: "--accent-green",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="text-center" style={{ paddingTop: "80px", paddingBottom: "0" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
            letterSpacing: "0.02em",
            fontSize: "72px",
            lineHeight: 1,
          }}
          className="uppercase mb-4"
        >
          Toca dos Lendários
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--text-secondary)",
            fontSize: "18px",
            maxWidth: "560px",
            margin: "0 auto",
          }}
        >
          Gestão de atletas, jogos e estatísticas do coletivo Lendários — desde 2018 no Rio.
        </p>
      </section>

      {/* Cards */}
      <section
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        style={{ marginTop: "64px" }}
      >
        {sections.map(({ href, title, description, icon: Icon, accentVar }) => (
          <Link
            key={href}
            href={href}
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "0.5px solid var(--border-subtle)",
              borderLeft: `4px solid var(${accentVar})`,
              borderRadius: "var(--radius-lg)",
              minHeight: "220px",
              transition: "border-color 0.15s, transform 0.15s",
            }}
            className="group block p-6 hover:[border-color:var(--border-default)]"
          >
            <Icon
              size={36}
              style={{ color: `var(${accentVar})` }}
            />
            <h2
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-primary)",
                letterSpacing: "0.02em",
                fontSize: "22px",
                marginTop: "20px",
              }}
              className="uppercase mb-1"
            >
              {title}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--text-secondary)",
                fontSize: "14px",
              }}
            >
              {description}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
