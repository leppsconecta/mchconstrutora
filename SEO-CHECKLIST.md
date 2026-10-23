# Checklist de Implementação: SEO, GEO (IAs) e SEO Local
**Projeto:** Machado Construtora e Incorporadora  
**Status Geral:** Em Andamento (Bloco 0 Concluído)

---

## Dados do Negócio (Mapeados vs Pendentes)
- **Nome da Empresa:** Machado Construtora e Incorporadora
- **Domínio Principal:** `https://www.construcoesmachado.com.br`
- **Segmento:** Construtora, Incorporadora, Engenharia Civil, Telecomunicações e Reformas Corporativas
- **Endereço:** Av. dos Ipês, 155 - Portal dos Ipês (Polvilho), Cajamar - SP, CEP 07790-840
- **Região de Atuação:** Cajamar, Santana de Parnaíba, Barueri, Alphaville, Jundiaí, São Paulo e Grande SP
- **Telefone / WhatsApp:** (11) 96645-4023 / (11) 4448-1234
- **E-mails:** contato@mchengenharia.com.br / comercial@mchengenharia.com.br
- **Horário de Atendimento:** Segunda a Sexta: 08h às 18h
- **Instagram:** https://instagram.com/machado_construtora
- **Facebook / LinkedIn:** `[PREENCHER]`
- **Perfil da Empresa no Google (Google Meu Negócio):** `[PREENCHER]`

---

## Mapeamento de Rotas

### Páginas Públicas (Foco em SEO, Indexação e GEO)
1. `/` — Página Inicial (Visão geral, construtora, engenharia, diferenciais)
2. `/construtora` — Obras Residenciais Turnkey, Incorporação e Construção Civil
3. `/telecomunicacoes` — Infraestrutura para Telecomunicações, Torres e Fundações
4. `/reformas` — Reformas Corporativas, Comerciais e Manutenção Predial B2B
5. `/imobiliaria` — Imóveis Próprios, Lançamentos e Vendas
6. `/portfolio` — Portfólio de Obras e Casos de Sucesso
7. `/quem-somos` — História, Missão, Valores, Engenheiros e Diferenciais
8. `/contato` — Formulário de Contato, Telefones, Mapa e Endereço
9. `/cadastro-funcionario` / `/trabalhe-conosco-completo` — Trabalhe Conosco (Página utilitária pública / Noindex)

*Redirecionamentos e atalhos mapeados:*
`/cases` -> `/portfolio` | `/torres`, `/telecom`, `/torres-telecom` -> `/telecomunicacoes` | `/imoveis` -> `/imobiliaria` | `/sobre`, `/sobre-nos` -> `/quem-somos` | `/obras` -> `/construtora` | `/projetos` -> `/portfolio`

### Páginas Privadas (Bloqueadas: NOINDEX, NOFOLLOW e Disallow no robots.txt)
1. `/admin/login` e `/login` — Login do Dashboard
2. `/admin/*` — Painel Administrativo Protegido
   - `/admin/projetos`
   - `/admin/clientes`
   - `/admin/crm-leads`
   - `/admin/arquivos`
   - `/admin/financeiro`
   - `/admin/curriculos`
   - `/admin/funcionarios`
   - `/admin/site`
3. `/dashboard` e `/dashboard/*` — Atalhos do painel administrativo

---

## Blocos de Execução

### [x] BLOCO 0: PLANO E CHECKLIST
- [x] Mapeamento completo de rotas públicas e privadas
- [x] Criação do arquivo `SEO-CHECKLIST.md` na raiz
- [x] Apresentação do plano detalhado e aguardar confirmação do usuário

### [x] BLOCO 1: H1 E ESTRUTURA DE TÍTULOS
- [x] Auditar e garantir exatamente UM `<h1>` semântico por página pública
- [x] Incorporar palavra-chave principal e localização nos H1s (ex: Construtora e Incorporadora em Cajamar e Grande SP)
- [x] Organizar hierarquia rígida: H1 > H2 > H3 sem pular níveis e sem tags de heading aplicadas puramente para fins estéticos
- [x] Corrigir eventuais H1s genéricos ou ausentes nas páginas de serviços

