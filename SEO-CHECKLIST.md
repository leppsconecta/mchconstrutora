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

### [ ] BLOCO 2: TAGS DE CADA PÁGINA (METADATA & HEAD)
- [ ] Implementar componente dinâmico de Head/SEO para SPAs (Title, Meta Description, Canonical, OG, Twitter)
- [ ] Titles únicos de até ~60 caracteres por página pública com branding da Machado Construtora
- [ ] Meta Descriptions únicas de até ~155 caracteres com chamada para ação (CTA)
- [ ] URL Canônica absoluta em cada página pública
- [ ] Open Graph (og:title, og:description, og:image 1200x630, og:url, og:locale) e Twitter Cards
- [ ] Configuração de `<html lang="pt-BR">` garantida
- [ ] Validação de URLs limpas, sem acentos ou parâmetros desnecessários

### [ ] BLOCO 3: ROBOTS, SITEMAP E INDEXAÇÃO
- [ ] Criação de `public/robots.txt` permitindo rotas públicas e bloqueando estritamente `/admin`, `/login`, `/dashboard`, etc.
- [ ] Permissão explícita para bots de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
- [ ] Geração automatizada/estática de `public/sitemap.xml` contemplando todas as páginas públicas institucionais
- [ ] Adição de header / meta tag `noindex, nofollow` em todas as rotas restritas e de autenticação

### [ ] BLOCO 4: DADOS ESTRUTURADOS (JSON-LD SCHEMA.ORG)
- [ ] Esquema `LocalBusiness` / `GeneralContractor` (Construção Civil) com NAP (Name, Address, Phone), horário, geo-coordenadas e sameAs
- [ ] Esquema `Organization` com logotipo oficial e contatos
- [ ] Esquema `Service` específico em cada página de especialidade (/construtora, /telecomunicacoes, /reformas)
- [ ] Esquema `BreadcrumbList` para navegação estruturada
- [ ] Esquema `FAQPage` nas páginas com perguntas frequentes
- [ ] Validação de sintaxe JSON-LD sem erros

### [ ] BLOCO 5: GEO / AEO (CITAÇÃO POR IAS E RESPOSTAS DIRETAS)
- [ ] Parágrafo síntese AEO no topo das páginas de serviços (O que é, para quem é, prazos típicos e regiões atendidas)
- [ ] Seção de FAQ estruturada com 8 a 10 perguntas reais com respostas diretas (2 a 3 frases) com foco local
- [ ] Enriquecimento da página `/quem-somos` com histórico institucional, diferenciais técnicos e bloco de depoimentos com marcadores `[PREENCHER]`
- [ ] Padronização rigorosa do NAP (Nome, Endereço e Telefone) entre rodapé, páginas e dados estruturados
- [ ] Criação do arquivo `public/llms.txt` na raiz para consumo otimizado por LLMs e crawlers de IA

### [ ] BLOCO 6: IMAGENS E PERFORMANCE
- [ ] Atributos `alt` descritivos e contextuais em todas as imagens (sem keyword stuffing)
- [ ] Definição de `loading="lazy"` e `decoding="async"` para imagens abaixo da dobra
- [ ] Garantia de `priority` / `eager` na imagem hero principal para otimização de LCP
- [ ] Verificação de formatos WebP/SVG e dimensões explícitas para evitar layout shifts (CLS)

### [ ] BLOCO 7: VERCEL E DOMÍNIO
- [ ] Configuração de redirects no `vercel.json` (canonicalização www vs non-www e HTTPS forçado)
- [ ] Inclusão de headers de proteção contra indexação em ambientes de preview (*.vercel.app via `X-Robots-Tag: noindex`)
- [ ] Headers de segurança complementares (HSTS, X-Content-Type-Options, X-Frame-Options)
- [ ] Rota 404 personalizada e amigável integrada ao roteador

### [ ] BLOCO 8: CONTEÚDO E LINKS INTERNOS
- [ ] Otimização de ancoragem de links internos com textos âncora ricos e semânticos (evitar "clique aqui")
- [ ] Interligação contextual entre serviços, portfólio e página de contato
- [ ] Guia com 5 sugestões estratégicas de tópicos/artigos locais para atração de tráfego qualificado

### [ ] BLOCO 9: VERIFICAÇÃO FINAL & RELATÓRIO
- [ ] Checagem integral (H1 único, titles, canonicals, robots.txt, sitemap.xml, JSON-LD, 404)
- [ ] Atualização final do `SEO-CHECKLIST.md`
- [ ] Entrega do relatório conclusivo com itens concluídos, itens pendentes e instruções para fora do código
