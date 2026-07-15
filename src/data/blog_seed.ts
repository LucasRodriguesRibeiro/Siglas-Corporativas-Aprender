/**
 * Seed data for the integrated blog articles.
 */

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

export const blogArticles: BlogArticle[] = [
  {
    id: "post-1",
    slug: "o-que-significa-kpi",
    titulo: "O que significa KPI? Entenda tudo sobre os Indicadores-Chave de Desempenho",
    descricao: "Descubra o significado de KPI, sua importância prática na gestão de empresas, exemplos práticos de indicadores e como implementar em seu negócio.",
    tempo_leitura: "5 min de leitura",
    autor: "Mariana Silva, Diretora de Operações",
    data: "2026-07-10",
    categoria: "Gestão",
    tags: ["kpi", "métrica", "gestão", "estratégia", "produtividade"],
    conteudo: `Os **KPIs (Key Performance Indicators)**, ou **Indicadores-Chave de Desempenho**, são as ferramentas de navegação essenciais de qualquer negócio moderno. Sem eles, liderar uma organização é como pilotar um navio em uma tempestade sem bússola.

### O que de fato é um KPI?
Um KPI é uma métrica quantificável que reflete o quão bem uma empresa ou equipe está progredindo em direção aos seus objetivos estratégicos de longo prazo. Enquanto uma empresa pode monitorar centenas de números operacionais secundários no dia a dia, os KPIs representam os números vitais que verdadeiramente determinam o sucesso ou fracasso da operação.

### Por que os KPIs são indispensáveis?
1. **Foco e Alinhamento:** Garante que toda a equipe saiba exatamente o que é prioridade.
2. **Tomada de Decisões Baseada em Fatos:** Elimina o "eu acho" da diretoria, substituindo-o por dados consolidados históricos.
3. **Melhoria Contínua:** Permite diagnosticar gargalos e falhas de processo de forma imediata antes que se tornem crises.

### Exemplos de KPIs em Diferentes Departamentos
- **Setor Financeiro:** Margem de Lucro Líquida, EBITDA, Custo de Capital.
- **Setor Comercial / Vendas:** Custo de Aquisição de Cliente (CAC), Lifetime Value (LTV), Ciclo Médio de Venda.
- **Recursos Humanos:** Taxa de Rotatividade de Funcionários (Turnover), Índice de Clima Organizacional, Horas de Treinamento por Colaborador.
- **Suporte / Atendimento:** Tempo Médio de Primeira Resposta, Net Promoter Score (NPS), Taxa de Resolução de Primeiro Contato (FCR).

### Como estruturar um bom KPI?
Para que um indicador seja de fato eficiente, ele deve obedecer à metodologia **SMART**:
- **S (Specific):** Deve ser específico e claro.
- **M (Measurable):** Deve ser perfeitamente mensurável por dados consolidados.
- **A (Achievable):** Deve ser ambicioso, porém alcançável pela equipe.
- **R (Relevant):** Deve estar diretamente ligado ao sucesso financeiro da empresa.
- **T (Time-bound):** Deve possuir um prazo limite bem definido para apuração.

Ao focar nos indicadores corretos, a sua equipe ganha clareza operacional para escalar o faturamento de forma previsível.`
  },
  {
    id: "post-2",
    slug: "diferenca-entre-kpi-e-okr",
    titulo: "Diferença entre KPI e OKR: Qual metodologia de gestão utilizar?",
    descricao: "Muitos confundem KPI e OKR, mas eles servem a propósitos diferentes. Descubra as diferenças cruciais e como usá-los de forma complementar na sua empresa.",
    tempo_leitura: "6 min de leitura",
    autor: "Rodrigo Mendes, Consultor Ágil",
    data: "2026-07-08",
    categoria: "Gestão",
    tags: ["kpi", "okr", "gestão", "planejamento", "metas"],
    conteudo: `No ecossistema de startups e empresas de alta performance, termos como **KPI (Key Performance Indicator)** e **OKR (Objectives and Key Results)** são ditos a todo momento. No entanto, muitos gestores cometem o erro crítico de tratar ambos os conceitos como sinônimos ou concorrentes diretos.

Na realidade, KPIs e OKRs são ferramentas perfeitamente **complementares** que desempenham papéis completamente diferentes no alinhamento corporativo.

### A Analogia do Carro e da Viagem
Para compreender a diferença de forma definitiva, imagine que você está dirigindo um carro em uma viagem interestadual:
- **Os KPIs são o painel do seu carro:** Eles indicam se o veículo está funcionando bem. Mostram o nível de combustível, a temperatura do motor, a velocidade atual e se há alguma falha mecânica. São indicadores de saúde contínua da operação.
- **Os OKRs são o seu GPS:** Eles definem o seu destino ambicioso e o caminho que você escolheu percorrer para chegar lá. Mostram para onde você está indo e como sabe que está se aproximando do seu destino.

### O que é o KPI (O Painel de Controle)
O KPI mede o desempenho de processos e atividades contínuas que já estão em execução. Ele avalia se as coisas estão correndo conforme o planejado no dia a dia operacional. 
*Exemplo de KPI:* Manter o tempo médio de atendimento abaixo de 10 minutos de forma contínua.

### O que é o OKR (O Direcionador de Mudanças)
O OKR é uma estrutura focada em inovação, transformação e metas altamente desafiadoras para o trimestre. Ele dita os saltos estratégicos que o negócio precisa dar para crescer.
*Exemplo de OKR:*
- **Objetivo (Onde queremos chegar):** Consolidar nossa liderança de suporte no Brasil.
- **Key Result 1 (Como medimos):** Alcançar um NPS histórico de 85.
- **Key Result 2 (Como medimos):** Implementar um bot de IA de autoatendimento, reduzindo o volume de tickets em 35%.

### Eles podem trabalhar juntos?
**Com certeza!** Na verdade, as melhores empresas do mundo operam cruzando ambos os métodos. 
Muitas vezes, quando um KPI sinaliza uma anomalia (por exemplo, a margem operacional caiu abaixo do limite seguro), a empresa responde criando um OKR trimestral focado exclusivamente em solucionar aquele problema e recuperar a saúde financeira.

Em resumo, use os **KPIs** para monitorar a saúde estável do negócio atual, e use os **OKRs** para impulsionar o crescimento exponencial futuro da sua marca.`
  },
  {
    id: "post-3",
    slug: "as-100-siglas-mais-utilizadas-nas-empresas",
    titulo: "As 100 siglas mais utilizadas nas empresas: O Glossário Definitivo",
    descricao: "Sobreviva às reuniões corporativas! Conheça as principais siglas de vendas, marketing, finanças, tecnologia e RH que todo profissional precisa saber.",
    tempo_leitura: "12 min de leitura",
    autor: "Dicionário Corporativo Editorial",
    data: "2026-07-05",
    categoria: "Geral",
    tags: ["glossário", "siglas", "carreira", "comunicação", "corporativo"],
    conteudo: `Se você já entrou em uma reunião e se sentiu perdido em meio a uma 'sopa de letrinhas' como: *"Nosso CAC subiu, mas o LTV compensa o CAC por conta da margem de EBITDA aprovada pelo CFO com o aval do CEO no último reporte de OKR"*, você não está sozinho.

A linguagem corporativa moderna é extremamente veloz e baseia-se em siglas para otimizar o tempo das discussões. Para ajudar você a navegar por esses termos com segurança e confiança, compilamos as categorias mais comuns do mercado corporativo.

### 1. Cargos Corporativos (Os Chefes)
- **CEO (Chief Executive Officer):** Diretor Executivo Principal. É quem dita a visão da empresa.
- **CFO (Chief Financial Officer):** Diretor Financeiro. Cuida da tesouraria, caixa e investimentos.
- **CTO (Chief Technology Officer):** Diretor de Tecnologia. Lidera as equipes técnicas de engenharia.
- **COO (Chief Operating Officer):** Diretor de Operações. Garante a produtividade das entregas de rotina.
- **CMO (Chief Marketing Officer):** Diretor de Marketing. Comanda o branding e captação de clientes.

### 2. Marketing e Vendas (Atração e Conversão)
- **CAC (Custo de Aquisição de Cliente):** O valor gasto em mídia e vendas para conseguir atrair cada cliente novo.
- **LTV (Lifetime Value):** O faturamento ou lucro acumulado gerado por um cliente ao longo do relacionamento comercial.
- **ROI (Return on Investment):** O retorno financeiro obtido em relação ao valor total de recursos investidos.
- **CTR (Click-Through Rate):** Taxa de clique em um link ou anúncio exibido na internet.
- **CRM (Customer Relationship Management):** Software ou política de gestão de dados de clientes.

### 3. Financeiro e Administração (A Engrenagem de Caixa)
- **EBITDA:** Lucro antes de juros, impostos, depreciação e amortização. Mede a eficiência operacional pura.
- **CAPEX (Capital Expenditure):** Investimentos aplicados na aquisição de maquinário e ativos permanentes.
- **OPEX (Operational Expenditure):** Custo de despesas de operação do dia a dia (salários, aluguel, luz).
- **DRE (Demonstração do Resultado do Exercício):** Relatório contábil que apura se houve lucro ou prejuízo fiscal no período.

### 4. Tecnologia e Dados (O Back-end de Sucesso)
- **API (Application Programming Interface):** Canal de comunicação padronizado que conecta diferentes softwares.
- **SaaS (Software as a Service):** Software fornecido como serviço em nuvem via planos mensais de assinatura.
- **BI (Business Intelligence):** Conjunto de painéis analíticos que amparam tomadas de decisão baseadas em números históricos.

Dominar essa linguagem não é apenas sobre se comunicar melhor, mas sobre demonstrar maturidade corporativa e autoridade em discussões estratégicas de alto escalão.`
  },
  {
    id: "post-4",
    slug: "siglas-recursos-humanos",
    titulo: "Glossário Corporativo: As principais siglas do departamento de RH",
    descricao: "Descubra as principais siglas utilizadas pelo setor de Recursos Humanos, incluindo regimes de contratação, benefícios e normas reguladoras brasileiras.",
    tempo_leitura: "4 min de leitura",
    autor: "Ana Clara Lima, Especialista em Talentos",
    data: "2026-06-30",
    categoria: "Recursos Humanos",
    tags: ["rh", "clt", "pj", "benefícios", "legislação"],
    conteudo: `O setor de **Recursos Humanos (RH)** lida diariamente com uma gama vasta de legislações trabalhistas, políticas de clima interno, atração de talentos e segurança laboral. Para profissionais que estão ingressando no mercado ou buscando transição de carreira, entender as siglas regulatórias e termos de RH é indispensável.

### Principais Regimes de Trabalho
- **CLT (Consolidação das Leis do Trabalho):** O modelo clássico de contratação com carteira assinada, que assegura férias remuneradas, décimo terceiro, FGTS e aposentadoria oficial pelo INSS.
- **PJ (Pessoa Jurídica):** Contratação de prestadores de serviços autônomos que emitem nota fiscal sob um CNPJ ativo, sem os vínculos empregatícios tutelados pela CLT.
- **MEI (Microempreendedor Individual):** O modelo jurídico simplificado e reduzido de empresa que permite a prestadores de serviços formalizarem sua empresa individual de forma rápida e barata.

### Atração de Talentos e Desenvolvimento
- **EVP (Employee Value Proposition):** A proposta de valor e cultura que a marca de empregadora constrói para convencer os melhores talentos a trabalharem com ela.
- **ATS (Applicant Tracking System):** Softwares de automação e triagem de candidaturas (como Gupy ou Greenhouse) usados para centralizar os processos seletivos.
- **PDI (Plano de Desenvolvimento Individual):** Um planejamento traçado de comum acordo entre gestor e funcionário focado no aprimoramento técnico de competências.

Conhecer estes conceitos garante que os colaboradores consigam pleitear seus direitos de forma clara e os gestores estruturem times sólidos de alto rendimento.`
  }
];
