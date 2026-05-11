"use client";

import { useEffect, useRef, useState } from "react";
import { Printer, ImageDown, FileDown } from "lucide-react";
import { getAtletas } from "@/lib/atletas";
import type { Atleta } from "@/data/mockAtletas";

// ── helpers ───────────────────────────────────────────────────────────────────

const ACCENT_HEX = ["#E63946", "#F4A261", "#F5D547", "#2A9D8F", "#3A86FF", "#8338EC"];

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACCENT_HEX[Math.abs(hash) % ACCENT_HEX.length];
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

// ── posições ──────────────────────────────────────────────────────────────────
//
// Grid principal — 3 linhas × 2 colunas (igual à imagem de referência):
//
//   Oposto       | Ponteiro
//   Central      | Líbero
//   Ponteiro     | Levantador
//
// Central 2 fica num mini slot na borda teal direita da quadra,
// visualmente oposto ao Central do grid (frente × fundo).

type PosKey =
  | "oposto"
  | "central"
  | "central2"
  | "libero"
  | "ponteiro_front"
  | "ponteiro_back"
  | "levantador";

const COURT_POSITIONS: { key: PosKey; label: string }[] = [
  { key: "oposto",         label: "Oposto"     },
  { key: "ponteiro_front", label: "Ponteiro"   },
  { key: "central",        label: "Central"    },
  { key: "libero",         label: "Líbero"     },
  { key: "ponteiro_back",  label: "Ponteiro"   },
  { key: "levantador",     label: "Levantador" },
];

const CENTRAL2_POS = { key: "central2" as PosKey, label: "Central 2" };

type Lineup = Record<PosKey, Atleta | null>;

const EMPTY_LINEUP: Lineup = {
  oposto: null, central: null, central2: null, libero: null,
  ponteiro_front: null, ponteiro_back: null, levantador: null,
};

// carregado no useEffect abaixo

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ atleta, size }: { atleta: Atleta; size: number }) {
  if (atleta.foto) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={atleta.foto}
        alt={atleta.nome}
        style={{ width: size, height: size, borderRadius: "9999px", objectFit: "cover", flexShrink: 0, border: "2px solid rgba(255,255,255,0.25)" }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "9999px",
      backgroundColor: hashColor(atleta.nome),
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, border: "2px solid rgba(255,255,255,0.25)",
    }}>
      <span style={{ fontFamily: "var(--font-display)", fontSize: size * 0.38, color: "#fff", lineHeight: 1 }}>
        {initials(atleta.nome)}
      </span>
    </div>
  );
}

// ── Slot da quadra ────────────────────────────────────────────────────────────

function PositionSlot({
  pos, player, isSelected, onClick, mini = false,
}: {
  pos: { key: PosKey; label: string };
  player: Atleta | null;
  isSelected: boolean;
  onClick: () => void;
  mini?: boolean;
}) {
  const avatarSize = mini ? 32 : 40;

  return (
    <button
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: mini ? "3px" : "5px",
        padding: mini ? "5px 3px" : "6px",
        borderRadius: "8px",
        border: isSelected
          ? "2px solid #3A86FF"
          : player
          ? "1px solid rgba(255,255,255,0.18)"
          : "1.5px dashed rgba(255,255,255,0.22)",
        backgroundColor: isSelected
          ? "rgba(58,134,255,0.22)"
          : player
          ? "rgba(255,255,255,0.07)"
          : "rgba(255,255,255,0.02)",
        cursor: "pointer",
        transition: "all 0.15s",
        height: "100%", width: "100%",
        minWidth: 0, overflow: "hidden",
      }}
    >
      {/* Número da camisa */}
      {player && (
        <span aria-hidden style={{
          position: "absolute", top: "4px", right: "5px",
          fontFamily: "var(--font-display)",
          fontSize: mini ? "13px" : "17px",
          color: "rgba(255,255,255,0.32)",
          lineHeight: 1, userSelect: "none",
        }}>
          {player.numero}
        </span>
      )}

      {player ? (
        <>
          <Avatar atleta={player} size={avatarSize} />
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: mini ? "9px" : "11px",
            color: "rgba(255,255,255,0.9)", letterSpacing: "0.05em",
            lineHeight: 1, textTransform: "uppercase",
            maxWidth: "100%", overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {player.nome.split(" ")[0]}
          </span>
          <span style={{
            fontFamily: "var(--font-body)",
            fontSize: mini ? "7px" : "9px",
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>
            {pos.label}
          </span>
        </>
      ) : (
        <>
          <div style={{
            width: avatarSize - 4, height: avatarSize - 4,
            borderRadius: "9999px",
            border: isSelected
              ? "2px dashed rgba(58,134,255,0.8)"
              : "1.5px dashed rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: isSelected ? "rgba(58,134,255,0.9)" : "rgba(255,255,255,0.2)",
            fontSize: "16px", fontWeight: 300,
          }}>
            {isSelected ? "+" : ""}
          </div>
          <span style={{
            fontFamily: "var(--font-body)",
            fontSize: mini ? "7px" : "9px",
            color: isSelected ? "rgba(58,134,255,0.8)" : "rgba(255,255,255,0.28)",
            textTransform: "uppercase", letterSpacing: "0.06em",
            textAlign: "center",
          }}>
            {pos.label}
          </span>
        </>
      )}
    </button>
  );
}

