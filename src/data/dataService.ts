import { getSiglasSeed, Sigla } from "./siglas_seed";
import { blogArticles } from "./blog_seed";
import { PortalStats, BlogArticle } from "../types";

// Key for browser localStorage persistence
const CUSTOM_SIGLAS_KEY = "dicionario_custom_siglas";

// Retrieve custom siglas from localStorage
export function getCustomSiglas(): Sigla[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CUSTOM_SIGLAS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Erro ao ler siglas customizadas do localStorage:", err);
    return [];
  }
}

// Save custom siglas to localStorage
export function saveCustomSiglas(siglas: Sigla[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_SIGLAS_KEY, JSON.stringify(siglas));
  } catch (err) {
    console.error("Erro ao salvar siglas customizadas no localStorage:", err);
  }
}

// Merge seeded siglas with custom user siglas
export function getAllSiglas(): Sigla[] {
  const seedList = getSiglasSeed();
  const customList = getCustomSiglas();
  
  // Combine lists, making sure custom ones take precedence or don't clash on IDs
  // Since we also want to allow overriding or appending, we'll merge them
  const result = [...customList];
  
  // Add seed list items if they are not already in the custom list (by ID or combination of sigla + categoria)
  seedList.forEach(seedItem => {
    const isDuplicate = result.some(
      item => 
        item.id === seedItem.id || 
        (item.sigla.toUpperCase() === seedItem.sigla.toUpperCase() && 
         item.categoria.toLowerCase() === seedItem.categoria.toLowerCase())
    );
    if (!isDuplicate) {
      result.push(seedItem);
    }
  });

  return result;
}

// Retrieve Portal Statistics dynamically
export function getPortalStats(): PortalStats {
  const list = getAllSiglas();
  const totalSiglas = list.length;
  
  const categoriesMap = new Map<string, number>();
  list.forEach(s => {
    categoriesMap.set(s.categoria, (categoriesMap.get(s.categoria) || 0) + 1);
  });
  
  const popular = list.filter(s => s.popularidade > 80).slice(0, 8);
  const latest = [...list].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 8);
  const categories = Array.from(categoriesMap.entries()).map(([name, count]) => ({ name, count }));

  return {
    totalSiglas,
    totalCategorias: categoriesMap.size,
    popular,
    latest,
    categories
  };
}

// Fetch and filter siglas (replaces /api/siglas with client-side query handler)
export interface GetSiglasFilters {
  search?: string;
  category?: string;
  letter?: string;
  order?: string;
}

export function getFilteredSiglas(filters: GetSiglasFilters = {}): Sigla[] {
  let list = getAllSiglas();

  // 1. Search filter
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(
      s =>
        s.sigla.toLowerCase().includes(q) ||
        s.nome_completo.toLowerCase().includes(q) ||
        s.descricao_curta.toLowerCase().includes(q) ||
        s.categoria.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q)) ||
        (s.tipo && s.tipo.toLowerCase().includes(q)) ||
        (s.nome_ingles && s.nome_ingles.toLowerCase().includes(q)) ||
        (s.nome_portugues && s.nome_portugues.toLowerCase().includes(q)) ||
        (s.sinonimos && s.sinonimos.some(sin => sin.toLowerCase().includes(q))) ||
        (s.palavras_chave && s.palavras_chave.some(pc => pc.toLowerCase().includes(q)))
    );
  }

  // 2. Category filter
  if (filters.category && filters.category !== "Todas") {
    list = list.filter(s => s.categoria.toLowerCase() === filters.category!.toLowerCase());
  }

  // 3. Starting letter filter
  if (filters.letter && filters.letter !== "Todas") {
    const l = filters.letter.toUpperCase();
    list = list.filter(s => s.sigla.toUpperCase().startsWith(l));
  }

  // 4. Sorting order
  if (filters.order === "az") {
    list.sort((a, b) => a.sigla.localeCompare(b.sigla));
  } else if (filters.order === "za") {
    list.sort((a, b) => b.sigla.localeCompare(a.sigla));
  } else if (filters.order === "popular") {
    list.sort((a, b) => b.popularidade - a.popularidade);
  } else if (filters.order === "recente") {
    list.sort((a, b) => b.id.localeCompare(a.id));
  } else {
    // Default alphabetical
    list.sort((a, b) => a.sigla.localeCompare(b.sigla));
  }

  return list;
}

// Get single sigla by its slug
export function getSiglaBySlug(slug: string): Sigla | null {
  const list = getAllSiglas();
  const found = list.find(s => s.slug === slug.toLowerCase());
  return found || null;
}

