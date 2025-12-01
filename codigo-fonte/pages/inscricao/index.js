// ==========================================
// SISTEMA DE INSCRIÇÃO COM API - PSICOHELP
// ==========================================

let currentStep = 1;
// Total de etapas visíveis no formulário (1, 2, 3, 4)
// A seção "success" é a quinta, mas não é contada aqui
const totalSteps = 4; 

// Elementos de UI
const btnProximo = document.getElementById('btnProximo');
const btnVoltar = document.getElementById('btnVoltar');
const progressLine = document.getElementById('progressLine');

// URL da API Node.js (Ajuste se o seu backend estiver em outra porta/domínio)
const API_URL = 'http://localhost:3000/api';

// ==========================================
// MÁSCARAS DE INPUT
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
  // Máscara de CPF
  const cpfInput = document.getElementById('cpf');
  if (cpfInput) {
    cpfInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      e.target.value = value;
    });
  }

  // Máscaras de Telefone
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', formatPhone);
  }

  const telefone2Input = document.getElementById('telefone2');
  if (telefone2Input) {
    telefone2Input.addEventListener('input', formatPhone);
  }
});

function formatPhone(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length <= 10) {
    // Telefone fixo (8 dígitos) ou celular antigo (9 dígitos)
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    // Celular moderno (9 dígitos)
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
  }
  e.target.value = value;
}

// ==========================================
// NAVEGAÇÃO ENTRE ETAPAS
// ==========================================

if (btnProximo) {
  btnProximo.addEventListener('click', async function() {
    // Garante que a validação assíncrona termine antes de prosseguir
    if (await validateCurrentStep()) { 
      if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
      } else {
        // Na última etapa, chama a submissão final
        submitForm();
      }
    }
  });
}

if (btnVoltar) {
  btnVoltar.addEventListener('click', function() {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  });
}

