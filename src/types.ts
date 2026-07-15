/**
 * Shared Type Definitions for the Dicionário Corporativo Application.
 */

export interface Sigla {
  id: string;
  sigla: string;
  slug: string;
  nome_completo: string;
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
