import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { getSiglasSeed, Sigla } from "./src/data/siglas_seed.ts";
import { blogArticles, BlogArticle } from "./src/data/blog_seed.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

app.use(express.json({ limit: "50mb" }));

// Paths for persistent databases
const DATA_DIR = path.join(__dirname, "src", "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SIGLAS_DB_PATH = path.join(DATA_DIR, "db.json");
const BLOG_DB_PATH = path.join(DATA_DIR, "blog_db.json");

// Local in-memory databases (loaded from JSON files and synced)
let siglasList: Sigla[] = [];
let blogList: BlogArticle[] = [];

// Initialize databases
function initializeDB() {
  try {
    // Siglas DB
    if (fs.existsSync(SIGLAS_DB_PATH)) {
      console.log("Carregando banco de siglas existente...");
      const data = fs.readFileSync(SIGLAS_DB_PATH, "utf-8");
      siglasList = JSON.parse(data);
    } else {
      console.log("Iniciando sementeira inicial de siglas (+500 registros)...");
      siglasList = getSiglasSeed();
      fs.writeFileSync(SIGLAS_DB_PATH, JSON.stringify(siglasList, null, 2), "utf-8");
    }

    // Blog DB
    if (fs.existsSync(BLOG_DB_PATH)) {
      console.log("Carregando blog existente...");
      const data = fs.readFileSync(BLOG_DB_PATH, "utf-8");
      blogList = JSON.parse(data);
    } else {
      console.log("Iniciando sementeira do blog...");
      blogList = blogArticles;
      fs.writeFileSync(BLOG_DB_PATH, JSON.stringify(blogList, null, 2), "utf-8");
    }
    console.log(`Banco inicializado com sucesso. ${siglasList.length} siglas e ${blogList.length} artigos carregados.`);
  } catch (err) {
    console.error("Erro ao inicializar o banco de dados:", err);
    siglasList = getSiglasSeed();
    blogList = blogArticles;
  }
}

initializeDB();

// Helper to save databases
function saveSiglas() {
  fs.writeFileSync(SIGLAS_DB_PATH, JSON.stringify(siglasList, null, 2), "utf-8");
}

function saveBlog() {
  fs.writeFileSync(BLOG_DB_PATH, JSON.stringify(blogList, null, 2), "utf-8");
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. STATS: Portal global statistics
app.get("/api/stats", (req, res) => {
  const totalSiglas = siglasList.length;
  const categoriesMap = new Map<string, number>();
  siglasList.forEach(s => {
    categoriesMap.set(s.categoria, (categoriesMap.get(s.categoria) || 0) + 1);
  });
  
  res.json({
    totalSiglas,
    totalCategorias: categoriesMap.size,
    popular: siglasList.filter(s => s.popularidade > 80).slice(0, 8),
    latest: [...siglasList].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 8),
    categories: Array.from(categoriesMap.entries()).map(([name, count]) => ({ name, count }))
  });
});

// 2. SIGLAS CRUD: Search, Filter, Pagination
app.get("/api/siglas", (req, res) => {
  const { search, category, letter, order } = req.query;
  let filtered = [...siglasList];

  // Apply search query
  if (search) {
    const q = String(search).toLowerCase().trim();
    filtered = filtered.filter(
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

  // Apply category filter
  if (category && category !== "Todas") {
    filtered = filtered.filter(s => s.categoria.toLowerCase() === String(category).toLowerCase());
  }

  // Apply starting letter filter
  if (letter && letter !== "Todas") {
    const l = String(letter).toUpperCase();
    filtered = filtered.filter(s => s.sigla.toUpperCase().startsWith(l));
  }

  // Apply sorting order
  if (order === "az") {
    filtered.sort((a, b) => a.sigla.localeCompare(b.sigla));
  } else if (order === "za") {
    filtered.sort((a, b) => b.sigla.localeCompare(a.sigla));
  } else if (order === "popular") {
    filtered.sort((a, b) => b.popularidade - a.popularidade);
  } else if (order === "recente") {
    filtered.sort((a, b) => b.id.localeCompare(a.id));
  } else {
    // Default: Sort alphabetically
    filtered.sort((a, b) => a.sigla.localeCompare(b.sigla));
  }

  res.json(filtered);
});

// 3. GET Single Sigla by slug
app.get("/api/siglas/slug/:slug", (req, res) => {
  const { slug } = req.params;
  const sigla = siglasList.find(s => s.slug === slug.toLowerCase());
  if (!sigla) {
    return res.status(404).json({ error: "Sigla não encontrada" });
  }
  res.json(sigla);
});

// 4. POST Create Sigla
app.post("/api/siglas", (req, res) => {
  const { sigla, nome_completo, traducao, descricao_curta, descricao_longa, categoria, subcategoria, origem, historia, pronuncia, exemplo, tags, tipo, sinonimos, palavras_chave, nome_ingles, nome_portugues } = req.body;
  
  if (!sigla || !nome_completo || !descricao_curta || !categoria) {
    return res.status(400).json({ error: "Os campos Sigla, Nome Completo, Descrição Curta e Categoria são obrigatórios." });
  }

  const normalizedSigla = sigla.toUpperCase().trim();
  const slug = normalizedSigla.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // Check for duplicate in the same category
  const duplicate = siglasList.find(s => s.sigla === normalizedSigla && s.categoria === categoria);
  if (duplicate) {
    return res.status(400).json({ error: `A sigla "${normalizedSigla}" já existe na categoria "${categoria}".` });
  }

  const newSigla: Sigla = {
    id: `sigla-custom-${Date.now()}`,
    sigla: normalizedSigla,
    slug: slug,
    nome_completo: nome_completo.trim(),
    traducao: traducao ? traducao.trim() : "Não aplicável",
    descricao_curta: descricao_curta.trim(),
    descricao_longa: descricao_longa ? descricao_longa.trim() : `${nome_completo} é um conceito chave na área de ${categoria}.`,
    categoria: categoria.trim(),
    subcategoria: subcategoria ? subcategoria.trim() : "Geral",
    origem: origem ? origem.trim() : "Português",
    historia: historia ? historia.trim() : "Adicionada via contribuição da comunidade.",
    pronuncia: pronuncia ? pronuncia.trim() : normalizedSigla.split("").join("-"),
    exemplo: exemplo ? exemplo.trim() : `Exemplo de uso de ${normalizedSigla} em reuniões.`,
    tags: Array.isArray(tags) ? tags : [categoria.toLowerCase()],
    popularidade: 50,
    criado_em: new Date().toISOString(),
    atualizado_em: new Date().toISOString(),
    tipo: tipo || "SIGLA",
    sinonimos: Array.isArray(sinonimos) ? sinonimos : [],
    palavras_chave: Array.isArray(palavras_chave) ? palavras_chave : [],
    nome_ingles: nome_ingles || "",
    nome_portugues: nome_portugues || ""
  };

  siglasList.push(newSigla);
  saveSiglas();
  res.status(201).json(newSigla);
});

// 5. PUT Update Sigla
app.put("/api/siglas/:id", (req, res) => {
  const { id } = req.params;
  const index = siglasList.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Sigla não encontrada" });
  }

  const body = req.body;
  const current = siglasList[index];

  const updatedSigla: Sigla = {
    ...current,
    sigla: body.sigla ? body.sigla.toUpperCase().trim() : current.sigla,
    slug: body.sigla ? body.sigla.toLowerCase().replace(/[^a-z0-9]+/g, "-") : current.slug,
    nome_completo: body.nome_completo ? body.nome_completo.trim() : current.nome_completo,
    traducao: body.traducao !== undefined ? body.traducao.trim() : current.traducao,
    descricao_curta: body.descricao_curta ? body.descricao_curta.trim() : current.descricao_curta,
    descricao_longa: body.descricao_longa ? body.descricao_longa.trim() : current.descricao_longa,
    categoria: body.categoria ? body.categoria.trim() : current.categoria,
    subcategoria: body.subcategoria ? body.subcategoria.trim() : current.subcategoria,
    origem: body.origem ? body.origem.trim() : current.origem,
    historia: body.historia !== undefined ? body.historia.trim() : current.historia,
    pronuncia: body.pronuncia !== undefined ? body.pronuncia.trim() : current.pronuncia,
    exemplo: body.exemplo !== undefined ? body.exemplo.trim() : current.exemplo,
    tags: Array.isArray(body.tags) ? body.tags : current.tags,
    popularidade: body.popularidade !== undefined ? Number(body.popularidade) : current.popularidade,
    atualizado_em: new Date().toISOString(),
    tipo: body.tipo !== undefined ? body.tipo : current.tipo,
    sinonimos: Array.isArray(body.sinonimos) ? body.sinonimos : current.sinonimos,
    palavras_chave: Array.isArray(body.palavras_chave) ? body.palavras_chave : current.palavras_chave,
    nome_ingles: body.nome_ingles !== undefined ? body.nome_ingles : current.nome_ingles,
    nome_portugues: body.nome_portugues !== undefined ? body.nome_portugues : current.nome_portugues
  };

  siglasList[index] = updatedSigla;
  saveSiglas();
  res.json(updatedSigla);
});

// 6. DELETE Sigla
app.delete("/api/siglas/:id", (req, res) => {
  const { id } = req.params;
  const index = siglasList.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Sigla não encontrada" });
  }

  siglasList.splice(index, 1);
  saveSiglas();
  res.json({ message: "Sigla excluída com sucesso." });
});

// 7. IMPORT JSON: Batch import siglas
app.post("/api/siglas/import-json", (req, res) => {
  const { data } = req.body;
  if (!Array.isArray(data)) {
    return res.status(400).json({ error: "O formato de dados deve ser um array JSON de siglas." });
  }

  let count = 0;
  data.forEach((item: any) => {
    if (item.sigla && item.nome_completo && item.descricao_curta && item.categoria) {
      const sig = item.sigla.toUpperCase().trim();
      const slug = sig.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      const newSigla: Sigla = {
        id: `sigla-import-${Date.now()}-${count}`,
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
        tags: Array.isArray(item.tags) ? item.tags : [item.categoria.toLowerCase()],
        popularidade: item.popularidade ? Number(item.popularidade) : 50,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
      };

      siglasList.push(newSigla);
      count++;
    }
  });

  if (count > 0) {
    saveSiglas();
  }
  res.json({ message: `Importados ${count} registros com sucesso.` });
});

// 8. IMPORT CSV: Batch import siglas from CSV text
app.post("/api/siglas/import-csv", (req, res) => {
  const { csvText } = req.body;
  if (!csvText || typeof csvText !== "string") {
    return res.status(400).json({ error: "O corpo deve conter a propriedade csvText válida." });
  }

  try {
    const lines = csvText.split(/\r?\n/);
    if (lines.length < 2) {
      return res.status(400).json({ error: "O arquivo CSV deve possuir um cabeçalho e pelo menos uma linha de dados." });
    }

    // Parse header
    const headers = lines[0].split(";").map(h => h.trim().toLowerCase());
    const dataLines = lines.slice(1);
    
    let count = 0;
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
          tags: row.tags ? row.tags.split(",").map((t: string) => t.trim()) : [row.categoria.toLowerCase()],
          popularidade: row.popularidade ? Number(row.popularidade) : 50,
          criado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString()
        };
        siglasList.push(newSigla);
        count++;
      }
    });

    if (count > 0) {
      saveSiglas();
    }
    res.json({ message: `Importadas ${count} siglas via CSV com sucesso.` });
  } catch (err: any) {
    res.status(500).json({ error: "Erro ao processar o CSV: " + err.message });
  }
});

