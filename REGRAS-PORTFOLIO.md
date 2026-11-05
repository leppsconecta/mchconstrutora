# Diretrizes e Regras do Portfólio - MC Engenharia

Este documento define o padrão oficial para cadastro, revisão textual e inserção de novos projetos no banco de dados Supabase e no site da MC Engenharia.

---

## 1. Escopo e Propósito

* **Objetivo:** Cadastrar, padronizar e atualizar as obras do portfólio diretamente no Supabase (`machado_construtora.portfolio`).
* **Regra de Texto:**
  * **Padronização de Clientes Corporativos:** Sempre que a obra for da Claro, identificar no título e na descrição como **Claro BR**.
  * **Proibido usar travessão (`—`):** Não utilizar o caractere de travessão longo. Usar apenas hífen comum (`-`) ou pontuação natural (vírgula, ponto).
  * **Categorias 100% limpas:** Nunca incluir tags comerciais como "(à venda)", "imóvel para venda", etc. Utilizar estritamente o nome da categoria oficial (`Construção Civil`, `Reformas Prediais` ou `Telecomunicações`).
  * **Textos muito longos:** Enxugar, sintetizar e resumir em 2 a 3 frases objetivas (foco no escopo, diferenciais e entrega).
  * **Textos já curtos e diretos:** Manter a estrutura original, apenas lapidando a pontuação, ortografia e vocabulário técnico de engenharia.

---

## 2. Regras de Conteúdo Textual

| Campo | Padrão e Limite | Exemplo |
| :--- | :--- | :--- |
| **Título** | Curto, direto e profissional (máx. 60 caracteres) | *Construção Turnkey Residencial - Caliandras II* |
| **Categoria** | **Apenas categorias oficiais limpas** (NUNCA incluir tags como "à venda", "imóvel para venda", etc.) | *Construção Civil*, *Reformas Prediais*, *Telecomunicações* |
| **Localização** | Cidade - UF e/ou polo regional | *Cajamar - SP (Portal dos Ipês)* |
| **Prazo** | Curto e objetivo | *45 dias da fundação à entrega* |
| **Descrição** | **Objetiva:** Se o texto enviado for muito extenso, enxugar para 2 a 3 frases. Se já vier enxuto e direto, manter o conteúdo apenas polindo o vocabulário técnico. | *Execução de residência de alto padrão com estrutura em concreto armado e acabamento fino. Obra entregue no modelo Turnkey com gestão total de materiais e mão de obra.* |
| **Destaques (Highlights)** | **Exatamente 3 tópicos técnicos e curtos** (sem frases longas) | • *Fundação profunda e estrutura em balanço*<br>• *Conformidade rigorosa ABNT NBR 6118*<br>• *Acabamento porcelanato e esquadrias de alumínio* |

---

## 3. Regras de Imagens

* **Quantidade:** De **5 a 10 fotos por projeto**.
* **Foto de Capa (`image`):** A foto de maior impacto visual da obra finalizada ou ângulo principal.
* **Galeria (`gallery`):** Array contendo entre 5 e 10 URLs públicas ordenadas logicamente (geral da obra ➔ detalhes ➔ acabamento/entrega).
* **Armazenamento:**
  * Bucket: `machado_construtora`
  * Caminho: `portfolio/{slug-do-projeto}-{timestamp}.webp`
  * Formato: Otimizado em WebP de alta definição, leve e responsivo.

---

## 4. Estrutura no Supabase (`machado_construtora.portfolio`)

```sql
-- Schema de referência
INSERT INTO machado_construtora.portfolio (
  id,
  title,
  category,
  location,
  timeframe,
  description,
  image,
  gallery,
  highlights,
  order_index,
  is_active,
  created_at,
  updated_at
) VALUES (...);
```

---

## 5. Fluxo Operacional por Projeto

1. **Envio:** O usuário envia as fotos (5 a 10) e os dados brutos de uma obra.
2. **Lapidação:** A IA sintetiza a descrição (reduzindo o texto e valorizando os termos técnicos de engenharia) e define os 3 destaques.
3. **Upload & Inserção:** A IA sobe as imagens para o Supabase Storage e salva/atualiza o registro na tabela `portfolio`.
4. **Confirmação:** A IA exibe a confirmação objetiva com a foto de capa, galeria e texto final gerado.
