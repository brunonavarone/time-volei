import { createClient } from "./supabase/client";
import type { Atleta } from "@/data/mockAtletas";

type AtletaRow = {
  id: number;
  nome: string;
  posicao: string;
  numero: number;
  foto: string | null;
};

function fromRow(row: AtletaRow): Atleta {
  return { ...row, foto: row.foto ?? undefined };
}

export async function getAtletas(): Promise<Atleta[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("atletas")
    .select("id, nome, posicao, numero, foto")
    .order("nome");
  if (error || !data) return [];
  return (data as AtletaRow[]).map(fromRow);
}

export async function saveAtleta(atleta: Omit<Atleta, "id">): Promise<void> {
  const supabase = createClient();
  await supabase.from("atletas").insert({
    nome: atleta.nome,
    posicao: atleta.posicao,
    numero: atleta.numero,
    foto: atleta.foto ?? null,
  });
}

export async function deleteAtleta(id: number): Promise<void> {
  const supabase = createClient();
  await supabase.from("atletas").delete().eq("id", id);
}
