import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = "https://siglascorporativasaprender.vercel.app";

// Paths
const dbPath = path.join(__dirname, "..", "src", "data", "db.json");
const blogDbPath = path.join(__dirname, "..", "src", "data", "blog_db.json");
const sitemapPath = path.join(__dirname, "..", "public", "sitemap.xml");
const rootSitemapPath = path.join(__dirname, "..", "sitemap.xml");
const robotsPath = path.join(__dirname, "..", "public", "robots.txt");
const rootRobotsPath = path.join(__dirname, "..", "robots.txt");

try {
  console.log("Iniciando a geração estática do sitemap.xml...");
  
  let siglas = [];
  if (fs.existsSync(dbPath)) {
    siglas = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  } else {
    console.warn("db.json não encontrado em " + dbPath);
  }

  let blog = [];
  if (fs.existsSync(blogDbPath)) {
    blog = JSON.parse(fs.readFileSync(blogDbPath, "utf-8"));
  } else {
    console.warn("blog_db.json não encontrado em " + blogDbPath);
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Add Home
  const today = new Date().toISOString().split("T")[0];
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  
  // Add Blog Home
  xml += `  <url>\n    <loc>${baseUrl}/blog</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;

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
  categoryPaths.forEach(p => {
    xml += `  <url>\n    <loc>${baseUrl}${p}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  // Add all siglas using their precise type prefix
  siglas.forEach(s => {
    const prefix = s.tipo?.toLowerCase() || "sigla";
    const lastmod = s.atualizado_em ? s.atualizado_em.split("T")[0] : today;
    xml += `  <url>\n    <loc>${baseUrl}/${prefix}/${s.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  });

  // Add all blog posts
  blog.forEach(b => {
    const lastmod = b.data || today;
    xml += `  <url>\n    <loc>${baseUrl}/blog/${b.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;

  // Make sure public/ exists
  const publicDir = path.join(__dirname, "..", "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(sitemapPath, xml, "utf-8");
  fs.writeFileSync(rootSitemapPath, xml, "utf-8");
  console.log(`Sitemap gerado com sucesso com ${siglas.length + blog.length + 9} URLs em ${sitemapPath} e ${rootSitemapPath}`);

  // Also generate robots.txt statically
  const robotsContent = `User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml
`;
  fs.writeFileSync(robotsPath, robotsContent, "utf-8");
  fs.writeFileSync(rootRobotsPath, robotsContent, "utf-8");
  console.log(`robots.txt gerado com sucesso em ${robotsPath} e ${rootRobotsPath}`);

} catch (err) {
  console.error("Erro ao gerar arquivos de SEO estáticos:", err);
  process.exit(1);
}