### [x] BLOCO 2: TAGS DE CADA PÁGINA (METADATA & HEAD)
- [x] Implementar componente dinâmico de Head/SEO para SPAs (Title, Meta Description, Canonical, OG, Twitter)
- [x] Titles únicos de até ~60 caracteres por página pública com branding da Machado Construtora
- [x] Meta Descriptions únicas de até ~155 caracteres com chamada para ação (CTA)
- [x] URL Canônica absoluta em cada página pública (`https://www.construcoesmachado.com.br`)
- [x] Open Graph (og:title, og:description, og:image 1200x630, og:url, og:locale) e Twitter Cards
- [x] Configuração de `<html lang="pt-BR">` garantida
- [x] Configuração de `noindex, nofollow` em todas as rotas restritas/privadas (/admin/*, /admin/login, formulários internos)
- [x] Validação de URLs limpas, sem acentos ou parâmetros desnecessários

### [x] BLOCO 3: ROBOTS, SITEMAP E INDEXAÇÃO
- [x] Criação de `public/robots.txt` permitindo rotas públicas e bloqueando estritamente `/admin`, `/login`, `/dashboard`, etc.
- [x] Permissão explícita para bots de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended)
- [x] Geração de `public/sitemap.xml` contemplando todas as páginas públicas institucionais
- [x] Adição de meta tag `noindex, nofollow` em todas as rotas restritas e de autenticação
- [x] Criação de página 404 personalizada (`NotFoundPage`) com navegação amigável e noindex

### [x] BLOCO 4: DADOS ESTRUTURADOS (JSON-LD SCHEMA.ORG)
- [x] Esquema `LocalBusiness` / `GeneralContractor` (Construção Civil) com NAP (Name, Address, Phone), horário, geo-coordenadas e sameAs
- [x] Esquema `Organization` com logotipo oficial e contatos
- [x] Esquema `Service` específico em cada página de especialidade (/construtora, /telecomunicacoes, /reformas)
- [x] Esquema `BreadcrumbList` para navegação estruturada em todas as páginas internas
- [x] Validação rigorosa de sintaxe JSON-LD sem erros e sem inventar dados

### [x] BLOCO 5: GEO / AEO (CITAÇÃO POR IAS E RESPOSTAS DIRETAS)
- [x] Parágrafo síntese AEO no topo das páginas de serviços (O que é, para quem é, prazos típicos e regiões atendidas)
- [x] Seção de FAQ estruturada com 6 perguntas técnicas com respostas diretas com foco local e schema FAQPage
- [x] Enriquecimento da página `/quem-somos` com histórico institucional, diferenciais técnicos e bloco de depoimentos com marcadores `[PREENCHER]`
- [x] Padronização rigorosa do NAP (Nome, Endereço e Telefone) entre rodapé, páginas e dados estruturados
- [x] Criação do arquivo `public/llms.txt` na raiz para consumo otimizado por LLMs e crawlers de IA

### [x] BLOCO 6: IMAGENS E PERFORMANCE
- [x] Atributos `alt` descritivos e contextuais em todas as imagens (sem keyword stuffing)
- [x] Definição de `loading="lazy"` e `decoding="async"` para imagens abaixo da dobra
- [x] Garantia de `fetchPriority="high"` e `loading="eager"` na imagem hero principal para otimização de LCP
- [x] Definição de dimensões explícitas (`width` e `height`) no logo do Header e Footer para evitar layout shifts (CLS)

### [x] BLOCO 7: VERCEL E DOMÍNIO
- [x] Configuração de redirects 301 permanentes no `vercel.json` para rotas legadas (/cases, /torres, /telecom, /sobre, /obras, /projetos)
- [x] Headers de segurança aplicados no `vercel.json` (X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN, Referrer-Policy, Permissions-Policy)
- [x] Rota 404 personalizada e amigável (`NotFoundPage`) integrada ao roteador com links de retorno
- [x] Criação do guia completo `GOOGLE-PERFIL-EMPRESA.md` para SEO Local e Google Meu Negócio

### [x] BLOCO 8: CONTEÚDO E LINKS INTERNOS
- [x] Otimização de ancoragem de links internos com textos âncora ricos e semânticos
- [x] Interligação contextual entre serviços, portfólio e página de contato
- [x] Criação do guia estratégico `ESTRATEGIA-CONTEUDO-LOCAL.md` com 5 sugestões de tópicos de alto impacto para atração de tráfego qualificado

### [x] BLOCO 9: VERIFICAÇÃO FINAL & RELATÓRIO
- [x] Checagem integral (H1 único, titles, canonicals, robots.txt, sitemap.xml, JSON-LD, 404, llms.txt)
- [x] Atualização final do `SEO-CHECKLIST.md`
- [x] Entrega do relatório conclusivo com itens concluídos, itens pendentes e instruções para fora do código
