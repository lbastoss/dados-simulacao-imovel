# 🏠 Simulador de Financiamento Imobiliário

Este é um projeto prático desenvolvido para otimizar o processo de coleta de dados de clientes interessados em financiamento habitacional. A ferramenta atua como um formulário inteligente que valida informações e as envia formatadas diretamente para o consultor via WhatsApp, agilizando o atendimento e garantindo que nenhum dado crucial seja esquecido.

## 🧾 Visão Geral

- **Foco Principal**: Automação de coleta de dados para corretagem imobiliária.
- **UX Dinâmica**: O formulário se adapta conforme as respostas (ex: exibe campos de cônjuge apenas se necessário).
- **Validações**: Verificação de idade mínima, máscaras de moeda e data em tempo real.
- **Integração**: Conexão direta com API do WhatsApp para envio de leads qualificados.

## 🚀 Tecnologias e Ferramentas

- **HTML5**: Estrutura semântica do formulário.
- **CSS3 (Custom Properties & Flexbox)**: Design responsivo com efeitos de desfoque (blur) e estilização personalizada para melhor experiência do usuário.
- **JavaScript (Vanilla)**: Lógica de negócio pura, sem frameworks, focada em performance e manipulação de DOM.
- **Google Fonts (Montserrat)**: Tipografia moderna para leitura clara.
- **Regex (Expressões Regulares)**: Utilizadas para máscaras de entrada (CPF/Moeda/Data) e restrição de caracteres em campos de nome.

## ⚙️ Funcionalidades Principais

✅ **Campos Condicionais**: Exibe ou oculta campos de renda e data de nascimento do cônjuge baseado no Estado Civil.<br>
✅ **Máscara de Moeda (BRL)**: Formatação automática enquanto o usuário digita valores de renda e FGTS.<br>
✅ **Validação de Maioridade**: O sistema impede o prosseguimento se a data de nascimento indicar menos de 18 anos.<br>
✅ **Tratamento de Erros**: Mensagens em tempo real caso o usuário digite números no nome ou datas inválidas.<br>
✅ **Automação de Mensagem**: Monta um relatório completo e organizado para o WhatsApp, facilitando a leitura do consultor técnico.<br>
✅ **Responsividade Total**: Interface adaptada para celulares, facilitando o uso pelo cliente final via link.

## 💻 Como utilizar

Este é um projeto de front-end estático. Para testar:

1. Clone o repositório ou baixe os arquivos.
2. Abra o arquivo `index.html` em qualquer navegador.
3. Preencha os dados e clique em "Enviar Dados" para ver a mensagem sendo formatada.

> **Nota**: No arquivo `script.js`, a URL do WhatsApp está configurada para um número específico. Você pode alterá-lo na linha final da função de envio.

## 📸 Demonstração

### Interface do Simulador
<p align="center">
<img width="927" height="878" alt="Image" src="https://github.com/user-attachments/assets/60366693-fbd6-4d99-9fb9-14c7642c6273" />
<img width="927" height="878" alt="Image" src="https://github.com/user-attachments/assets/5d8db4ac-6387-4118-949d-322f5b1687f7" />
</p>

---
*Este projeto é um exemplo real de como a tecnologia pode ser aplicada para resolver gargalos de produtividade em vendas.*
