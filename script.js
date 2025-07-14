
// ===============================
// Seletores principais
// ===============================
const inputData = document.getElementById('data_nascimento');
const erroData = document.getElementById('erro_data');
const inputDataConjuge = document.getElementById('data_nascimento_conjuge');
const erroDataConjuge = document.getElementById('erro_data_conjuge');

const estadoCivil = document.getElementById('estado_civil');
const campoConjuge = document.querySelector('.nascimento_conjuge');
const rendaConjuge = document.querySelector('.renda_conjuge');
const valorRendaConjuge = document.querySelector('.renda_bruta_conjuge');
const possuiRenda = document.getElementById('renda_conjuge');

const tipoRenda = document.getElementById('tipo_renda');
const informeRenda = document.querySelector('.outra_renda_container');
const campoIR = document.querySelector('.campo_ir');
const declarouIR = document.getElementById('declarou_ir');

const inputNome = document.getElementById('nome');
const erroNome = document.getElementById('erro_nome');
const camposMoeda = document.querySelectorAll('.campo-moeda');

// ===============================
// Adicionar animações suaves aos campos dinâmicos
// ===============================
[campoConjuge, rendaConjuge, valorRendaConjuge, informeRenda, campoIR].forEach((el) => {
  el.style.transition = 'all 0.3s ease';
});

// ===============================
// Máscara de data no formato DD/MM/AAAA
// ===============================
function aplicarMascaraData(input) {
  input.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length >= 3 && valor.length <= 4) {
      valor = valor.replace(/^(\d{2})(\d{1,2})/, '$1/$2');
    } else if (valor.length > 4) {
      valor = valor.replace(/^(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
    }
    e.target.value = valor;
  });
}

aplicarMascaraData(inputData);
aplicarMascaraData(inputDataConjuge);

// ===============================
// Validação de idade mínima (18 anos)
// ===============================
function validarIdade(input, erroSpan) {
  input.addEventListener('change', () => {
    const partes = input.value.split('/');
    if (partes.length !== 3) return;

    const [dia, mes, ano] = partes;
    const dataNascimento = new Date(`${ano}-${mes}-${dia}`);
    const hoje = new Date();
    const dataLimite = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate());

    if (isNaN(dataNascimento.getTime()) || dataNascimento > dataLimite) {
      erroSpan.textContent = 'Você precisa ter 18 anos ou mais ou a data está incorreta';
      input.value = '';
    } else {
      erroSpan.textContent = '';
    }
  });
}

validarIdade(inputData, erroData);
validarIdade(inputDataConjuge, erroDataConjuge);

// ===============================
// Exibir campos do cônjuge se casado ou união estável
// ===============================
estadoCivil.addEventListener('change', () => {
  const estado = estadoCivil.value;
  const mostrar = estado === 'casado' || estado === 'uniao_estavel';

  campoConjuge.style.display = mostrar ? 'flex' : 'none';
  rendaConjuge.style.display = mostrar ? 'flex' : 'none';
  valorRendaConjuge.style.display = 'none';
});

// ===============================
// Mostrar campo de renda do cônjuge se houver
// ===============================
possuiRenda.addEventListener('change', () => {
  valorRendaConjuge.style.display = possuiRenda.value === 'sim' ? 'flex' : 'none';
});

// ===============================
// Mostrar campo de outra renda
// ===============================
tipoRenda.addEventListener('change', () => {
  informeRenda.style.display = tipoRenda.value === 'outro' ? 'flex' : 'none';

  const mostrarIR = tipoRenda.value === 'autonomo' || tipoRenda.value === 'empresario';
  campoIR.style.display = mostrarIR ? 'flex' : 'none';
});

// ===============================
// Validação de nome (só letras e espaços)
// ===============================
inputNome.addEventListener('input', () => {
  let valor = inputNome.value;
  const invalido = /[^a-zA-ZÀ-ÿ\s]/.test(valor);
  if (invalido) {
    erroNome.textContent = 'Apenas letras e espaços são permitidos.';
    inputNome.style.border = '2px solid red';
  } else {
    erroNome.textContent = ''; // Adiciona destaque de campo válido
  }
  inputNome.value = valor.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
});

