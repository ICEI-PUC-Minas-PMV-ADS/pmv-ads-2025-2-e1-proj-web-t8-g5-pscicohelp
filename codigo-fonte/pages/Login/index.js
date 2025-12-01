// Credenciais de demonstração
const DEMO_CREDENTIALS = {
    email: ['demo@psicohelp.com', 'maria.silva@email.com', '123.456.789-00'],
    password: ['demo123', 'senha123']
};

// Toggle mostrar/ocultar senha
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleBtn.textContent = '👁️‍🗨️';
    } else {
    passwordInput.type = 'password';
    toggleBtn.textContent = '👁️';
    }
}

// Mostrar alerta
function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');
    
    alertBox.className = `alert alert-${type} show`;
    alertMessage.textContent = message;
    
    // Auto-ocultar após 5 segundos
    setTimeout(() => {
    alertBox.classList.remove('show');
    }, 5000);
}

// Validar campo
function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const errorMsg = document.getElementById(`${fieldId}-error`);
    
    if (!field.value.trim()) {
    field.classList.add('error');
    errorMsg.classList.add('show');
    return false;
    } else {
    field.classList.remove('error');
    errorMsg.classList.remove('show');
    return true;
    }
}

// Validar credenciais
function validateCredentials(email, password) {
    return DEMO_CREDENTIALS.email.some(validEmail => 
    validEmail.toLowerCase() === email.toLowerCase()
    ) && DEMO_CREDENTIALS.password.includes(password);
}

// Remover erro ao digitar
document.getElementById('email').addEventListener('input', function() {
    this.classList.remove('error');
    document.getElementById('email-error').classList.remove('show');
    document.getElementById('alertBox').classList.remove('show');
});

document.getElementById('password').addEventListener('input', function() {
    this.classList.remove('error');
    document.getElementById('password-error').classList.remove('show');
    document.getElementById('alertBox').classList.remove('show');
});

// Submit do formulário
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validar campos
    const emailValid = validateField('email');
    const passwordValid = validateField('password');
    
    if (!emailValid || !passwordValid) {
    const loginCard = document.querySelector('.login-card');
    loginCard.classList.add('shake');
    setTimeout(() => loginCard.classList.remove('shake'), 400);
    return;
    }
    
    // Validar credenciais
    if (validateCredentials(email, password)) {
    // Salvar preferência de lembrar
    if (remember) {
        localStorage.setItem('psicohelp_remember', 'true');
        localStorage.setItem('psicohelp_user', email);
    }
    
    // Mostrar mensagem de sucesso
    showAlert('Login realizado com sucesso! Redirecionando...', 'info');
    
    // Desabilitar botão
    const btn = document.querySelector('.btn');
    btn.disabled = true;
    btn.textContent = 'Entrando...';
    
    // Simular carregamento e redirecionar
    setTimeout(() => {
        // Redirecionar para a área do paciente
        window.location.href = 'minha-area.html';
    }, 1500);
    
    } else {
    // Credenciais inválidas
    showAlert('E-mail/CPF ou senha incorretos. Tente novamente.', 'error');
    
    const loginCard = document.querySelector('.login-card');
    loginCard.classList.add('shake');
    setTimeout(() => loginCard.classList.remove('shake'), 400);
    
    // Limpar senha
    document.getElementById('password').value = '';
    document.getElementById('password').focus();
    }
});

// Verificar se há sessão salva ao carregar
window.addEventListener('load', function() {
    if (localStorage.getItem('psicohelp_remember') === 'true') {
    const savedUser = localStorage.getItem('psicohelp_user');
    if (savedUser) {
        document.getElementById('email').value = savedUser;
        document.getElementById('remember').checked = true;
    }
    }
});

// Permitir Enter para submeter
document.getElementById('password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
});