# 🏠 Formulário de Simulação de Financiamento (MCMV)

Formulário web para o cliente informar, pelo celular, os dados que o corretor precisa para fazer uma simulação de financiamento pelo Minha Casa Minha Vida — sem troca de mensagens perguntando item por item.

**Site:** https://lbastoss.github.io/dados-simulacao-imovel/

## Como funciona

1. O cliente preenche o formulário (≈3 minutos).
2. Os dados vão para um Google Apps Script, que grava uma linha na planilha e envia um **e-mail em texto** com tudo organizado por seção, já com idade calculada e **renda somada** quando há composição de renda.
3. Se a conexão falhar, o cliente pode enviar tudo pelo WhatsApp com um clique.

## Funcionalidades

- Perguntas em botões (Sim/Não, tipo de renda etc.), mais rápidas no celular que listas.
- Blocos que abrem conforme a resposta: composição de renda, IR para autônomo/empresário, outro tipo de renda.
- Renda bruta e líquida, FGTS com opção "Não sei", entrada com opção "Não tenho".
- Perguntas de enquadramento no MCMV: imóvel no nome, financiamento/subsídio anterior, restrição no CPF.
- Validação de datas (18+), nomes, valores e renda líquida ≤ bruta.
- Barra de progresso, seções que ficam ✓ ao completar, animações leves (respeitam "reduzir movimento").
- Prévia do link no WhatsApp (Open Graph) e campo isca contra robôs.

## Tecnologias

HTML, CSS e JavaScript puros (sem frameworks) · Google Apps Script + Google Planilhas · GitHub Pages.

Detalhes de estrutura e de como adicionar perguntas: ver `CLAUDE.md`. Publicação do Apps Script: ver `instruções.md`.
