"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

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
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: "var(--text-secondary)",
  marginBottom: "6px",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "380px" }}>
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <Image
            src="/logo-lendarios.png"
            alt="Lendários Esporte Clube"
            width={0}
            height={80}
            sizes="100vw"
            style={{ width: "auto", height: "80px" }}
            className="object-contain"
          />
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "0.5px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "32px",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              color: "var(--text-primary)",
              letterSpacing: "0.05em",
              marginBottom: "24px",
            }}
            className="uppercase"
          >
            Entrar
          </h1>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={labelStyle}>E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
              />
            </div>

            {error && (
              <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--danger)" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                fontWeight: 600,
                color: "#fff",
                backgroundColor: "var(--action-primary)",
                border: "none",
                borderRadius: "var(--radius-md)",
                padding: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.15s",
                marginTop: "4px",
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            color: "var(--text-tertiary)",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          Lendários Esporte Clube · Gestão interna
        </p>
      </div>
    </div>
  );
}
