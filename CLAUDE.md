# Formulário de simulação de financiamento (MCMV)

Site estático publicado no GitHub Pages: https://lbastoss.github.io/dados-simulacao-imovel/
O cliente preenche pelo celular; os dados vão para um Google Apps Script que grava
uma linha na planilha e envia um e-mail em texto para o Lucas.

## Arquivos
- `index.html` — estrutura do formulário. Cada pergunta é um `.campo`:
  - `data-req` = obrigatório; `data-resumo="Rótulo"` = nome usado no e-mail e na coluna da planilha.
  - `data-tipo="data" | "moeda"`; `data-soma="bruta" | "liquida" | "fgts"` entra nos totais da composição.
  - Botões de opção: `<div class="opcoes" data-name="campo" data-opcoes="valor:Rótulo|valor:Rótulo">` (o JS gera os radios).
  - Bloco condicional: `<div class="condicional" data-mostrar="campo=valor1,valor2">`.
  - Caixinha "Não sei": `<input type="checkbox" data-alternativa="Não sei">` dentro do campo de moeda.
- `script.js` — máscaras, condicionais, validação, progresso, montagem do resumo e envio.
- `styles.css` — mobile-first; tokens de cor no `:root`.
- `codigo.gs` — Apps Script (não roda no site; é colado no editor do Apps Script da planilha).
- `og.png` — imagem da prévia do link no WhatsApp.

## Regras
- Pergunta nova: basta acrescentar o `.campo` no HTML com `data-resumo`. Ela entra sozinha no e-mail,
  no fallback do WhatsApp e vira coluna nova na planilha (aba "Respostas v2").
- Não renomear um `data-resumo` existente sem necessidade: cria uma coluna nova na planilha.
- Inputs com fonte de 16px (evita zoom no iPhone). Testar sempre em largura de celular (390px).
- Sem frameworks nem build: HTML/CSS/JS puros.
- Mudou `codigo.gs`? Precisa colar no editor do Apps Script e publicar nova versão da implantação
  (Implantar → Gerenciar implantações → editar → Nova versão), mantendo a mesma URL.
- Publicar o site = `git push` na branch `main`.