// Add a new contribution / custom sigla
export function createCustomSigla(payload: {
  sigla: string;
  nome_completo: string;
  traducao?: string;
  descricao_curta: string;
  descricao_longa?: string;
  categoria: string;
  subcategoria?: string;
  origem?: string;
  historia?: string;
  pronuncia?: string;
  exemplo?: string;
  tags?: string[];
  tipo?: 'SIGLA' | 'TERMO' | 'CARGO' | 'DEPARTAMENTO' | 'METODOLOGIA' | 'FERRAMENTA' | 'CONCEITO';
  sinonimos?: string[];
  palavras_chave?: string[];
  nome_ingles?: string;
  nome_portugues?: string;
}): Sigla {
  const normalizedSigla = payload.sigla.toUpperCase().trim();
  const slug = normalizedSigla.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  const customList = getCustomSiglas();
  const combinedList = getAllSiglas();

  // Check duplicate
  const duplicate = combinedList.find(
    s => s.sigla === normalizedSigla && s.categoria === payload.categoria
  );
  if (duplicate) {
    throw new Error(`A sigla "${normalizedSigla}" já existe na categoria "${payload.categoria}".`);
  }

  const newSigla: Sigla = {
    id: `sigla-custom-${Date.now()}`,
    sigla: normalizedSigla,
    slug: slug,
    nome_completo: payload.nome_completo.trim(),
    traducao: payload.traducao ? payload.traducao.trim() : "Não aplicável",
    descricao_curta: payload.descricao_curta.trim(),
    descricao_longa: payload.descricao_longa ? payload.descricao_longa.trim() : `${payload.nome_completo} é um conceito chave na área de ${payload.categoria}.`,
    categoria: payload.categoria.trim(),
    subcategoria: payload.subcategoria ? payload.subcategoria.trim() : "Geral",
    origem: payload.origem ? payload.origem.trim() : "Português",
    historia: payload.historia ? payload.historia.trim() : "Adicionada via contribuição da comunidade.",
    pronuncia: payload.pronuncia ? payload.pronuncia.trim() : normalizedSigla.split("").join("-"),
    exemplo: payload.exemplo ? payload.exemplo.trim() : `Exemplo de uso de ${normalizedSigla} em reuniões corporativas.`,
    tags: Array.isArray(payload.tags) ? payload.tags : [payload.categoria.toLowerCase(), "contribuição"],
    popularidade: 50,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString(),
    tipo: payload.tipo || "SIGLA",
    sinonimos: Array.isArray(payload.sinonimos) ? payload.sinonimos : [],
    palavras_chave: Array.isArray(payload.palavras_chave) ? payload.palavras_chave : [],
    nome_ingles: payload.nome_ingles || "",
    nome_portugues: payload.nome_portugues || ""
  };

  // Prepend to custom list so user creations show up first
  customList.unshift(newSigla);
  saveCustomSiglas(customList);
  return newSigla;
}

// Get all blog articles
export function getBlogArticles(): BlogArticle[] {
  return blogArticles;
}

// Get single blog article by slug
export function getBlogArticleBySlug(slug: string): BlogArticle | null {
  const found = blogArticles.find(a => a.slug === slug.toLowerCase());
  return found || null;
}

// Client-side batch import of JSON data
export function importSiglasJson(data: any[]): number {
  if (!Array.isArray(data)) {
    throw new Error("O formato de dados deve ser um array JSON de siglas.");
  }

  const customList = getCustomSiglas();
  const combinedList = getAllSiglas();
  let importCount = 0;

  data.forEach((item, index) => {
    if (item.sigla && item.nome_completo && item.descricao_curta && item.categoria) {
      const sig = item.sigla.toUpperCase().trim();
      const slug = sig.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      // Prevent duplicates
      const exists = combinedList.some(
        s => s.sigla === sig && s.categoria === item.categoria
      );
      if (!exists) {
        const newSigla: Sigla = {
          id: `sigla-import-${Date.now()}-${index}`,
          sigla: sig,
          slug: slug,
          nome_completo: item.nome_completo.trim(),
          traducao: item.traducao ? item.traducao.trim() : "Não aplicável",
          descricao_curta: item.descricao_curta.trim(),
          descricao_longa: item.descricao_longa ? item.descricao_longa.trim() : `${item.nome_completo} é relevante em ${item.categoria}.`,
          categoria: item.categoria.trim(),
          subcategoria: item.subcategoria ? item.subcategoria.trim() : "Geral",
          origem: item.origem ? item.origem.trim() : "Inglês",
          historia: item.historia ? item.historia.trim() : "Importada via painel administrativo.",
          pronuncia: item.pronuncia ? item.pronuncia.trim() : sig.split("").join("-"),
          exemplo: item.exemplo ? item.exemplo.trim() : `Exemplo de uso de ${sig}.`,
          tags: Array.isArray(item.tags) ? item.tags : [item.categoria.toLowerCase(), "importado"],
          popularidade: item.popularidade ? Number(item.popularidade) : 50,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
          tipo: item.tipo || "SIGLA",
          sinonimos: Array.isArray(item.sinonimos) ? item.sinonimos : [],
          palavras_chave: Array.isArray(item.palavras_chave) ? item.palavras_chave : [],
          nome_ingles: item.nome_ingles || "",
          nome_portugues: item.nome_portugues || ""
        };
        customList.unshift(newSigla);
        importCount++;
      }
    }
  });

  if (importCount > 0) {
    saveCustomSiglas(customList);
  }

  return importCount;
}

