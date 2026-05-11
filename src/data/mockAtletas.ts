export interface Atleta {
  id: number;
  nome: string;
  posicao: string;
  numero: number;
  foto?: string;
}

export const mockAtletas: Atleta[] = [
  { id: 1, nome: "Ana Lima",       posicao: "Levantadora", numero: 7  },
  { id: 2, nome: "Carlos Mendes",  posicao: "Oposto",      numero: 12 },
  { id: 3, nome: "Dani Ferreira",  posicao: "Líbero",      numero: 1  },
  { id: 4, nome: "Nico Barbosa",   posicao: "Central",     numero: 5  },
  { id: 5, nome: "Theo Alves",     posicao: "Ponteiro",    numero: 3  },
  { id: 6, nome: "Marina Costa",   posicao: "Levantadora", numero: 8  },
  { id: 7, nome: "Rafael Souza",   posicao: "Central",     numero: 9  },
  { id: 8, nome: "Luiza Teixeira", posicao: "Ponteiro",    numero: 14 },
];
