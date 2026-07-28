// =====================================================================
// CONFIGURAÇÃO
// =====================================================================
// Cole aqui a URL do seu Web App do Google Apps Script (Codigo.gs)
// Exemplo: "https://script.google.com/macros/s/AKfycbx.../exec"
const GAS_URL = "https://script.google.com/macros/s/AKfycbxeYRwYHqESlFRF4di5Td4L8uaXlXaCRS5AUfZF0fK5SojZ9rttHEWMWO0abPItqszF/exec";

const NUMERO_WHATSAPP = "5527998711427";

// =====================================================================
// SELETORES
// =====================================================================
const form = document.getElementById('form-simulacao');
const telaFormulario = document.getElementById('tela-formulario');
const telaSucesso = document.getElementById('tela-sucesso');
const avisoGeral = document.getElementById('aviso-geral');
const botaoEnviar = document.getElementById('botao-enviar');
const botaoTexto = document.getElementById('botao-texto');
const linkWhatsapp = document.getElementById('link-whatsapp');

const inputNome = document.getElementById('nome');
const erroNome = document.getElementById('erro-nome');

const inputData = document.getElementById('data_nascimento');
const erroData = document.getElementById('erro-data');
const inputDataConjuge = document.getElementById('data_nascimento_conjuge');
const erroDataConjuge = document.getElementById('erro-data-conjuge');

const estadoCivil = document.getElementById('estado_civil');
const blocoConjuge = document.getElementById('bloco-conjuge');
const nomeConjuge = document.getElementById('nome_conjuge');
const rendaConjuge = document.getElementById('renda_conjuge');
const blocoRendaConjuge = document.getElementById('bloco-renda-conjuge');
const valorRendaConjuge = document.getElementById('valor_renda_conjuge');
const fgtsConjuge = document.getElementById('fgts_conjuge');

const tipoRenda = document.getElementById('tipo_renda');
const blocoOutraRenda = document.getElementById('bloco-outra-renda');
const outroRenda = document.getElementById('outro_renda');
const blocoIR = document.getElementById('bloco-ir');
const declarouIR = document.getElementById('declarou_ir');

const camposMoeda = document.querySelectorAll('.campo-moeda');

// =====================================================================
// MÁSCARA DE DATA (DD/MM/AAAA)
// =====================================================================
function aplicarMascaraData(input) {
  input.addEventListener('input', () => {
    let valor = input.value.replace(/\D/g, '').slice(0, 8);
    if (valor.length > 4) {
      valor = valor.replace(/^(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{1,2})/, '$1/$2');
    }
    input.value = valor;
  });
}
aplicarMascaraData(inputData);
aplicarMascaraData(inputDataConjuge);

// =====================================================================
// VALIDAÇÃO DE IDADE (18 anos ou mais) — usada no titular e no cônjuge
// =====================================================================
function validarIdade(input, erroSpan, obrigatorio) {
  input.addEventListener('blur', () => {
    if (!input.value) {
      erroSpan.textContent = obrigatorio ? 'Informe a data de nascimento.' : '';
      return;
    }
    const partes = input.value.split('/');
    if (partes.length !== 3 || partes[2].length !== 4) {
      erroSpan.textContent = 'Use o formato DD/MM/AAAA.';
      return;
    }
    const [dia, mes, ano] = partes.map(Number);
    const data = new Date(ano, mes - 1, dia);
    const dataValida = data.getDate() === dia && data.getMonth() === mes - 1 && data.getFullYear() === ano;

    const hoje = new Date();
    const limiteIdade = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate());

    if (!dataValida) {
      erroSpan.textContent = 'Data inválida.';
    } else if (data > limiteIdade) {
      erroSpan.textContent = 'É preciso ter 18 anos ou mais.';
    } else if (data.getFullYear() < hoje.getFullYear() - 110) {
      erroSpan.textContent = 'Confira o ano informado.';
    } else {
      erroSpan.textContent = '';
    }
    atualizarProgresso();
  });
}
validarIdade(inputData, erroData, true);
validarIdade(inputDataConjuge, erroDataConjuge, false);

// =====================================================================
// VALIDAÇÃO DE NOME (só letras e espaços)
// =====================================================================
function aplicarValidacaoNome(input, erroSpan) {
  input.addEventListener('input', () => {
    const invalido = /[^a-zA-ZÀ-ÿ\s]/.test(input.value);
    input.value = input.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    erroSpan.textContent = invalido ? 'Apenas letras e espaços são permitidos.' : '';
  });
}
aplicarValidacaoNome(inputNome, erroNome);

