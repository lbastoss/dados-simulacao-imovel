// =====================================================================
// CONFIGURAÇÃO
// =====================================================================
// URL do Web App do Google Apps Script (codigo.gs)
const GAS_URL = "https://script.google.com/macros/s/AKfycbxeYRwYHqESlFRF4di5Td4L8uaXlXaCRS5AUfZF0fK5SojZ9rttHEWMWO0abPItqszF/exec";

const NUMERO_WHATSAPP = "5527998711427";

document.documentElement.classList.add('js');

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
const barraProgresso = document.getElementById('barra-progresso');

const CASADO = ['casado', 'uniao_estavel'];

// =====================================================================
// UTILITÁRIOS
// =====================================================================
const $$ = (seletor, raiz = document) => Array.from(raiz.querySelectorAll(seletor));

// Valor marcado de um grupo de opções (radio)
function valorOpcao(nome) {
  const marcado = form.querySelector(`input[name="${nome}"]:checked`);
  return marcado ? marcado.value : '';
}

// "4.500,00" -> 4500
function paraNumero(texto) {
  if (!texto) return 0;
  return Number(texto.replace(/\./g, '').replace(',', '.')) || 0;
}

function paraMoeda(numero) {
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Um campo está visível se não está dentro de um bloco condicional fechado
function visivel(el) {
  return !el.closest('.condicional:not(.aberto)');
}

// =====================================================================
// OPÇÕES EM BOTÕES (gera os radios a partir de data-opcoes)
// Formato: "valor:Rótulo|valor:Rótulo" ou só "Rótulo|Rótulo"
// =====================================================================
$$('.opcoes').forEach((grupo) => {
  const nome = grupo.dataset.name;
  const itens = grupo.dataset.opcoes.split('|');
  grupo.setAttribute('role', 'radiogroup');
  const rotulo = grupo.closest('.campo').querySelector('.rotulo');
  if (rotulo) {
    rotulo.id = rotulo.id || `rotulo-${nome}`;
    grupo.setAttribute('aria-labelledby', rotulo.id);
  }
  if (itens.length <= 3) grupo.classList.add('iguais');

  itens.forEach((item) => {
    const [valor, texto] = item.includes(':') ? item.split(':') : [item, item];
    const label = document.createElement('label');
    label.className = 'opcao';
    label.innerHTML = `<input type="radio" name="${nome}" value="${valor}"><span>${texto}</span>`;
    grupo.appendChild(label);
  });
});

// Envolve o conteúdo dos blocos condicionais (necessário para a animação de abrir/fechar)
$$('.condicional').forEach((bloco) => {
  const interno = document.createElement('div');
  interno.className = 'condicional-interno';
  while (bloco.firstChild) interno.appendChild(bloco.firstChild);
  bloco.appendChild(interno);
  bloco.inert = true;
});

// =====================================================================
// MÁSCARAS
// =====================================================================
// Data DD/MM/AAAA
$$('.campo[data-tipo="data"] input').forEach((input) => {
  input.addEventListener('input', () => {
    const d = input.value.replace(/\D/g, '').slice(0, 8);
    input.value = d.length > 4 ? `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
      : d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  });
});

// Moeda (o "R$" fica fixo ao lado do campo)
$$('.moeda input').forEach((input) => {
  input.addEventListener('input', () => {
    const digitos = input.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 11);
    input.value = digitos
      ? (Number(digitos) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '';
  });
});

// Nomes: aceita letras (com acento), espaço, apóstrofo e hífen. O que for removido
// mostra um aviso rápido que some sozinho e não bloqueia o envio.
['nome', 'comp_nome'].forEach((id) => {
  const input = document.getElementById(id);
  const erro = input.closest('.campo').querySelector('.erro');
  let temporizador;
  input.addEventListener('input', () => {
    const limpo = input.value.replace(/[^\p{L}\s'’-]/gu, '');
    if (limpo !== input.value) {
      input.value = limpo;
      erro.textContent = 'Use apenas letras no nome.';
      clearTimeout(temporizador);
      temporizador = setTimeout(() => { erro.textContent = ''; }, 2500);
    }
  });
});

// Caixinhas "Não sei" / "Não tenho": desativam o campo de valor
$$('[data-alternativa]').forEach((caixa) => {
  const campo = caixa.closest('.campo');
  const moeda = campo.querySelector('.moeda');
  const input = moeda.querySelector('input');
  caixa.addEventListener('change', () => {
    input.disabled = caixa.checked;
    moeda.classList.toggle('desativada', caixa.checked);
    if (caixa.checked) input.value = '';
    limparErro(campo);
  });
});

// =====================================================================
// BLOCOS CONDICIONAIS
// data-mostrar="nome_do_campo=valor1,valor2"
// =====================================================================
function limparBloco(bloco) {
  $$('input[type="text"], textarea', bloco).forEach((i) => { i.value = ''; i.disabled = false; });
  $$('input[type="radio"], input[type="checkbox"]', bloco).forEach((i) => { i.checked = false; });
  $$('.moeda', bloco).forEach((m) => m.classList.remove('desativada'));
  $$('.campo', bloco).forEach(limparErro);
}

function atualizarCondicionais() {
  // Repete até estabilizar (um bloco pode depender de outro)
  for (let passada = 0; passada < 3; passada++) {
    let mudou = false;
    $$('.condicional').forEach((bloco) => {
      const [nome, valores] = bloco.dataset.mostrar.split('=');
      const abrir = valores.split(',').includes(valorOpcao(nome));
      if (abrir !== bloco.classList.contains('aberto')) {
        bloco.classList.toggle('aberto', abrir);
        bloco.inert = !abrir;
        if (!abrir) limparBloco(bloco);
        mudou = true;
      }
    });
    if (!mudou) break;
  }

  // Textos que mudam quando a pessoa é casada / está compondo renda
  const casado = CASADO.includes(valorOpcao('estado_civil'));
  document.getElementById('rotulo-compor').textContent = casado
    ? 'Seu cônjuge vai somar renda com você para financiar?'
    : 'Vai somar renda com outra pessoa para financiar?';
  document.getElementById('rotulo-comp-nome').textContent = casado
    ? 'Nome completo do cônjuge'
    : 'Nome completo da pessoa';
  form.classList.toggle('compondo', valorOpcao('compor_renda') === 'sim');
}

// =====================================================================
// TOTAIS DA COMPOSIÇÃO DE RENDA
// =====================================================================
function somar(tipo) {
  return $$(`.campo[data-soma="${tipo}"]`)
    .filter(visivel)
    .reduce((total, campo) => total + paraNumero(campo.querySelector('.moeda input').value), 0);
}

function atualizarTotais() {
  document.getElementById('total-bruta').textContent = paraMoeda(somar('bruta'));
  document.getElementById('total-liquida').textContent = paraMoeda(somar('liquida'));
}

// =====================================================================
// VALIDAÇÃO
// =====================================================================
function validarData(texto) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) return 'Use o formato DD/MM/AAAA.';
  const [dia, mes, ano] = texto.split('/').map(Number);
  const data = new Date(ano, mes - 1, dia);
  if (data.getDate() !== dia || data.getMonth() !== mes - 1) return 'Data inválida.';
  const hoje = new Date();
  if (data > new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate())) return 'É preciso ter 18 anos ou mais.';
  if (ano < hoje.getFullYear() - 100) return 'Confira o ano informado.';
  return '';
}

function idade(texto) {
  const [dia, mes, ano] = texto.split('/').map(Number);
  const hoje = new Date();
  let anos = hoje.getFullYear() - ano;
  if (hoje.getMonth() + 1 < mes || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia)) anos--;
  return anos;
}

// Retorna a mensagem de erro do campo ('' = ok)
function erroDoCampo(campo) {
  if (!('req' in campo.dataset)) return '';

  const grupo = campo.querySelector('.opcoes');
  if (grupo) return valorOpcao(grupo.dataset.name) ? '' : 'Escolha uma opção.';

  const alternativa = campo.querySelector('[data-alternativa]');
  if (alternativa && alternativa.checked) return '';

  const input = campo.querySelector('input[type="text"], textarea');
  const valor = input.value.trim();
  if (!valor) return 'Preencha este campo.';

  if (campo.dataset.tipo === 'data') return validarData(valor);

  if (input.id === 'nome' && valor.split(/\s+/).length < 2) return 'Informe nome e sobrenome.';

  if (campo.dataset.soma === 'bruta' || campo.dataset.soma === 'liquida') {
    if (paraNumero(valor) <= 0) return 'Informe um valor maior que zero.';
  }
  if (campo.dataset.soma === 'liquida') {
    const bruta = campo.parentElement.querySelector('.campo[data-soma="bruta"] .moeda input');
    if (bruta && paraNumero(valor) > paraNumero(bruta.value) && paraNumero(bruta.value) > 0) {
      return 'A renda líquida não pode ser maior que a bruta. Confira os valores.';
    }
  }
  return '';
}

function mostrarErro(campo, mensagem) {
  campo.classList.toggle('invalido', !!mensagem);
  const span = campo.querySelector('.erro');
  if (span) span.textContent = mensagem;
}

function limparErro(campo) {
  mostrarErro(campo, '');
}

// Valida ao sair do campo (só se a pessoa já digitou algo)
$$('.campo input[type="text"]').forEach((input) => {
  input.addEventListener('blur', () => {
    if (input.value.trim()) mostrarErro(input.closest('.campo'), erroDoCampo(input.closest('.campo')));
  });
  input.addEventListener('input', () => {
    const campo = input.closest('.campo');
    if (campo.classList.contains('invalido') && !erroDoCampo(campo)) limparErro(campo);
  });
});

// =====================================================================
// PROGRESSO + SEÇÕES COMPLETAS
// =====================================================================
function camposObrigatorios(raiz = form) {
  return $$('.campo[data-req]', raiz).filter(visivel);
}

function atualizarProgresso() {
  const campos = camposObrigatorios();
  const prontos = campos.filter((c) => !erroDoCampo(c)).length;
  barraProgresso.style.width = (campos.length ? Math.round((prontos / campos.length) * 100) : 0) + '%';

  $$('.secao').forEach((secao) => {
    const obrig = camposObrigatorios(secao);
    secao.classList.toggle('completa', obrig.length > 0 && obrig.every((c) => !erroDoCampo(c)));
  });
}

function aoMudar(evento) {
  if (evento.target.type === 'radio' || evento.target.type === 'checkbox') {
    atualizarCondicionais();
    limparErro(evento.target.closest('.campo'));
  }
  atualizarTotais();
  atualizarProgresso();
}

form.addEventListener('input', aoMudar);
form.addEventListener('change', aoMudar);
atualizarCondicionais();
atualizarProgresso();

// =====================================================================
// ANIMAÇÃO DAS SEÇÕES AO ROLAR
// =====================================================================
if ('IntersectionObserver' in window) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visivel');
        observador.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  $$('.surgir').forEach((el) => observador.observe(el));
} else {
  $$('.surgir').forEach((el) => el.classList.add('visivel'));
}

// =====================================================================
// COLETA DOS DADOS + RESUMO EM TEXTO (vai no e-mail e no WhatsApp)
// =====================================================================
function valorDoCampo(campo) {
  const grupo = campo.querySelector('.opcoes');
  if (grupo) {
    const marcado = grupo.querySelector('input:checked');
    return marcado ? marcado.nextElementSibling.textContent : '';
  }
  const alternativa = campo.querySelector('[data-alternativa]');
  if (alternativa && alternativa.checked) return alternativa.dataset.alternativa;

  const input = campo.querySelector('input[type="text"], textarea');
  const valor = input.value.trim().replace(/\s+/g, ' ');
  if (!valor) return '';
  if (campo.dataset.tipo === 'moeda') return 'R$ ' + valor;
  if (campo.dataset.tipo === 'data') return `${valor} (${idade(valor)} anos)`;
  return valor;
}

function coletarDados() {
  const campos = [];
  const linhas = [];
  const nome = document.getElementById('nome').value.trim();
  const compondo = valorOpcao('compor_renda') === 'sim';

  linhas.push(`NOVA SIMULAÇÃO — ${nome}`);

  $$('.secao').forEach((secao) => {
    const inicio = linhas.length;
    linhas.push('', secao.dataset.titulo.toUpperCase());

    // Na composição, se a pessoa é casada, o parentesco é sempre o cônjuge
    if (secao.dataset.titulo === 'Composição de renda' && compondo && CASADO.includes(valorOpcao('estado_civil'))) {
      campos.push({ coluna: 'Composição: Parentesco', valor: 'Cônjuge' });
    }

    $$('.campo', secao).filter(visivel).forEach((campo) => {
      const valor = valorDoCampo(campo);
      const rotulo = campo.dataset.resumo;
      const coluna = campo.closest('.bloco') ? `Composição: ${rotulo}` : rotulo;
      campos.push({ coluna, valor });
      if (valor) linhas.push(`${rotulo}: ${valor}`);
    });

    if (secao.dataset.titulo === 'Composição de renda' && compondo) {
      if (CASADO.includes(valorOpcao('estado_civil'))) {
        const i = linhas.indexOf('Vai compor renda: Sim');
        if (i >= 0) linhas.splice(i + 1, 0, 'Parentesco: Cônjuge');
      }
      const fgtsNaoSei = $$('.campo[data-soma="fgts"]').filter(visivel)
        .some((c) => c.querySelector('[data-alternativa]').checked);
      const totais = [
        ['Renda bruta somada', paraMoeda(somar('bruta'))],
        ['Renda líquida somada', paraMoeda(somar('liquida'))],
        ['FGTS somado', paraMoeda(somar('fgts')) + (fgtsNaoSei ? ' (um dos saldos não foi informado)' : '')]
      ];
      linhas.push('', 'TOTAIS DA COMPOSIÇÃO');
      totais.forEach(([rotulo, valor]) => {
        linhas.push(`${rotulo}: ${valor}`);
        campos.push({ coluna: rotulo, valor });
      });
    }

    // Seção sem nenhuma resposta (ex.: observação vazia) não entra no resumo
    if (linhas.length === inicio + 2) linhas.splice(inicio, 2);
  });

  return {
    nome,
    rendaBrutaTotal: paraMoeda(somar('bruta')),
    resumo: linhas.join('\n').replace(/\n{3,}/g, '\n\n').trim(),
    campos,
    website: document.getElementById('website').value
  };
}

// =====================================================================
// AVISOS
// =====================================================================
function mostrarAviso(html) {
  avisoGeral.innerHTML = html;
  avisoGeral.hidden = false;
  avisoGeral.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function esconderAviso() {
  avisoGeral.hidden = true;
  avisoGeral.innerHTML = '';
}

function linkWpp(texto) {
  return `https://api.whatsapp.com/send?phone=${NUMERO_WHATSAPP}&text=${encodeURIComponent(texto)}`;
}

// =====================================================================
// ENVIO
// =====================================================================
form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  esconderAviso();

  // Valida todos os campos obrigatórios visíveis
  const invalidos = camposObrigatorios().filter((campo) => {
    const msg = erroDoCampo(campo);
    mostrarErro(campo, msg);
    return !!msg;
  });

  if (invalidos.length) {
    const primeiro = invalidos[0];
    primeiro.scrollIntoView({ behavior: 'smooth', block: 'center' });
    invalidos.forEach((c) => {
      c.classList.remove('tremer');
      void c.offsetWidth; // reinicia a animação
      c.classList.add('tremer');
    });
    const foco = primeiro.querySelector('input:not([type="checkbox"])');
    if (foco && foco.type === 'text') setTimeout(() => foco.focus({ preventScroll: true }), 400);
    return;
  }

  const dados = coletarDados();

  botaoEnviar.disabled = true;
  botaoEnviar.classList.add('carregando');
  botaoTexto.textContent = 'Enviando...';

  try {
    const controle = new AbortController();
    const limite = setTimeout(() => controle.abort(), 25000);
    const resposta = await fetch(GAS_URL, {
      method: 'POST',
      // text/plain evita o preflight de CORS no Apps Script
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(dados),
      signal: controle.signal
    });
    clearTimeout(limite);

    if (!resposta.ok) throw new Error('Resposta HTTP ' + resposta.status);
    const resultado = await resposta.json();
    if (resultado.status !== 'sucesso') throw new Error(resultado.mensagem || 'Erro desconhecido');

    telaFormulario.hidden = true;
    telaSucesso.hidden = false;
    barraProgresso.style.width = '100%';
    linkWhatsapp.href = linkWpp(`Olá Lucas, acabei de preencher o formulário de simulação. Meu nome é ${dados.nome}.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (erro) {
    console.error('Falha ao enviar para a planilha:', erro);
    mostrarAviso(
      'Não foi possível salvar suas informações agora (conexão instável). ' +
      `Para não perder seus dados, <a href="${linkWpp(dados.resumo)}" target="_blank" rel="noopener">clique aqui para enviar tudo direto pelo WhatsApp</a>.`
    );
    botaoEnviar.disabled = false;
    botaoEnviar.classList.remove('carregando');
    botaoTexto.textContent = 'Enviar para simulação';
  }
});