// 9. EXPORT CSV: Export all database siglas to downloadable CSV
app.get("/api/siglas/export-csv", (req, res) => {
  try {
    const headers = ["sigla", "nome_completo", "traducao", "descricao_curta", "descricao_longa", "categoria", "subcategoria", "origem", "historia", "pronuncia", "exemplo", "tags", "popularidade"];
    const csvLines = [headers.join(";")];

    siglasList.forEach(s => {
      const line = [
        s.sigla,
        s.nome_completo,
        s.traducao,
        s.descricao_curta.replace(/;/g, ","),
        s.descricao_longa.replace(/;/g, ",").replace(/\r?\n/g, " "),
        s.categoria,
        s.subcategoria,
        s.origem,
        s.historia ? s.historia.replace(/;/g, ",").replace(/\r?\n/g, " ") : "",
        s.pronuncia,
        s.exemplo ? s.exemplo.replace(/;/g, ",").replace(/\r?\n/g, " ") : "",
        s.tags.join(","),
        s.popularidade
      ];
      csvLines.push(line.join(";"));
    });

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=dicionario-corporativo-export.csv");
    res.send(csvLines.join("\n"));
  } catch (err: any) {
    res.status(500).json({ error: "Erro ao exportar dados: " + err.message });
  }
});

// 10. BLOG API
app.get("/api/blog", (req, res) => {
  res.json(blogList);
});

