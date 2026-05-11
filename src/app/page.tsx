import Link from "next/link";

const sections = [
  {
    href: "/jogadores",
    title: "Jogadores",
    description:
      "Cadastre atletas, gerencie uniformes, atestados e inscrições nas competições.",
    icon: "🏃",
  },
  {
    href: "/jogos",
    title: "Jogos",
    description:
      "Monte os times para cada partida e acompanhe o calendário de jogos.",
    icon: "🏐",
  },
  {
    href: "/estatisticas",
    title: "Estatísticas",
    description:
      "Visualize o desempenho do time e dos jogadores ao longo da temporada.",
    icon: "📊",
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-10">
        <h1 className="text-4xl font-bold text-yellow-600 mb-3">
          Bem-vindo ao Gestão de Vôlei
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Organize seu time, controle inscrições e acompanhe os resultados em um
          só lugar.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {sections.map(({ href, title, description, icon }) => (
          <Link
            key={href}
            href={href}
            className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-yellow-400 transition-all"
          >
            <div className="text-4xl mb-3">{icon}</div>
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-yellow-600 transition-colors">
              {title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
