"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserPlus, Trash2 } from "lucide-react";
import { getAtletas, deleteAtleta } from "@/lib/atletas";
import type { Atleta } from "@/data/mockAtletas";

const ACCENT_HEX = ["#E63946", "#F4A261", "#F5D547", "#2A9D8F", "#3A86FF", "#8338EC"];

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ACCENT_HEX[Math.abs(hash) % ACCENT_HEX.length];
}

function initials(name: string): string {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function JogadoresPage() {
  const [atletas, setAtletas] = useState<Atleta[]>([]);

  useEffect(() => {
    setAtletas(getAtletas());
  }, []);

  function handleDelete(id: number) {
    deleteAtleta(id);
    setAtletas(getAtletas());
  }

  return (
    <div style={{ paddingTop: "40px" }}>
      <div className="flex items-center justify-between mb-8">
        <h1
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
            letterSpacing: "0.02em",
            fontSize: "48px",
            lineHeight: 1,
          }}
          className="uppercase"
        >
          Jogadores
        </h1>

        <Link
          href="/jogadores/novo"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 600,
            color: "#fff",
            backgroundColor: "var(--action-primary)",
            borderRadius: "var(--radius-md)",
            padding: "10px 20px",
            textDecoration: "none",
            transition: "background-color 0.15s",
          }}
        >
          <UserPlus size={16} />
          Cadastrar atleta
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {atletas.map((atleta) => {
          const avatarBg = hashColor(atleta.nome);

          return (
            <div
              key={atleta.id}
              style={{
                position: "relative",
                backgroundColor: "var(--bg-secondary)",
                border: "0.5px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "20px",
                transition: "border-color 0.2s, transform 0.2s",
              }}
              className="group hover:[border-color:var(--border-default)] hover:[-webkit-transform:translateY(-2px)] hover:[transform:translateY(-2px)]"
            >
              {/* Número da camisa */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "16px",
                  fontFamily: "var(--font-display)",
                  fontSize: "56px",
                  color: "var(--text-tertiary)",
                  opacity: 0.25,
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {atleta.numero}
              </span>

              {/* Botão deletar */}
              <button
                onClick={() => handleDelete(atleta.id)}
                style={{
                  position: "absolute",
                  bottom: "16px",
                  right: "16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-tertiary)",
                  opacity: 0,
                  transition: "opacity 0.15s",
                  padding: "4px",
                }}
                className="group-hover:!opacity-100"
                title="Remover atleta"
              >
                <Trash2 size={14} />
              </button>

              {/* Avatar */}
              {atleta.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={atleta.foto}
                  alt={atleta.nome}
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "9999px",
                    objectFit: "cover",
                    marginBottom: "16px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "9999px",
                    backgroundColor: avatarBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "22px", color: "#fff" }}>
                    {initials(atleta.nome)}
                  </span>
                </div>
              )}

              {/* Nome */}
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "20px",
                  color: "var(--text-primary)",
                  letterSpacing: "0.02em",
                  lineHeight: 1.1,
                }}
                className="uppercase"
              >
                {atleta.nome}
              </p>

              {/* Posição */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  marginTop: "4px",
                }}
              >
                {atleta.posicao}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