app.get("/api/blog/:slug", (req, res) => {
  const article = blogList.find(a => a.slug === req.params.slug);
  if (!article) {
    return res.status(404).json({ error: "Artigo não encontrado" });
  }
  res.json(article);
});

// Dynamic XML Sitemap Generator
app.get("/sitemap.xml", (req, res) => {
  const baseUrl = process.env.APP_URL || "https://siglascorporativasaprender.com.br";
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Add Home
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  
  // Add Blog Home
  xml += `  <url>\n    <loc>${baseUrl}/blog</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;

  // Add SEO Friendly Category Pages
  const categoryPaths = [
    "/siglas-marketing",
    "/siglas-rh",
    "/siglas-financeiras",
    "/siglas-tecnologia",
    "/siglas-vendas",
    "/siglas-logistica",
    "/siglas-gestao"
  ];
  categoryPaths.forEach(path => {
    xml += `  <url>\n    <loc>${baseUrl}${path}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  // Add all siglas using their precise type prefix (sigla, termo, cargo, etc.) for accurate routing
  siglasList.forEach(s => {
    const prefix = s.tipo?.toLowerCase() || "sigla";
    xml += `  <url>\n    <loc>${baseUrl}/${prefix}/${s.slug}</loc>\n    <lastmod>${s.atualizado_em.split("T")[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  });

  // Add all blog posts
  blogList.forEach(b => {
    xml += `  <url>\n    <loc>${baseUrl}/blog/${b.slug}</loc>\n    <lastmod>${b.data}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  
  res.setHeader("Content-Type", "application/xml");
  res.send(xml);
});

// Robots.txt
app.get("/robots.txt", (req, res) => {
  const baseUrl = process.env.APP_URL || "https://siglascorporativasaprender.com.br";
  const content = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`;
  res.setHeader("Content-Type", "text/plain");
  res.send(content);
});

// ----------------------------------------------------
// DYNAMIC SEO INJECTION HELPER
// ----------------------------------------------------
function injectSEOMetadata(html: string, urlPath: string): string {
  const baseUrl = process.env.APP_URL || "https://siglascorporativasaprender.com.br";
  
  let title = "Siglas Corporativas - O Maior Dicionário Online do Brasil | SIGLAS CORPORATIVAS";
  let desc = "Descubra o significado das siglas corporativas mais utilizadas no mercado empresarial. Aprenda termos de marketing, financeiro, tecnologia, RH e muito mais.";
  let canonical = `${baseUrl}${urlPath}`;
  let schemaString = "";

  const CATEGORY_SEO_INFO: Record<string, { title: string; desc: string; categoryName: string }> = {
    "/siglas-marketing": {
      categoryName: "Marketing",
      title: "Siglas Corporativas de Marketing - Significado e Conceitos | SIGLAS CORPORATIVAS",
      desc: "Aprenda o significado das siglas corporativas de marketing mais importantes do mercado: CAC, LTV, CTR, ROI, CPA e muito mais. Domine os jargões do marketing digital."
    },
    "/siglas-rh": {
      categoryName: "Recursos Humanos",
      title: "Siglas Corporativas de Recursos Humanos (RH) - Dicionário Completo | SIGLAS CORPORATIVAS",
      desc: "Descubra o significado das siglas corporativas de RH e Gestão de Pessoas: CLT, PJ, EVP, PDI, ATS e mais. O maior glossário corporativo de Recursos Humanos."
    },
    "/siglas-financeiras": {
      categoryName: "Financeiro",
      title: "Siglas Corporativas Financeiras - Glossário Contábil e de Negócios | SIGLAS CORPORATIVAS",
      desc: "Compreenda e aprenda siglas corporativas financeiras mais influentes: EBITDA, ROI, DRE, CAGR, CAPEX, OPEX. Essencial para investidores e executivos."
    },
    "/siglas-tecnologia": {
      categoryName: "Tecnologia",
      title: "Siglas Corporativas de Tecnologia e TI - Lista e Significado | SIGLAS CORPORATIVAS",
      desc: "Estude o significado das siglas corporativas de tecnologia, desenvolvimento de software e TI: API, SaaS, BI, UX, UI, CTO. Domine o vocabulário tech."
    },
    "/siglas-vendas": {
      categoryName: "Vendas",
      title: "Siglas Corporativas de Vendas e Comercial - Significado | SIGLAS CORPORATIVAS",
      desc: "Aprenda o significado das siglas corporativas de vendas: CRM, SQL, MQL, SDR, LTV. Melhore a performance de suas equipes e funil comercial."
    },
    "/siglas-logistica": {
      categoryName: "Logística",
      title: "Siglas Corporativas de Logística e Supply Chain - Dicionário | SIGLAS CORPORATIVAS",
      desc: "Aprenda o significado das principais siglas corporativas de logística: SLA, SKU, 3PL, WMS, FIFO, ERP. Otimize o vocabulário da sua cadeia de suprimentos."
    },
    "/siglas-gestao": {
      categoryName: "Gestão",
      title: "Siglas Corporativas de Gestão e Administração - Significado | SIGLAS CORPORATIVAS",
      desc: "Conheça o significado das siglas corporativas de gestão e administração: OKR, KPI, CEO, CFO, COO, PMO. Desenvolva sua liderança profissional."
    }
  };

  const categorySeo = CATEGORY_SEO_INFO[urlPath];

  // 1. Sigla / Termo / Cargo / Departamento / Metodologia / Ferramenta / Conceito Route
  const siglaPrefixes = ["/sigla/", "/termo/", "/cargo/", "/departamento/", "/metodologia/", "/ferramenta/", "/conceito/"];
  const matchedPrefix = siglaPrefixes.find(p => urlPath.startsWith(p));

  if (matchedPrefix) {
    const slug = urlPath.replace(matchedPrefix, "").split(/[?#]/)[0];
    const sigla = siglasList.find(s => s.slug === slug.toLowerCase());
    if (sigla) {
      title = `${sigla.sigla} - Significado, Tradução e Exemplo | SIGLAS CORPORATIVAS`;
      desc = `O que significa a sigla ${sigla.sigla} (${sigla.nome_completo})? Saiba a tradução, pronúncia correta, quando utilizar e exemplo prático de uso empresarial.`;
      
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `O que significa a sigla ${sigla.sigla}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `${sigla.sigla} significa ${sigla.nome_completo}. ${sigla.descricao_curta}`
            }
          },
          {
            "@type": "Question",
            "name": `Qual a pronúncia de ${sigla.sigla}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `A pronúncia mais comum de ${sigla.sigla} no ambiente corporativo brasileiro é "${sigla.pronuncia}".`
            }
          },
          {
            "@type": "Question",
            "name": `Pode dar um exemplo prático de uso de ${sigla.sigla}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Sim! Exemplo prático de frase: "${sigla.exemplo}"`
            }
          }
        ]
      };

      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Início", "item": `${baseUrl}/` },
          { "@type": "ListItem", "position": 2, "name": sigla.categoria, "item": `${baseUrl}/?categoria=${encodeURIComponent(sigla.categoria)}` },
          { "@type": "ListItem", "position": 3, "name": sigla.sigla, "item": canonical }
        ]
      };

      schemaString = `
        <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
      `;
    }
  } 
  // 2. Blog Post Route
  else if (urlPath.startsWith("/blog/")) {
    const slug = urlPath.replace("/blog/", "").split(/[?#]/)[0];
    const article = blogList.find(a => a.slug === slug.toLowerCase());
    if (article) {
      title = `${article.titulo} | Blog SIGLAS CORPORATIVAS`;
      desc = article.descricao;

      const blogSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.titulo,
        "description": article.descricao,
        "author": {
          "@type": "Person",
          "name": article.autor
        },
        "datePublished": article.data,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonical
        }
      };

      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Início", "item": `${baseUrl}/` },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${baseUrl}/blog` },
          { "@type": "ListItem", "position": 3, "name": article.titulo, "item": canonical }
        ]
      };

      schemaString = `
        <script type="application/ld+json">${JSON.stringify(blogSchema)}</script>
        <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
      `;
    }
  }
  // 3. Category Page Routes
  else if (categorySeo) {
    title = categorySeo.title;
    desc = categorySeo.desc;
    
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Início", "item": `${baseUrl}/` },
        { "@type": "ListItem", "position": 2, "name": `Siglas de ${categorySeo.categoryName}`, "item": canonical }
      ]
    };
    schemaString = `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`;
  }
  // 4. General Site Schema
  else {
    const portalSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "SIGLAS CORPORATIVAS",
      "url": baseUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
    schemaString = `<script type="application/ld+json">${JSON.stringify(portalSchema)}</script>`;
  }

  // Replace default elements in template index.html
  let processed = html;
  processed = processed.replace("<title>My Google AI Studio App</title>", `<title>${title}</title>`);
  
  const seoHeadContent = `
    <meta name="description" content="${desc}" />
    <link rel="canonical" href="${canonical}" />
    <!-- OpenGraph Meta Tags -->
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${baseUrl}/assets/cover.png" />
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${baseUrl}/assets/cover.png" />
    <!-- Structured Data -->
    ${schemaString}
  `;

  return processed.replace("</head>", `${seoHeadContent}</head>`);
}

// ----------------------------------------------------
// VITE INTEGRATION MIDDLEWARE
// ----------------------------------------------------
async function startServer() {
  // Explicit route for Google Search Console Verification
  app.get("/google072a8f187fc0c605.html", (req, res) => {
    res.type("text/html").send("google-site-verification: google072a8f187fc0c605.html");
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    // Use vite's middlewares to compile client-side React files
    app.use(vite.middlewares);

    // Dynamic SPA Route server-side interception for SEO injection
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");
        // Apply Vite HTML transformations
        template = await vite.transformIndexHtml(url, template);
        // Inject SEO tags
        const html = injectSEOMetadata(template, url);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production Mode: static files from dist
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath, { index: false }));

    app.get("*", (req, res) => {
      const url = req.originalUrl;
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        const template = fs.readFileSync(indexPath, "utf-8");
        const html = injectSEOMetadata(template, url);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } else {
        res.status(404).send("Index template not built yet. Please run build script.");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n==================================================`);
    console.log(`🚀 DICIONÁRIO CORPORATIVO running on http://0.0.0.0:${PORT}`);
    console.log(`==================================================\n`);
  });
}

startServer();