// =====================================================================
// MÁSCARA DE MOEDA (R$)
// =====================================================================
function aplicarMascaraMoeda(campo) {
  campo.addEventListener('input', () => {
    const digitos = campo.value.replace(/\D/g, '');
    if (!digitos) {
      campo.value = '';
      return;
    }
    const valor = parseFloat(digitos) / 100;
    campo.value = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  });
}
camposMoeda.forEach(aplicarMascaraMoeda);

// =====================================================================
// CAMPOS CONDICIONAIS
// =====================================================================
function alternarBloco(bloco, mostrar) {
  bloco.hidden = !mostrar;
}

estadoCivil.addEventListener('change', () => {
  const mostrar = estadoCivil.value === 'casado' || estadoCivil.value === 'uniao_estavel';
  alternarBloco(blocoConjuge, mostrar);
  nomeConjuge.required = mostrar;
  rendaConjuge.required = mostrar;

  if (!mostrar) {
    // Limpa o bloco do cônjuge para não enviar dado antigo por engano
    nomeConjuge.value = '';
    inputDataConjuge.value = '';
    erroDataConjuge.textContent = '';
    rendaConjuge.value = '';
    valorRendaConjuge.value = '';
    fgtsConjuge.value = '';
    alternarBloco(blocoRendaConjuge, false);
    valorRendaConjuge.required = false;
    fgtsConjuge.required = false;
  }
  atualizarProgresso();
});

rendaConjuge.addEventListener('change', () => {
  const mostrar = rendaConjuge.value === 'sim';
  alternarBloco(blocoRendaConjuge, mostrar);
  valorRendaConjuge.required = mostrar;
  fgtsConjuge.required = mostrar;
  if (!mostrar) {
    valorRendaConjuge.value = '';
    fgtsConjuge.value = '';
  }
  atualizarProgresso();
});

tipoRenda.addEventListener('change', () => {
  const mostrarOutro = tipoRenda.value === 'outro';
  alternarBloco(blocoOutraRenda, mostrarOutro);
  outroRenda.required = mostrarOutro;
  if (!mostrarOutro) outroRenda.value = '';

  const mostrarIR = tipoRenda.value === 'autonomo' || tipoRenda.value === 'empresario';
  alternarBloco(blocoIR, mostrarIR);
  declarouIR.required = mostrarIR;
  if (!mostrarIR) declarouIR.value = '';

  atualizarProgresso();
});

// =====================================================================
// BARRA DE PROGRESSO
// =====================================================================
const barraProgresso = document.getElementById('barra-progresso');
const textoProgresso = document.getElementById('texto-progresso');

function camposObrigatoriosVisiveis() {
  return Array.from(form.querySelectorAll('[required]')).filter((campo) => {
    // um campo é "visível" se nenhum ancestral .bloco-condicional dele está oculto
    const blocoPai = campo.closest('.bloco-condicional');
    return !blocoPai || !blocoPai.hidden;
  });
}

function atualizarProgresso() {
  const campos = camposObrigatoriosVisiveis();
  const preenchidos = campos.filter((c) => c.value && c.value.trim() !== '').length;
  const percentual = campos.length ? Math.round((preenchidos / campos.length) * 100) : 0;
  barraProgresso.style.width = percentual + '%';
  textoProgresso.textContent = percentual + '% preenchido';
}

form.addEventListener('input', atualizarProgresso);
form.addEventListener('change', atualizarProgresso);
atualizarProgresso();