// ===============================
// Máscara de moeda (valor formatado em R$)
// ===============================
camposMoeda.forEach((campo) => {
  campo.addEventListener('keydown', (e) => {
    const teclasPermitidas = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!teclasPermitidas.includes(e.key) && !/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  });

  campo.addEventListener('input', () => {
    const valorNumerico = campo.value.replace(/\D/g, '');
    if (!valorNumerico) {
      campo.value = '';
      return;
    }

    const valor = parseFloat(valorNumerico) / 100;
    campo.value = valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  });
});

// ===============================
// Envio para WhatsApp com todas as condições
// ===============================
document.getElementById('enviar-dados').addEventListener('click', () => {
  const nome = inputNome.value.trim();
  const dataNascimento = inputData.value;
  const estadoCivilValue = estadoCivil.value;
  const possuiFilhos = document.getElementById('filhos').value;
  const nascimentoConjuge = inputDataConjuge.value;
  const possuiRendaValue = possuiRenda.value;
  const rendaConjugeValue = document.getElementById('valor_renda_conjuge').value;
  const valorRendaPessoal = document.getElementById('renda_pessoal_valor').value;
  const tipoRendaValue = tipoRenda.value;
  const outroTipoRenda = document.getElementById('outro_renda').value.trim();
  const fgtsValue = document.getElementById('fgts').value;
  const cidade = document.getElementById('residencia').value;
  const tempoServico = document.getElementById('tempo-de-servi\u00e7o-atual').value;
  const tempoServicoTotal = document.getElementById('tempo-de-servi\u00e7o-total').value;
  const possuiImovel = document.getElementById('imovel').value;
  const observacao = document.getElementById('informa\u00e7\u00e3o').value.trim();
  const profissao = document.getElementById('profissao').value.trim();
  const declarouIRValue = declarouIR.value;

  // Montar mensagem dinamicamente
  let mensagem = `Nome: ${nome}\nData de nascimento: ${dataNascimento}\nEstado civil: ${estadoCivilValue}\nPossui filhos?: ${possuiFilhos}\nTipo de renda: ${tipoRendaValue}`;

  // Se for outro tipo de renda
  if (tipoRendaValue === 'outro' && outroTipoRenda) {
    mensagem += `\nQual: ${outroTipoRenda}`;
  }

  // Se for autonomo ou empresário, pergunta IR
  if (tipoRendaValue === 'autonomo' || tipoRendaValue === 'empresario') {
    mensagem += `\nDeclarou IR: ${declarouIRValue === 'sim' ? 'Sim' : 'Não'}`;
  }

  mensagem += `\nProfissão: ${profissao}`;
  mensagem += `\nRenda pessoal: ${valorRendaPessoal}`;
  mensagem += `\nValor de FGTS: ${fgtsValue}`;

  // Se for casado ou união estável, mostrar dados do cônjuge
  if (estadoCivilValue === 'casado' || estadoCivilValue === 'uniao_estavel') {
    if (nascimentoConjuge) {
      mensagem += `\nData de nascimento do cônjuge: ${nascimentoConjuge}`;
    }
    if (possuiRendaValue === 'sim') {
      mensagem += `\nRenda do cônjuge: ${rendaConjugeValue}`;
    } else {
      mensagem += `\nCônjuge não possui renda comprovada`;
    }
  }

  mensagem += `\nCidade que mora e trabalha: ${cidade}`;
  mensagem += `\nTempo de serviço atual: ${tempoServico}`;
  mensagem += `\nPossui mais de 36 meses de FGTS?: ${tempoServicoTotal}`;
  mensagem += `\nPossui imóvel?: ${possuiImovel}`;

  // Observação (só se tiver)
  if (observacao) {
    mensagem += `\nObservação: ${observacao}`;
  }

  // Limpar e redirecionar para WhatsApp
  const textoFinal = encodeURIComponent(mensagem.trim());
  const whatsappUrl = `https://api.whatsapp.com/send?phone=5527998711427&text=${textoFinal}`;
  window.open(whatsappUrl, '_blank');
});
