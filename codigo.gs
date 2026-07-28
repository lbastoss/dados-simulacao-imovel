// =====================================================================
// CONFIGURAÇÃO
// =====================================================================
// Nome da aba onde as respostas serão salvas
const NOME_ABA = 'Respostas';

// Ordem das colunas na planilha (a primeira linha vira o cabeçalho).
// IMPORTANTE: a ordem aqui é a mesma ordem em que os dados são gravados.
const CABECALHO = [
  'Data/hora',
  'Nome',
  'Data de nascimento',
  'Estado civil',
  'Nome do cônjuge',
  'Nascimento do cônjuge',
  'Cônjuge tem renda comprovada',
  'Renda do cônjuge',
  'FGTS do cônjuge',
  'Possui filhos menores de 18',
  'Profissão',
  'Tipo de renda',
  'Outro tipo de renda',
  'Declarou IR',
  'Tempo no serviço atual',
  'Mais de 3 anos somando carteiras',
  'Renda bruta mensal',
  'FGTS',
  'Cidade (mora e trabalha)',
  'Possui imóvel com escritura',
  'Observação'
];

// =====================================================================
// doPost — ÚNICA responsabilidade: acrescentar uma linha na planilha.
// Nunca reescreve fórmulas ou faz setup aqui — isso é o que causava o bug
// de formulário sobrescrevendo a planilha no projeto do chá de bebê.
// =====================================================================
function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const planilha = SpreadsheetApp.getActiveSpreadsheet();
    let aba = planilha.getSheetByName(NOME_ABA);

    if (!aba) {
      aba = planilha.insertSheet(NOME_ABA);
    }

    // Escreve o cabeçalho só se a aba estiver vazia (primeira execução)
    if (aba.getLastRow() === 0) {
      aba.appendRow(CABECALHO);
      aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold');
    }

    const linha = [
      new Date(),
      dados.nome || '',
      dados.data_nascimento || '',
      formatarEstadoCivil(dados.estado_civil),
      dados.nome_conjuge || '',
      dados.data_nascimento_conjuge || '',
      dados.renda_conjuge === 'sim' ? 'Sim' : (dados.renda_conjuge === 'nao' ? 'Não' : ''),
      dados.valor_renda_conjuge || '',
      dados.fgts_conjuge || '',
      dados.filhos === 'sim' ? 'Sim' : (dados.filhos === 'nao' ? 'Não' : ''),
      dados.profissao || '',
      formatarTipoRenda(dados.tipo_renda),
      dados.outro_renda || '',
      dados.declarou_ir === 'sim' ? 'Sim' : (dados.declarou_ir === 'nao' ? 'Não' : ''),
      dados.tempo_servico_atual || '',
      dados.tempo_carteira_total === 'sim' ? 'Sim' : (dados.tempo_carteira_total === 'nao' ? 'Não' : ''),
      dados.renda_pessoal || '',
      dados.fgts || '',
      dados.residencia || '',
      dados.imovel === 'sim' ? 'Sim' : (dados.imovel === 'nao' ? 'Não' : ''),
      dados.observacao || ''
    ];

    aba.appendRow(linha);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'sucesso' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (erro) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'erro', mensagem: erro.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function formatarEstadoCivil(valor) {
  const mapa = {
    solteiro: 'Solteiro(a)',
    casado: 'Casado(a)',
    uniao_estavel: 'União estável',
    divorciado: 'Divorciado(a)',
    viuvo: 'Viúvo(a)'
  };
  return mapa[valor] || valor || '';
}

function formatarTipoRenda(valor) {
  const mapa = {
    assalariado: 'Carteira assinada',
    concursado: 'Concursado(a)',
    dt: 'DT',
    autonomo: 'Autônomo',
    empresario: 'Empresário',
    pensionista: 'Pensionista',
    aposentado: 'Aposentado',
    outro: 'Outro'
  };
  return mapa[valor] || valor || '';
}

// =====================================================================
// Teste opcional: rode esta função manualmente pelo editor do Apps Script
// para conferir se o cabeçalho é criado corretamente, sem precisar
// publicar o formulário ainda.
// =====================================================================
function testeCriarCabecalho() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(NOME_ABA);
  if (!aba) aba = planilha.insertSheet(NOME_ABA);
  if (aba.getLastRow() === 0) {
    aba.appendRow(CABECALHO);
    aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold');
  }
}