// Client-side batch import of CSV text
export function importSiglasCsv(csvText: string): number {
  if (!csvText || typeof csvText !== "string") {
    throw new Error("O arquivo CSV fornecido é inválido.");
  }

  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) {
    throw new Error("O arquivo CSV deve possuir um cabeçalho e pelo menos uma linha de dados.");
  }

  const headers = lines[0].split(";").map(h => h.trim().toLowerCase());
  const dataLines = lines.slice(1);
  const customList = getCustomSiglas();
  const combinedList = getAllSiglas();
  let importCount = 0;

  dataLines.forEach((line, index) => {
    if (!line.trim()) return;
    const values = line.split(";").map(v => v.trim());
    
    const row: any = {};
    headers.forEach((header, colIdx) => {
      row[header] = values[colIdx] || "";
    });

    if (row.sigla && row.nome_completo && row.descricao_curta && row.categoria) {
      const sig = row.sigla.toUpperCase().trim();
      const slug = sig.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      const exists = combinedList.some(
        s => s.sigla === sig && s.categoria === row.categoria
      );
      if (!exists) {
        const newSigla: Sigla = {
          id: `sigla-csv-${Date.now()}-${index}`,
          sigla: sig,
          slug: slug,
          nome_completo: row.nome_completo,
          traducao: row.traducao || "Não aplicável",
          descricao_curta: row.descricao_curta,
          descricao_longa: row.descricao_longa || `${row.nome_completo} é um termo de ${row.categoria}.`,
          categoria: row.categoria,
          subcategoria: row.subcategoria || "Geral",
          origem: row.origem || "Inglês",
          historia: row.historia || "Importado via planilha CSV.",
          pronuncia: row.pronuncia || sig.split("").join("-"),
          exemplo: row.exemplo || `Utilizamos ${sig} no dia a dia.`,
          tags: row.tags ? row.tags.split(",").map((t: string) => t.trim()) : [row.categoria.toLowerCase(), "csv-import"],
          popularidade: row.popularidade ? Number(row.popularidade) : 50,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
          tipo: row.tipo || "SIGLA",
          sinonimos: row.sinonimos ? row.sinonimos.split(",").map((s: string) => s.trim()) : [],
          palavras_chave: row.palavras_chave ? row.palavras_chave.split(",").map((s: string) => s.trim()) : [],
          nome_ingles: row.nome_ingles || "",
          nome_portugues: row.nome_portugues || ""
        };
        customList.unshift(newSigla);
        importCount++;
      }
    }
  });

  if (importCount > 0) {
    saveCustomSiglas(customList);
  }

  return importCount;
}

// Client-side export of all siglas to downloadable CSV
export function exportSiglasToCsv() {
  const list = getAllSiglas();
  const headers = [
    "sigla", "nome_completo", "traducao", "descricao_curta", "descricao_longa", 
    "categoria", "subcategoria", "origem", "historia", "pronuncia", "exemplo", 
    "tags", "popularidade", "tipo", "sinonimos", "palavras_chave", "nome_ingles", "nome_portugues"
  ];
  
  const csvLines = [headers.join(";")];

  list.forEach(s => {
    const line = [
      s.sigla,
      s.nome_completo.replace(/;/g, ","),
      s.traducao ? s.traducao.replace(/;/g, ",") : "",
      s.descricao_curta.replace(/;/g, ","),
      s.descricao_longa.replace(/;/g, ",").replace(/\r?\n/g, " "),
      s.categoria,
      s.subcategoria ? s.subcategoria.replace(/;/g, ",") : "",
      s.origem,
      s.historia ? s.historia.replace(/;/g, ",").replace(/\r?\n/g, " ") : "",
      s.pronuncia ? s.pronuncia.replace(/;/g, ",") : "",
      s.exemplo ? s.exemplo.replace(/;/g, ",").replace(/\r?\n/g, " ") : "",
      s.tags.join(","),
      s.popularidade,
      s.tipo || "SIGLA",
      s.sinonimos ? s.sinonimos.join(",") : "",
      s.palavras_chave ? s.palavras_chave.join(",") : "",
      s.nome_ingles || "",
      s.nome_portugues || ""
    ];
    csvLines.push(line.join(";"));
  });

  const csvContent = "\uFEFF" + csvLines.join("\n"); // prepending UTF-8 BOM for proper Excel encoding
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "dicionario-corporativo-export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
