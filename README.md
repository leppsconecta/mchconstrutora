# MCH Engenharia & Imobiliária

Website institucional moderno, robusto e de alta performance desenvolvido para a **MCH Engenharia & Imobiliária**, focado em engenharia de fundações, infraestrutura para telecomunicações, construção civil e reformas corporativas B2B.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** com **TypeScript**
- **Vite 8** (Build tool e servidor ultrarrápido)
- **Tailwind CSS v4** (Estilização utilitária e minimalista)
- **Framer Motion 14 / Motion 12** (Animações de entrada, scroll, parallax e efeitos táteis nos cards)
- **React Router 7** (Roteamento por páginas reais sem popups ou modais)
- **Lucide React** (Ícones limpos de engenharia e navegação)

---

## 🚀 Como Executar Localmente (Antigravity, VS Code, Terminal)

### 1. Pré-requisitos
Certifique-se de ter o **Node.js** (versão 18 ou superior) instalado em sua máquina.

### 2. Instalação das Dependências
No terminal do seu projeto, execute:
```bash
npm install
```

### 3. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
O projeto estará acessível em: **`http://localhost:3000`**

### 4. Construção para Produção (Build)
Para compilar e gerar a pasta `dist` otimizada para publicação:
```bash
npm run build
```

### 5. Visualizar o Build de Produção
```bash
npm run preview
```

### 6. Verificação de Tipos e Lint
```bash
npm run lint
```

---

## 📁 Estrutura do Projeto

```text
├── index.html                  # Ponto de entrada HTML (metadados e fontes)
├── package.json                # Dependências e scripts do projeto
├── tsconfig.json               # Configurações do compilador TypeScript
├── vite.config.ts              # Configurações do Vite e Tailwind
├── src/
│   ├── main.tsx                # Ponto de entrada React
│   ├── index.css               # Folha de estilo global com Tailwind CSS
│   ├── App.tsx                 # Rotas da aplicação (React Router) e layout global
│   │
│   ├── components/             # Componentes modulares reutilizáveis
│   │   ├── Header.tsx          # Menu fixo superior com backdrop-blur e links reais
│   │   ├── Footer.tsx          # Rodapé institucional com morada e aviso de escritório
│   │   ├── Preloader.tsx       # Animação inicial de 1.5s com abertura em janela
│   │   ├── Marquee.tsx         # Carrossel infinito horizontal de parceiros
│   │   └── Link.tsx            # Adaptador de navegação compatível com Next.js
│   │
│   └── app/                    # Páginas Reais da Aplicação
│       ├── page.tsx            # Home Page (Hero com base de torre animada + 3 Pilares)
│       ├── construtora/
│       │   └── page.tsx        # Página da Construtora (casas, equipe própria, turnkey)
│       ├── imobiliaria/
│       │   └── page.tsx        # Página da Imobiliária (terrenos, permutas, incorporação)
│       ├── cases/
│       │   └── page.tsx        # Página de Cases de Sucesso (obras, prazos e métricas)
│       ├── quem-somos/
│       │   └── page.tsx        # Página Institucional (DNA, campo, normas NR-18/35)
│       └── contato/
│           └── page.tsx        # Página de Contato e Solicitação de Proposta / Orçamento
```

---

## 🎨 Paleta de Cores e Identidade Visual

- **Azul Marinho Principal:** `#1B2639` (Header, Hero, rodapé e títulos)
- **Cinzento / Prata:** `#9F9F9F` (Subtítulos, bordas sutis e metadados)
- **Branco / Cinza Muito Claro:** `#FFFFFF` e `#F8F9FA` (Seções de conteúdo para máximo respiro e legibilidade)
- **Acento Ciano:** `#0891B2` / `#06B6D4` (Destaque estratégico para telecomunicações)

---

## 📌 Principais Destaques Implementados

1. **Preloader Suave:** Texto centralizado "MCH" com pulso leve e abertura horizontal tipo janela após 1.5s.
2. **Hero com Base de Torre:** Fotografia de infraestrutura pesada e base de torre com animação da imagem subindo e o texto emergindo sequencialmente.
3. **Efeitos nos 3 Pilares:**
   - Efeito de elevação tridimensional no hover (`whileHover={{ y: -8 }}`).
   - Linha de destaque superior que se expande do centro para as pontas.
   - Ícones táteis com rotação e escala no foco.
   - Revelação escalonada durante a rolagem (stagger on scroll).
   - Destaque reforçado no pilar de telecomunicações.
4. **Cases em Split Layout:** Fotografia de obra à esquerda e dados operacionais de campo à direita.
5. **Carrossel de Parceiros (Marquee):** Claro, Sites, JBS, Seara e Prefeitura de Cajamar sobre fundo branco.
6. **Ressalva Visual Mandatória no Rodapé:**
   *Av dos Ypes 155, Cajamar - SP* acompanhado do aviso:
   `"Escritório físico atualmente fechado para atendimento ao público"`.
