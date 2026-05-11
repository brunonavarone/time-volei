export default function EstatisticasPage() {
  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--text-primary)",
          letterSpacing: "0.02em",
          fontSize: "40px",
        }}
        className="uppercase mb-2"
      >
        Estatísticas
      </h1>
      <p style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
        Em breve: desempenho do time e dos jogadores.
      </p>
    </div>
  );
}
