export default function JogosPage() {
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
        Jogos
      </h1>
      <p style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
        Em breve: calendário e montagem de times por partida.
      </p>
    </div>
  );
}
