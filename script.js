const inputData = document.getElementById('data_nascimento');
const erroData = document.getElementById('erro_data');
  
const inputEmail = document.getElementById('email');
const erroEmail = document.getElementById('erro_email');

const estadoCivil = document.getElementById('estado_civil');
const campoConjuge = document.querySelector('.nascimento_conjuge')
const rendaConjuge = document.querySelector('.renda_conjuge')

const valorRendaConjuge = document.querySelector('.renda_bruta_conjuge')
const possuiRenda = document.getElementById('renda_conjuge')

const tipoRenda = document.getElementById('tipo_renda')
const informeRenda = document.querySelector('.outra_renda_container')

const teveBeneficio = document.getElementById('beneficio')
const qualAno = document.querySelector('.foi_beneficiado')

const inputNome = document.getElementById('nome')
const erroNome = document.getElementById('erro_nome');

const camposMoeda = document.querySelectorAll('.campo-moeda');

  inputData.addEventListener('change', () => {
    const dataNascimento = new Date(inputData.value);
    const hoje = new Date();
    
    // Cria uma data limite com base na data atual - 18 anos
    const dataLimite = new Date(
      hoje.getFullYear() - 18,
      hoje.getMonth(),
      hoje.getDate()
    );
    
    if (dataNascimento > dataLimite) {
      erroData.textContent = 'Você precisa ter 18 anos ou mais.';
      inputData.value = ''; // Limpa o campo
    } else {
      erroData.textContent = ''; // Limpa o erro se estiver ok
    }
  });

  function formatarDataBR(dataISO) {
  if (!dataISO) return '';
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
  }

  

    inputEmail.addEventListener('blur', () => {
    const email = inputEmail.value.trim();

    // Expressão regular simples para validar e-mail
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(email)) {
      erroEmail.textContent = 'Digite um e-mail válido.';
      inputEmail.style.border = '2px solid red';
    } else {
      erroEmail.textContent = ''; // Tudo certo
    }
    });

estadoCivil.addEventListener('change', () => {
  const estadoSelecionado = (estadoCivil.value)

  if (estadoSelecionado === 'casado' || estadoSelecionado === 'uniao_estavel') {
    campoConjuge.style.display = 'flex'
  } else {
    campoConjuge.style.display = 'none'
  }
  
  if (estadoSelecionado === 'casado' || estadoSelecionado === 'uniao_estavel') {
    rendaConjuge.style.display = 'flex'
  } else {
    rendaConjuge.style.display = 'none'
  }

});

  
possuiRenda.addEventListener('change', () => {

  const rendaComprovada = (possuiRenda.value)

  if(rendaComprovada === 'sim') {
    valorRendaConjuge.style.display = 'flex'
  } else {
    valorRendaConjuge.style.display = 'none'
  }
})

tipoRenda.addEventListener('change', () => {
  
  const outroTipo = (tipoRenda.value)

  if (outroTipo === 'outro') {
    informeRenda.style.display = 'flex'
  } else {
    informeRenda.style.display = 'none'
  }

 
})
  
teveBeneficio.addEventListener('change', () => {
  const beneficio = (teveBeneficio.value)
  
  if (beneficio === 'sim') {
    qualAno.style.display = 'flex'
  } else {
    qualAno.style.display = 'none'
  }
})

 inputNome.addEventListener('input', () => { 
    const valorAtual = inputNome.value;

    // Verifica se existe algum caractere inválido
    const contemInvalido = /[^a-zA-ZÀ-ÿ\s]/.test(valorAtual);

    if (contemInvalido) {
      erroNome.textContent = 'Apenas letras e espaços são permitidos.';
      inputNome.style.border = '2px solid red';
    } else {
      erroNome.textContent = '';
      inputNome.style.border = '1px solid #ccc'; // volta ao normal
    }

    // Limpa os caracteres inválidos do campo
    inputNome.value = valorAtual.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
  });

  camposMoeda.forEach((campo) => {
  // Impede que digite letras e símbolos não numéricos
  campo.addEventListener('keydown', (e) => {
    const teclasPermitidas = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

    if (!teclasPermitidas.includes(e.key) && !/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  });

  // Formata automaticamente para moeda brasileira (R$)
  campo.addEventListener('input', () => {
    const valorNumerico = campo.value.replace(/\D/g, '');

    if (valorNumerico === '') {
      campo.value = '';
      return;
    }

    const valorDecimal = parseFloat(valorNumerico) / 100;
    const valorFormatado = valorDecimal.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    campo.value = valorFormatado;
  });
  });

  


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
  const CidadeMoraETrabalha = document.getElementById('residencia').value;
  const anoBeneficioInput = document.getElementById('qual_ano');
  const anoBeneficioValue = anoBeneficioInput ? anoBeneficioInput.value : '';
  const tempoServiço = document.getElementById('tempo-de-serviço-atual').value;
  const tempoServiçoTotalInput = document.getElementById('tempo-de-serviço-total');
  const tempoServiçoTotal = tempoServiçoTotalInput?.value === 'sim' ? tempoServiçoTotalInput.value  : 'Não possui mais de 3 anos de serviço';
    const possuiImóvel = document.getElementById('imovel').value;
    const dataNascimentoFormatada = formatarDataBR(dataNascimento);
    const nascimentoConjugeFormatado = formatarDataBR(nascimentoConjuge);
    const observacao = document.getElementById('informação').value.trim();

    

    const mensagem = `Nome: ${nome}\nData de Nascimento: ${dataNascimentoFormatada}\nEmail: ${email}\nEstado Civil: ${estadoCivilValue}\nPossui Filhos: ${possuiFilhos}\nData de Nascimento do Cônjuge: ${nascimentoConjugeFormatado}\nRenda do Cônjuge: ${rendaConjugeValue}\nTipo de Renda: ${tipoRendaValue}\nRenda Pessoal: ${valorRendaPessoal}\nValor de FGTS: ${fgtsValue}\nTeve Benefício: ${teveBeneficioValue}\nCidade que mora e trabalha: ${CidadeMoraETrabalha}\nAno do benefício: ${anoBeneficioValue}\nTempo de serviço atual: ${tempoServiço}\nTempo de serviço total: ${tempoServiçoTotal}\nPossui Imóvel: ${possuiImóvel}\nObservação: ${observacao}`;
    
    const textoFinal = encodeURIComponent(mensagem);

    const whatsappUrl = `https://api.whatsapp.com/send?phone=5527998711427&text=${textoFinal}`;
    window.open(whatsappUrl, '_blank');
  
});