function goToStep(step) {
  // Oculta todas as seções
  document.querySelectorAll('.form-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Mostra a seção de destino
  const targetSection = document.querySelector(`.form-section[data-section="${step}"]`);
  if (targetSection) {
    targetSection.classList.add('active');
  }
  
  // Atualiza a barra de progresso e indicadores
  document.querySelectorAll('.step').forEach(stepEl => {
    const stepNum = parseInt(stepEl.getAttribute('data-step'));
    stepEl.classList.remove('active', 'completed');
    if (stepNum < step) {
      stepEl.classList.add('completed');
    } else if (stepNum === step) {
      stepEl.classList.add('active');
    }
  });
  
  if (progressLine) {
    const progress = ((step - 1) / (totalSteps - 1)) * 100;
    progressLine.style.width = progress + '%';
  }
  
  // Configura botões
  if (btnVoltar) {
    btnVoltar.style.display = step > 1 ? 'block' : 'none';
  }
  if (btnProximo) {
    // Muda o texto do botão na última etapa
    btnProximo.textContent = step === totalSteps ? 'Confirmar Inscrição' : 'Próximo';
    
    // ✅ SEM REDIRECIONAMENTO AQUI!
    // O redirecionamento DEVE ocorrer apenas em submitForm() após o sucesso da API.
  }
  
  currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// VALIDAÇÃO DE DUPLICIDADE (CHAMADAS À API)
// ==========================================

async function validarCPFDuplicado(cpf) {
  try {
    const response = await fetch(`${API_URL}/verificarCPF?cpf=${encodeURIComponent(cpf)}`);
    if (!response.ok) {
      console.error('Erro na resposta da API ao verificar CPF:', response.status);
      return false; 
    }
    const data = await response.json();
    return data.existe;
  } catch (error) {
    console.error('Erro ao verificar CPF:', error);
    return false;
  }
}

async function validarEmailDuplicado(email) {
  try {
    const response = await fetch(`${API_URL}/verificarEmail?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      console.error('Erro na resposta da API ao verificar Email:', response.status);
      return false; 
    }
    const data = await response.json();
    return data.existe;
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    return false;
  }
}

// ==========================================
// VALIDAÇÃO DE ETAPA ATUAL
// ==========================================

async function validateCurrentStep() {
  const currentSection = document.querySelector(`.form-section[data-section="${currentStep}"]`);
  if (!currentSection) return false;
  
  const inputs = currentSection.querySelectorAll('input[required], select[required], textarea[required]');
  let valid = true;
  
  // 1. Validação de campos obrigatórios (síncrona)
  for (const input of inputs) {
    if (input.type === 'radio') {
      const radioGroup = currentSection.querySelectorAll(`input[name="${input.name}"]`);
      const isChecked = Array.from(radioGroup).some(radio => radio.checked);
      if (!isChecked && valid) {
        alert('Por favor, selecione uma opção para todos os campos obrigatórios');
        valid = false;
        break;
      }
    } else if (input.type === 'checkbox' && input.id === 'termos') {
      if (!input.checked) {
        alert('Você deve concordar com os termos para continuar');
        valid = false;
        break;
      }
    } else if (!input.value.trim()) {
      input.classList.add('error');
      const errorMsg = document.getElementById(input.id + '-error');
      if (errorMsg) errorMsg.classList.add('show');
      alert(`Por favor, preencha o campo: ${input.name || input.id}`);
      valid = false;
      break;
    } else {
      input.classList.remove('error');
      const errorMsg = document.getElementById(input.id + '-error');
      if (errorMsg) errorMsg.classList.remove('show');
    }
  }

  if (!valid) return false;

  // 2. Validações específicas por etapa (assíncrona)
  if (currentStep === 1 && valid) {
    const cpfInput = document.getElementById('cpf');
    if (cpfInput && cpfInput.value) {
      const cpfLimpo = cpfInput.value.replace(/\D/g, '');
      if (cpfLimpo.length !== 11) {
        alert('CPF inválido. Digite 11 dígitos.');
        cpfInput.classList.add('error');
        valid = false;
      } else {
        // Verificar CPF duplicado no servidor
        const existe = await validarCPFDuplicado(cpfInput.value);
        if (existe) {
          alert('Este CPF já está cadastrado no sistema.');
          cpfInput.classList.add('error');
          valid = false;
        } else {
          cpfInput.classList.remove('error');
        }
      }
    }
    
    const dataNascInput = document.getElementById('dataNascimento');
    if (dataNascInput && dataNascInput.value) {
      // Validação de idade mínima (opcional, aqui verifica apenas validade)
      const dataNasc = new Date(dataNascInput.value + 'T00:00:00');
      const hoje = new Date();
      let idade = hoje.getFullYear() - dataNasc.getFullYear();
      const mes = hoje.getMonth() - dataNasc.getMonth();
      if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
        idade--;
      }
      
      if (idade < 0 || idade > 120) {
        alert('Data de nascimento inválida.');
        dataNascInput.classList.add('error');
        valid = false;
      } else {
        dataNascInput.classList.remove('error');
      }
    }
  }
  
  if (currentStep === 2 && valid) {
    const emailInput = document.getElementById('email');
    if (emailInput && emailInput.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        alert('E-mail inválido.');
        emailInput.classList.add('error');
        valid = false;
      } else {
        // Verificar email duplicado no servidor
        const existe = await validarEmailDuplicado(emailInput.value);
        if (existe) {
          alert('Este e-mail já está cadastrado no sistema.');
          emailInput.classList.add('error');
          valid = false;
        } else {
          emailInput.classList.remove('error');
        }
      }
    }
    
    const contatoCheckboxes = currentSection.querySelectorAll('input[name="contato"]');
    if (contatoCheckboxes.length > 0) {
      const isChecked = Array.from(contatoCheckboxes).some(cb => cb.checked);
      if (!isChecked) {
        alert('Selecione pelo menos uma forma de contato');
        valid = false;
      }
    }
  }
  
  return valid;
}

// ==========================================
// SUBMISSÃO FINAL DO FORMULÁRIO
// ==========================================

async function submitForm() {
  try {
    // Mostrar loading
    btnProximo.disabled = true;
    btnProximo.textContent = 'Processando...';
    
    // Coletar dados do formulário
    const dadosUsuario = {
      dadosPessoais: {
        nome: getInputValue('nome'),
        cpf: getInputValue('cpf'),
        dataNascimento: getInputValue('dataNascimento'),
        sexo: getRadioValue('sexo'),
        email: getInputValue('email'),
        telefone: getInputValue('telefone'),
        telefone2: getInputValue('telefone2')
      },
      endereco: {
        estado: getInputValue('estado'),
        cidade: getInputValue('cidade'),
        bairro: getInputValue('bairro')
      },
      atendimento: {
        modalidade: getRadioValue('modalidade'),
        faixaEtaria: getInputValue('faixaEtaria'),
        abordagem: getInputValue('abordagem'),
        urgencia: getInputValue('urgencia'),
        observacoes: getInputValue('observacoes')
      },
      configuracoes: {
        receberEmails: document.getElementById('contato-email')?.checked || false,
        receberTelefone: document.getElementById('contato-telefone')?.checked || false,
        receberWhatsApp: document.getElementById('contato-whatsapp')?.checked || false
      }
    };
    
    // Enviar para API
    const response = await fetch(`${API_URL}/usuario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dados: dadosUsuario })
    });
    
    const resultado = await response.json();
    
    if (response.ok) {
      // ✅ 1. SALVAR NO LOCAL STORAGE (LOGADO)
      localStorage.setItem('usuarioLogado', resultado.usuario.id);
      
      // ✅ 2. MOSTRAR TELA DE SUCESSO
      mostrarTelaSuccesso(resultado.usuario.protocolo, resultado.usuario.dadosPessoais.nome);
      
      // ✅ 3. REDIRECIONAR APÓS 5 SEGUNDOS
      setTimeout(() => {
        // Ajuste o caminho conforme sua estrutura de pastas:
        // Se inscrição está em /codigo-fonte/index.html use: 'pages/Usuario/index.html'
        // Se inscrição está em /codigo-fonte/pages/inscricao.html use: 'Usuario/index.html'
        const targetUrl = 'pages/Usuario/index.html'; 
        console.log('Redirecionando para:', targetUrl);
        window.location.href = targetUrl; 
      }, 5000);
      
    } else {
      // Trata erros do servidor (400, 500, etc.)
      const mensagemErro = resultado.mensagem || 'Erro desconhecido ao processar inscrição.';
      alert('Erro: ' + mensagemErro);
      
      // Garante que os botões voltem ao normal após o erro
      btnProximo.disabled = false;
      btnProximo.textContent = 'Confirmar Inscrição';
    }
    
  } catch (error) {
    console.error('Erro ao submeter formulário:', error);
    alert('Erro ao processar inscrição. Verifique sua conexão e tente novamente.');
    
    // Garante que os botões voltem ao normal após o erro
    btnProximo.disabled = false;
    btnProximo.textContent = 'Confirmar Inscrição';
  }
}

function mostrarTelaSuccesso(protocolo, nome) {
  const protocolNumberElement = document.getElementById('protocolNumber');
  if (protocolNumberElement) {
    protocolNumberElement.textContent = protocolo;
  }
  
  // Esconde as seções do formulário
  document.querySelectorAll('.form-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Mostra a seção de sucesso (IMPORTANTE: deve existir no HTML com data-section="success")
  const successSection = document.querySelector('.form-section[data-section="success"]');
  if (successSection) {
    successSection.classList.add('active');
  }
  
  // Esconde barra de progresso e botões
  const progressBar = document.querySelector('.progress-bar');
  if (progressBar) progressBar.style.display = 'none';
  
  const buttons = document.querySelector('.buttons');
  if (buttons) buttons.style.display = 'none';
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  window.location.href = '/codigo-fonte/pages/Usuario/index.html'
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function getInputValue(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : '';
}

function getRadioValue(name) {
  const radio = document.querySelector(`input[name="${name}"]:checked`);
  return radio ? radio.value : '';
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

// Inicia a navegação na primeira etapa
goToStep(currentStep);

console.log('Sistema de inscrição Psicohelp carregado com sucesso!');