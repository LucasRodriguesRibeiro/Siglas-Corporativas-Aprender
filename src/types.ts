/**
 * Shared Type Definitions for the Dicionário Corporativo Application.
 */

export interface Sigla {
  id: string;
  sigla: string; // This can represent the acronym, short term, or name
  slug: string;
  nome_completo: string; // Full name or title
  traducao: string;
  descricao_curta: string;
  descricao_longa: string;
  categoria: string;
  subcategoria: string;
  origem: string;
  historia: string;
  pronuncia: string;
  exemplo: string;
  tags: string[];
  popularidade: number;
  criado_em: string;
  atualizado_em: string;
  
  // New Universal Search fields
  tipo?: 'SIGLA' | 'TERMO' | 'CARGO' | 'DEPARTAMENTO' | 'METODOLOGIA' | 'FERRAMENTA' | 'CONCEITO';
  sinonimos?: string[];
  palavras_chave?: string[];
  nome_ingles?: string;
  nome_portugues?: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  conteudo: string;
  autor: string;
  data: string;
  categoria: string;
  tags: string[];
  tempo_leitura: string;
}

export interface PortalStats {
  totalSiglas: number;
  totalCategorias: number;
  popular: Sigla[];
  latest: Sigla[];
  categories: { name: string; count: number }[];
}

export function getItemUrl(item: { tipo?: string; slug: string }) {
  const t = item.tipo?.toLowerCase() || "sigla";
  return `/${t}/${item.slug}`;
}
