let currentStep = 1;
const totalSteps = 4;

const btnProximo = document.getElementById('btnProximo');
const btnVoltar = document.getElementById('btnVoltar');
const progressLine = document.getElementById('progressLine');

// Máscaras de input
document.getElementById('cpf').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = value;
});

document.getElementById('telefone').addEventListener('input', formatPhone);
document.getElementById('telefone2').addEventListener('input', formatPhone);

function formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    e.target.value = value;
}

// Navegação entre etapas
btnProximo.addEventListener('click', function() {
    if (validateCurrentStep()) {
    if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
    } else {
        submitForm();
    }
    }
});

btnVoltar.addEventListener('click', function() {
    if (currentStep > 1) {
    goToStep(currentStep - 1);
    }
});

function goToStep(step) {
    // Remover active das seções
    document.querySelectorAll('.form-section').forEach(section => {
    section.classList.remove('active');
    });
    
    // Ativar seção atual
    document.querySelector(`.form-section[data-section="${step}"]`).classList.add('active');
    
    // Atualizar steps
    document.querySelectorAll('.step').forEach(stepEl => {
    const stepNum = parseInt(stepEl.getAttribute('data-step'));
    stepEl.classList.remove('active', 'completed');
    if (stepNum < step) {
        stepEl.classList.add('completed');
    } else if (stepNum === step) {
        stepEl.classList.add('active');
    }
    });
    
    // Atualizar linha de progresso
    const progress = ((step - 1) / (totalSteps - 1)) * 100;
    progressLine.style.width = progress + '%';
    
    // Atualizar botões
    btnVoltar.style.display = step > 1 ? 'block' : 'none';
    btnProximo.textContent = step === totalSteps ? 'Confirmar Inscrição' : 'Próximo';
    
    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateCurrentStep() {
    const currentSection = document.querySelector(`.form-section[data-section="${currentStep}"]`);
    const inputs = currentSection.querySelectorAll('input[required], select[required]');
    let valid = true;
    
    inputs.forEach(input => {
    if (input.type === 'radio') {
        const radioGroup = currentSection.querySelectorAll(`input[name="${input.name}"]`);
        const isChecked = Array.from(radioGroup).some(radio => radio.checked);
        if (!isChecked && valid) {
        alert('Por favor, selecione uma opção');
        valid = false;
        }
    } else if (input.type === 'checkbox' && input.id === 'termos') {
        if (!input.checked) {
        alert('Você deve concordar com os termos para continuar');
        valid = false;
        }
    } else if (!input.value.trim()) {
        input.classList.add('error');
        const errorMsg = document.getElementById(input.id + '-error');
        if (errorMsg) errorMsg.classList.add('show');
        valid = false;
    } else {
        input.classList.remove('error');
        const errorMsg = document.getElementById(input.id + '-error');
        if (errorMsg) errorMsg.classList.remove('show');
    }
    });
    
    // Validar pelo menos um método de contato na etapa 2
    if (currentStep === 2) {
    const contatoCheckboxes = currentSection.querySelectorAll('input[name="contato"]');
    const isChecked = Array.from(contatoCheckboxes).some(cb => cb.checked);
    if (!isChecked) {
        alert('Selecione pelo menos uma forma de contato');
        valid = false;
    }
    }
    
    return valid;
}

function submitForm() {
    // Gerar número de protocolo aleatório
    const protocolNumber = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('protocolNumber').textContent = protocolNumber;
    
    // Mostrar tela de sucesso
    document.querySelectorAll('.form-section').forEach(section => {
    section.classList.remove('active');
    });
    document.querySelector('.form-section[data-section="success"]').classList.add('active');
    
    // Ocultar progresso e botões
    document.querySelector('.progress-bar').style.display = 'none';
    document.querySelector('.buttons').style.display = 'none';
    
    // Aqui você enviaria os dados para o servidor
    console.log('Formulário enviado com sucesso!');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}