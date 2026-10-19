# Como publicar

## 1. Planilha + Apps Script
1. Crie uma Google Planilha nova (ou use uma existente).
2. Extensões → Apps Script.
3. Apague o conteúdo padrão e cole o `Codigo.gs`.
4. Salve. Rode a função `testeEnvio` uma vez (menu de funções no topo) para autorizar planilha e e-mail — confira se a aba "Respostas v2" recebeu a linha de teste e se o e-mail chegou.
5. Implantar → Nova implantação → tipo "App da Web".
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
6. Copie a URL gerada (termina em `/exec`).

## 2. Front-end
1. Abra `script.js` e cole a URL copiada na constante `GAS_URL`.
2. Suba `index.html`, `styles.css` e `script.js` juntos no mesmo local (hospedagem, GitHub Pages, etc.).

## 3. Teste real
1. Preencha o formulário pelo celular.
2. Confira se a linha aparece na aba "Respostas".
3. Force um erro (ex: desligue o wi-fi antes de enviar) para confirmar que o link de fallback do WhatsApp aparece com os dados completos.

## O que mudou em relação ao formulário antigo
- **Cônjuge**: nome aparece ao selecionar casado/união estável; FGTS do cônjuge aparece quando ele tem renda comprovada.
- **Sem duplicidade de `name`** nos campos (bug antigo: `tempo-de-serviço` e `valor` repetidos).
- **Validação nativa reforçada**: campos condicionais viram obrigatórios só quando visíveis, e voltam a ser opcionais (e são limpos) quando o bloco some — evita enviar dado de um cônjuge que não existe mais depois de o cliente trocar a resposta.
- **Barra de progresso**: dá previsibilidade de quanto falta, reduz abandono no meio do formulário.
- **Fluxo de envio**: grava direto na planilha (sem depender do cliente confirmar manualmente no WhatsApp). Tela de sucesso confirma o recebimento e cita seu nome. Botão de WhatsApp na tela de sucesso é opcional, com mensagem curta.
- **Se a planilha falhar**: nada se perde — aparece um link para enviar tudo pelo WhatsApp com a mensagem completa (a lógica antiga virou o plano B).
- **Layout mobile-first**: campos empilham no celular, viram lado a lado a partir de 640px; áreas de toque maiores (mín. 46px), fonte 16px nos inputs (evita zoom automático do Safari/iOS).