// ── Quadra ────────────────────────────────────────────────────────────────────

function Court({
  lineup, selectedPos, onPosClick, courtRef,
}: {
  lineup: Lineup;
  selectedPos: PosKey | null;
  onPosClick: (key: PosKey) => void;
  courtRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={courtRef}
      style={{
        width: "100%", aspectRatio: "2 / 1",
        backgroundColor: "#0B6E7A",
        borderRadius: "16px",
        position: "relative", overflow: "hidden",
        boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
      }}
    >
      {/* Borda tracejada externa */}
      <div style={{
        position: "absolute", inset: "5%",
        border: "1.5px dashed rgba(255,255,255,0.2)",
        borderRadius: "8px", pointerEvents: "none",
      }} />

      {/* Campo interno — margem direita maior para abrir espaço ao Central 2 */}
      <div style={{
        position: "absolute",
        top: "10%", bottom: "10%", left: "10%", right: "14%",
        display: "flex", overflow: "hidden",
        border: "2px solid rgba(255,255,255,0.55)",
      }}>
        {/* Metade adversário */}
        <div style={{
          flex: 1, backgroundColor: "rgba(0,0,0,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontFamily: "var(--font-body)", fontSize: "10px",
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.15em", textTransform: "uppercase",
          }}>
            Adversário
          </span>
        </div>

        {/* Rede */}
        <div style={{ position: "relative", width: "6px", backgroundColor: "rgba(255,255,255,0.75)", flexShrink: 0 }}>
          {["-12px", "calc(100% + 4px)"].map((top) => (
            <div key={top} style={{
              position: "absolute", top, left: "-3px",
              width: "12px", height: "12px",
              borderRadius: "9999px", backgroundColor: "white",
            }} />
          ))}
        </div>

        {/* Metade do time — grid 3 linhas × 2 colunas (igual à referência) */}
        <div style={{
          flex: 1, minWidth: 0, overflow: "hidden",
          backgroundColor: "rgba(58,134,255,0.08)",
          display: "grid",
          gridTemplateRows: "1fr 1fr 1fr",
          gridTemplateColumns: "1fr 1fr",
          gap: "5px", padding: "8px",
        }}>
          {COURT_POSITIONS.map((pos) => (
            <PositionSlot
              key={pos.key}
              pos={pos}
              player={lineup[pos.key]}
              isSelected={selectedPos === pos.key}
              onClick={() => onPosClick(pos.key)}
            />
          ))}
        </div>
      </div>

      {/* Central 2 — mini slot na borda teal direita, oposto ao Central do grid */}
      <div style={{
        position: "absolute",
        right: "1.5%",
        top: "50%",
        transform: "translateY(-50%)",
        width: "10%",
        height: "40%",
      }}>
        <PositionSlot
          pos={CENTRAL2_POS}
          player={lineup.central2}
          isSelected={selectedPos === "central2"}
          onClick={() => onPosClick("central2")}
          mini
        />
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

export default function EscalacaoPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([]);
  const [lineup, setLineup] = useState<Lineup>(EMPTY_LINEUP);
  const [selectedPos, setSelectedPos] = useState<PosKey | null>(null);
  const [exporting, setExporting] = useState(false);
  const courtRef = useRef<HTMLDivElement>(null);

  useEffect(() => { getAtletas().then(setAtletas); }, []);

  const assignedIds = new Set(
    Object.values(lineup).filter(Boolean).map((a) => a!.id)
  );

  function handlePosClick(key: PosKey) {
    if (lineup[key]) {
      setLineup((l) => ({ ...l, [key]: null }));
      setSelectedPos(null);
    } else {
      setSelectedPos((prev) => (prev === key ? null : key));
    }
  }

  function handlePlayerClick(atleta: Atleta) {
    if (!selectedPos || assignedIds.has(atleta.id)) return;
    setLineup((l) => ({ ...l, [selectedPos]: atleta }));
    setSelectedPos(null);
  }

  function handleReset() {
    setLineup(EMPTY_LINEUP);
    setSelectedPos(null);
  }

  async function captureCanvas() {
    if (!courtRef.current) return null;
    const { default: html2canvas } = await import("html2canvas");
    return html2canvas(courtRef.current, { scale: 2, backgroundColor: null });
  }

  async function handleDownloadImage() {
    setExporting(true);
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "escalacao-lendarios.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setExporting(false);
    }
  }

  async function handleDownloadPDF() {
    setExporting(true);
    try {
      const canvas = await captureCanvas();
      if (!canvas) return;
      const { default: jsPDF } = await import("jspdf");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save("escalacao-lendarios.pdf");
    } finally {
      setExporting(false);
    }
  }

  const filledCount = Object.values(lineup).filter(Boolean).length;

  return (
    <div style={{ paddingTop: "40px" }}>
      {/* Cabeçalho */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 style={{
            fontFamily: "var(--font-display)", color: "var(--text-primary)",
            letterSpacing: "0.02em", fontSize: "48px", lineHeight: 1,
          }} className="uppercase">
            Escalação
          </h1>
          <p style={{
            fontFamily: "var(--font-body)", color: "var(--text-secondary)",
            fontSize: "14px", marginTop: "6px",
          }}>
            {selectedPos
              ? "Selecione um atleta no elenco →"
              : filledCount === 7
              ? "Time completo! Clique num slot para remover."
              : `${filledCount}/7 posições preenchidas — clique num slot vazio.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {filledCount > 0 && (
            <button onClick={handleReset} style={{
              fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500,
              color: "var(--text-secondary)", backgroundColor: "transparent",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)", padding: "8px 16px",
              cursor: "pointer", transition: "all 0.15s",
            }}>
              Limpar
            </button>
          )}
          <button onClick={() => window.print()} style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500,
            color: "var(--text-secondary)", backgroundColor: "var(--bg-secondary)",
            border: "0.5px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)", padding: "8px 14px",
            cursor: "pointer",
          }}>
            <Printer size={15} /> Imprimir
          </button>
          <button onClick={handleDownloadImage} disabled={exporting} style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500,
            color: "var(--text-secondary)", backgroundColor: "var(--bg-secondary)",
            border: "0.5px solid var(--border-subtle)",
            borderRadius: "var(--radius-md)", padding: "8px 14px",
            cursor: exporting ? "not-allowed" : "pointer",
            opacity: exporting ? 0.6 : 1,
          }}>
            <ImageDown size={15} /> PNG
          </button>
          <button onClick={handleDownloadPDF} disabled={exporting} style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 500,
            color: "#fff", backgroundColor: "var(--action-primary)",
            border: "none",
            borderRadius: "var(--radius-md)", padding: "8px 14px",
            cursor: exporting ? "not-allowed" : "pointer",
            opacity: exporting ? 0.6 : 1,
          }}>
            <FileDown size={15} /> PDF
          </button>
        </div>
      </div>

      {/* Quadra + Elenco */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <Court
            lineup={lineup}
            selectedPos={selectedPos}
            onPosClick={handlePosClick}
            courtRef={courtRef}
          />
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "11px",
            color: "var(--text-tertiary)", marginTop: "8px",
          }}>
            ← próximo à rede · Central 2 fica oposto ao Central (borda direita)
          </p>
        </div>

        {/* Elenco */}
        <div style={{ width: "240px", flexShrink: 0 }}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "11px",
            letterSpacing: "0.1em", color: "var(--text-tertiary)",
            textTransform: "uppercase", marginBottom: "10px",
          }}>
            Elenco
          </p>
          <div className="flex flex-col gap-2">
            {atletas.map((atleta) => {
              const used = assignedIds.has(atleta.id);
              const clickable = !used && selectedPos !== null;
              return (
                <button
                  key={atleta.id}
                  onClick={() => handlePlayerClick(atleta)}
                  disabled={used}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: clickable ? "1px solid #3A86FF" : "0.5px solid var(--border-subtle)",
                    backgroundColor: clickable ? "rgba(58,134,255,0.08)" : "var(--bg-secondary)",
                    opacity: used ? 0.35 : 1,
                    cursor: used ? "not-allowed" : selectedPos ? "pointer" : "default",
                    textAlign: "left", transition: "all 0.15s", width: "100%",
                  }}
                >
                  <Avatar atleta={atleta} size={36} />
                  <div style={{ overflow: "hidden" }}>
                    <p style={{
                      fontFamily: "var(--font-display)", fontSize: "14px",
                      color: "var(--text-primary)", letterSpacing: "0.02em",
                      textTransform: "uppercase", lineHeight: 1.1,
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {atleta.nome}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-body)", fontSize: "11px",
                      color: "var(--text-secondary)", marginTop: "1px",
                    }}>
                      {atleta.posicao} · #{atleta.numero}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
