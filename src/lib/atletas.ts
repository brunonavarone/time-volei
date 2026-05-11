import { mockAtletas, type Atleta } from "@/data/mockAtletas";

const KEY = "lendarios_atletas";

export function getAtletas(): Atleta[] {
  if (typeof window === "undefined") return mockAtletas;
  try {
    const stored = localStorage.getItem(KEY);
    if (!stored) {
      localStorage.setItem(KEY, JSON.stringify(mockAtletas));
      return mockAtletas;
    }
    return JSON.parse(stored) as Atleta[];
  } catch {
    return mockAtletas;
  }
}

export function saveAtleta(atleta: Omit<Atleta, "id">): void {
  const list = getAtletas();
  const novo: Atleta = { ...atleta, id: Date.now() };
  localStorage.setItem(KEY, JSON.stringify([...list, novo]));
}

export function deleteAtleta(id: number): void {
  const list = getAtletas().filter((a) => a.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
}