// =====================================================================
// MONTAGEM DA MENSAGEM (usada só no fallback do WhatsApp em caso de erro)
// =====================================================================
function montarMensagemCompleta(dados) {
  let msg = `Nome: ${dados.nome}\nData de nascimento: ${dados.data_nascimento}\nEstado civil: ${dados.estado_civil}`;

  if (dados.estado_civil === 'casado' || dados.estado_civil === 'uniao_estavel') {
    msg += `\nNome do cônjuge: ${dados.nome_conjuge || '-'}`;
    if (dados.data_nascimento_conjuge) msg += `\nNascimento do cônjuge: ${dados.data_nascimento_conjuge}`;
    msg += `\nCônjuge possui renda comprovada: ${dados.renda_conjuge === 'sim' ? 'Sim' : 'Não'}`;
    if (dados.renda_conjuge === 'sim') {
      msg += `\nRenda do cônjuge: ${dados.valor_renda_conjuge}`;
      msg += `\nFGTS do cônjuge: ${dados.fgts_conjuge}`;
    }
  }

  msg += `\nPossui filhos menores de 18: ${dados.filhos}`;
  msg += `\nProfissão: ${dados.profissao}`;
  msg += `\nTipo de renda: ${dados.tipo_renda}`;
  if (dados.tipo_renda === 'outro') msg += `\nQual: ${dados.outro_renda}`;
  if (dados.declarou_ir) msg += `\nDeclarou IR: ${dados.declarou_ir === 'sim' ? 'Sim' : 'Não'}`;
  msg += `\nTempo no serviço atual: ${dados.tempo_servico_atual}`;
  msg += `\nMais de 3 anos somando carteiras: ${dados.tempo_carteira_total}`;
  msg += `\nRenda bruta mensal: ${dados.renda_pessoal}`;
  msg += `\nFGTS: ${dados.fgts}`;
  msg += `\nCidade (mora e trabalha): ${dados.residencia}`;
  msg += `\nPossui imóvel com escritura: ${dados.imovel}`;
  if (dados.observacao) msg += `\nObservação: ${dados.observacao}`;

  return msg;
}

function linkWhatsappCompleto(dados) {
  const texto = encodeURIComponent(montarMensagemCompleta(dados).trim());
  return `https://api.whatsapp.com/send?phone=${NUMERO_WHATSAPP}&text=${texto}`;
}

// =====================================================================
// COLETA DOS DADOS DO FORMULÁRIO
// =====================================================================
function coletarDados() {
  const dados = Object.fromEntries(new FormData(form).entries());
  dados.nome = dados.nome ? dados.nome.trim() : '';
  dados.profissao = dados.profissao ? dados.profissao.trim() : '';
  dados.observacao = dados.observacao ? dados.observacao.trim() : '';
  return dados;
}

// =====================================================================
// MOSTRAR AVISO DE ERRO
// =====================================================================
function mostrarAviso(mensagemHtml) {
  avisoGeral.innerHTML = mensagemHtml;
  avisoGeral.hidden = false;
  avisoGeral.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function esconderAviso() {
  avisoGeral.hidden = true;
  avisoGeral.innerHTML = '';
}

// =====================================================================
// ENVIO DO FORMULÁRIO
// =====================================================================
form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  esconderAviso();

  // Bloqueia envio se houver erro de validação customizada (nome/data) visível
  const errosAtivos = [erroNome, erroData, erroDataConjuge].some((span) => span.textContent);
  if (errosAtivos) {
    mostrarAviso('Corrija os campos destacados em vermelho antes de enviar.');
    return;
  }

  // Validação nativa (campos obrigatórios, formatos de select etc.)
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const dados = coletarDados();

  botaoEnviar.disabled = true;
  botaoTexto.textContent = 'Enviando...';

  try {
    const resposta = await fetch(GAS_URL, {
      method: 'POST',
      // text/plain evita o preflight de CORS; o Apps Script libera a leitura da resposta
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(dados)
    });

    if (!resposta.ok) throw new Error('Resposta HTTP ' + resposta.status);

    const resultado = await resposta.json();
    if (resultado.status !== 'sucesso') throw new Error(resultado.mensagem || 'Erro desconhecido');

    // Sucesso: troca de tela
    telaFormulario.hidden = true;
    telaSucesso.hidden = false;
    const textoWpp = encodeURIComponent(`Olá Lucas, acabei de preencher o formulário de simulação. Meu nome é ${dados.nome}.`);
    linkWhatsapp.href = `https://api.whatsapp.com/send?phone=${NUMERO_WHATSAPP}&text=${textoWpp}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (erro) {
    console.error('Falha ao enviar para a planilha:', erro);
    const linkFallback = linkWhatsappCompleto(dados);
    mostrarAviso(
      `Não foi possível salvar suas informações agora (conexão instável). ` +
      `Para não perder seus dados, <a href="${linkFallback}" target="_blank" rel="noopener">clique aqui para enviar tudo direto pelo WhatsApp</a>.`
    );
    botaoEnviar.disabled = false;
    botaoTexto.textContent = 'Enviar para simulação';
  }
});