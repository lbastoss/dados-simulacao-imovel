// =====================================================================
// CONFIGURAÇÃO
// =====================================================================
// Aba onde as respostas são salvas. As colunas são criadas sozinhas a partir
// dos campos do formulário: se um campo novo aparecer, vira coluna nova no fim.
const NOME_ABA = 'Respostas v2';

// E-mail que recebe o resumo de cada simulação.
// Vazio = e-mail da conta dona do script.
const EMAIL_DESTINO = '';

// =====================================================================
// doPost — grava uma linha na planilha e envia o resumo por e-mail.
// Nunca reescreve fórmulas ou faz setup da planilha aqui.
// =====================================================================
function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);

    // Campo isca preenchido = robô. Responde "sucesso" e não grava nada.
    if (dados.website) return resposta({ status: 'sucesso' });

    salvarNaPlanilha(dados);

    // Se o e-mail falhar, a linha já está salva: não devolve erro ao cliente.
    try {
      enviarEmail(dados);
    } catch (erroEmail) {
      console.error('Falha ao enviar e-mail: ' + erroEmail.message);
    }

    return resposta({ status: 'sucesso' });

  } catch (erro) {
    return resposta({ status: 'erro', mensagem: erro.message });
  }
}

function resposta(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}

// =====================================================================
// PLANILHA
// =====================================================================
function salvarNaPlanilha(dados) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const planilha = SpreadsheetApp.getActiveSpreadsheet();
    const aba = planilha.getSheetByName(NOME_ABA) || planilha.insertSheet(NOME_ABA);

    // Cabeçalho atual + colunas novas que ainda não existem
    let cabecalho = aba.getLastColumn() > 0
      ? aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0]
      : ['Data/hora'];
    const campos = (dados.campos || []).map(function (c) {
      return { coluna: String(c.coluna || ''), valor: String(c.valor || '') };
    });
    campos.forEach(function (c) {
      if (c.coluna && cabecalho.indexOf(c.coluna) === -1) cabecalho.push(c.coluna);
    });
    aba.getRange(1, 1, 1, cabecalho.length).setValues([cabecalho]).setFontWeight('bold');
    aba.setFrozenRows(1);

    const linha = cabecalho.map(function () { return ''; });
    linha[0] = new Date();
    campos.forEach(function (c) {
      const i = cabecalho.indexOf(c.coluna);
      if (i > 0) linha[i] = protegerTexto(c.valor);
    });
    aba.appendRow(linha);
  } finally {
    lock.releaseLock();
  }
}

// Impede que um texto vire fórmula (=, +, -, @) e que datas mudem de formato.
function protegerTexto(valor) {
  if (/^[=+\-@]/.test(valor) || /^\d{2}\/\d{2}\/\d{4}/.test(valor)) return "'" + valor;
  return valor;
}

// =====================================================================
// E-MAIL (texto pronto para fazer a simulação)
// =====================================================================
function enviarEmail(dados) {
  const destino = EMAIL_DESTINO || Session.getEffectiveUser().getEmail();
  const quando = Utilities.formatDate(new Date(), 'America/Sao_Paulo', "dd/MM/yyyy 'às' HH:mm");
  const assunto = 'Simulação: ' + (dados.nome || 'sem nome') +
    (dados.rendaBrutaTotal ? ' — renda bruta ' + dados.rendaBrutaTotal : '');
  const corpo = (dados.resumo || JSON.stringify(dados, null, 2)) +
    '\n\n—\nRecebido em ' + quando + ' pelo formulário de simulação.';

  MailApp.sendEmail({ to: destino, subject: assunto, body: corpo });
}

// =====================================================================
// TESTE: rode pelo editor (menu de funções → testeEnvio) para autorizar
// o envio de e-mail e conferir se a linha e o e-mail chegam.
// =====================================================================
function testeEnvio() {
  const dados = {
    nome: 'Cliente Teste',
    rendaBrutaTotal: 'R$ 5.000,00',
    resumo: 'NOVA SIMULAÇÃO — Cliente Teste\n\nDADOS PESSOAIS\nNome: Cliente Teste\n\n(teste disparado pelo editor do Apps Script)',
    campos: [{ coluna: 'Nome', valor: 'Cliente Teste' }]
  };
  salvarNaPlanilha(dados);
  enviarEmail(dados);
}
