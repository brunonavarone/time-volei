"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import { saveAtleta } from "@/lib/atletas";
import { useRole } from "@/lib/supabase/useRole";

const POSICOES = ["Levantador(a)", "Oposto(a)", "Ponteiro(a)", "Central", "Líbero"];

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-body)",
  fontSize: "15px",
  color: "var(--text-primary)",
  backgroundColor: "var(--bg-secondary)",
  border: "1px solid var(--border-default)",
  borderRadius: "var(--radius-md)",
  padding: "12px 14px",
  outline: "none",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text-secondary)",
  marginBottom: "6px",
};

export default function NovoAtletaPage() {
  const router = useRouter();
  const { role, loading } = useRole();
  const fileRef = useRef<HTMLInputElement>(null);
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [posicao, setPosicao] = useState("");
  const [foto, setFoto] = useState<string | undefined>();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && role !== "gestao") router.replace("/escalacao");
  }, [role, loading, router]);

  if (loading || role !== "gestao") return null;

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return setError("Informe o nome do atleta.");
    if (!numero || isNaN(Number(numero))) return setError("Informe um número de camisa válido.");
    if (!posicao) return setError("Selecione uma posição.");
    setError("");
    saveAtleta({ nome: nome.trim(), numero: parseInt(numero), posicao, foto });
    router.push("/jogadores");
  }

  return (
    <div style={{ paddingTop: "40px", maxWidth: "480px" }}>
      {/* Voltar */}
      <Link
        href="/jogadores"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: "var(--text-secondary)",
          textDecoration: "none",
          marginBottom: "32px",
        }}
      >
        <ArrowLeft size={14} /> Voltar para jogadores
      </Link>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--text-primary)",
          letterSpacing: "0.02em",
          fontSize: "40px",
          lineHeight: 1,
          marginBottom: "32px",
        }}
        className="uppercase"
      >
        Cadastrar atleta
      </h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Foto */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "9999px",
              border: "2px dashed var(--border-default)",
              backgroundColor: "var(--bg-secondary)",
              cursor: "pointer",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              transition: "border-color 0.15s",
            }}
          >
            {foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={foto} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <Camera size={22} color="var(--text-tertiary)" />
                <span style={{ fontFamily: "var(--font-body)", fontSize: "10px", color: "var(--text-tertiary)", letterSpacing: "0.05em" }}>
                  FOTO
                </span>
              </div>
            )}
          </button>
          {foto && (
            <button
              type="button"
              onClick={() => setFoto(undefined)}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                color: "var(--text-tertiary)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Remover foto
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} style={{ display: "none" }} />
        </div>

        {/* Nome */}
        <div>
          <label style={labelStyle}>Nome completo</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Ana Lima"
            style={inputStyle}
          />
        </div>

        {/* Número */}
        <div>
          <label style={labelStyle}>Número da camisa</label>
          <input
            type="number"
            min={1}
            max={99}
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="Ex: 7"
            style={{ ...inputStyle, width: "120px" }}
          />
        </div>

        {/* Posição */}
        <div>
          <label style={labelStyle}>Posição</label>
          <select
            value={posicao}
            onChange={(e) => setPosicao(e.target.value)}
            style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
          >
            <option value="" disabled>Selecione...</option>
            {POSICOES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Erro */}
        {error && (
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--danger)" }}>
            {error}
          </p>
        )}

        {/* Botões */}
        <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
          <button
            type="submit"
            style={{
              flex: 1,
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "var(--action-primary)",
              border: "none",
              borderRadius: "var(--radius-md)",
              padding: "14px",
              cursor: "pointer",
              transition: "background-color 0.15s",
            }}
          >
            Salvar atleta
          </button>
          <Link
            href="/jogadores"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              fontWeight: 500,
              color: "var(--text-secondary)",
              backgroundColor: "transparent",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius-md)",
              padding: "14px 20px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
