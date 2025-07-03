// Seletores principais
const inputData = document.getElementById('data_nascimento');
const erroData = document.getElementById('erro_data');

const inputEmail = document.getElementById('email');
const erroEmail = document.getElementById('erro_email');

const estadoCivil = document.getElementById('estado_civil');
const campoConjuge = document.querySelector('.nascimento_conjuge');
const rendaConjuge = document.querySelector('.renda_conjuge');

const valorRendaConjuge = document.querySelector('.renda_bruta_conjuge');
const possuiRenda = document.getElementById('renda_conjuge');

const tipoRenda = document.getElementById('tipo_renda');
const informeRenda = document.querySelector('.outra_renda_container');

const teveBeneficio = document.getElementById('beneficio');
const qualAno = document.querySelector('.foi_beneficiado');

const inputNome = document.getElementById('nome');
const erroNome = document.getElementById('erro_nome');

const camposMoeda = document.querySelectorAll('.campo-moeda');

// Validação de idade mínima (18 anos)
inputData.addEventListener('change', () => {
  const partes = inputData.value.split('/');
  if (partes.length !== 3) return;

  const [dia, mes, ano] = partes;
  const dataNascimento = new Date(`${ano}-${mes}-${dia}`);
  const hoje = new Date();
  const dataLimite = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate());

  if (isNaN(dataNascimento.getTime()) || dataNascimento > dataLimite) {
    erroData.textContent = 'Você precisa ter 18 anos ou mais.';
    inputData.value = '';
  } else {
    erroData.textContent = '';
  }
});

// Máscara de data no formato DD/MM/AAAA
inputData.addEventListener('input', (e) => {
  let valor = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito

  if (valor.length >= 3 && valor.length <= 4) {
    valor = valor.replace(/^(\d{2})(\d{1,2})/, '$1/$2');
  } else if (valor.length > 4) {
    valor = valor.replace(/^(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
  }

  e.target.value = valor;
});



// Validação de e-mail
inputEmail.addEventListener('blur', () => {
  const email = inputEmail.value.trim();
  const regexEmail = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

  if (!regexEmail.test(email)) {
    erroEmail.textContent = 'Digite um e-mail válido.';
    inputEmail.style.border = '2px solid red';
  } else {
    erroEmail.textContent = '';
    inputEmail.style.border = '1px solid #ccc';
  }
});

// Exibir campos do cônjuge se casado ou união estável
estadoCivil.addEventListener('change', () => {
  const estado = estadoCivil.value;
  const mostrar = estado === 'casado' || estado === 'uniao_estavel';

  campoConjuge.style.display = mostrar ? 'flex' : 'none';
  rendaConjuge.style.display = mostrar ? 'flex' : 'none';
});

// Mostrar campo de renda do cônjuge se houver
possuiRenda.addEventListener('change', () => {
  valorRendaConjuge.style.display = possuiRenda.value === 'sim' ? 'flex' : 'none';
});

// Mostrar campo de outra renda
tipoRenda.addEventListener('change', () => {
  informeRenda.style.display = tipoRenda.value === 'outro' ? 'flex' : 'none';
});

// Mostrar campo de benefício
teveBeneficio.addEventListener('change', () => {
  qualAno.style.display = teveBeneficio.value === 'sim' ? 'flex' : 'none';
});

// Validação de nome (apenas letras e espaços)
inputNome.addEventListener('input', () => {
  let valor = inputNome.value;
  const invalido = /[^a-zA-ZÀ-ÿ\s]/.test(valor);

  if (invalido) {
    erroNome.textContent = 'Apenas letras e espaços são permitidos.';
    inputNome.style.border = '2px solid red';
  } else {
    erroNome.textContent = '';
    inputNome.style.border = '1px solid #ccc';
  }

  inputNome.value = valor.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
});

// Máscara de campo monetário
camposMoeda.forEach((campo) => {
  campo.addEventListener('keydown', (e) => {
    const teclasPermitidas = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!teclasPermitidas.includes(e.key) && !/^[0-9]$/.test(e.key)) {
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

// Envio para WhatsApp
document.getElementById('enviar-dados').addEventListener('click', () => {
  const nome = inputNome.value.trim();
  const dataNascimento = inputData.value;
  const email = inputEmail.value.trim();
  const estadoCivilValue = estadoCivil.value;
  const possuiFilhos = document.getElementById('filhos').value;
  const nascimentoConjuge = document.getElementById('data_nascimento_conjuge').value;
  const rendaConjugeValue = document.getElementById('valor_renda_conjuge').value;
  const valorRendaPessoal = document.getElementById('renda_pessoal_valor').value;
  const tipoRendaValue = tipoRenda.value;
  const fgtsValue = document.getElementById('fgts').value;
  const teveBeneficioValue = teveBeneficio.value;
  const cidade = document.getElementById('residencia').value;
  const anoBeneficio = document.getElementById('qual_ano')?.value || '';
  const tempoServico = document.getElementById('tempo-de-serviço-atual').value;
  const tempoServicoTotal = document.getElementById('tempo-de-serviço-total')?.value === 'sim'
    ? 'Sim'
    : 'Não possui mais de 3 anos de serviço';
  const possuiImovel = document.getElementById('imovel').value;
  const observacao = document.getElementById('informação').value.trim();

  const mensagem = `
Nome: ${nome}
Data de nascimento: ${dataNascimento}
Email: ${email}
Estado civil: ${estadoCivilValue}
Possui filhos?: ${possuiFilhos}
Data de nascimento do cônjuge: ${nascimentoConjuge}
Renda do cônjuge: ${rendaConjugeValue}
Tipo de renda: ${tipoRendaValue}
Renda pessoal: ${valorRendaPessoal}
Valor de FGTS: ${fgtsValue}
Teve benefício?: ${teveBeneficioValue}
Cidade que mora e trabalha: ${cidade}
Ano do benefício: ${anoBeneficio}
Tempo de serviço atual: ${tempoServico}
Possui mais de 36 meses de FGTS?: ${tempoServicoTotal}
Possui imóvel?: ${possuiImovel}
Observação: ${observacao}
`.trim();

  const textoFinal = encodeURIComponent(mensagem);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=5527998711427&text=${textoFinal}`;
  window.open(whatsappUrl, '_blank');
});
