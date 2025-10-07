let selectedProfile = null;

function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.form-content');
    
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    
    document.querySelector(`[onclick="switchTab('${tab}')"]`).classList.add('active');
    document.getElementById(tab).classList.add('active');
}

function selectProfile(element, profile) {
    const options = document.querySelectorAll('.profile-option');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    selectedProfile = profile;
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    alert(`Login realizado com sucesso!\nE-mail: ${email}`);
}

function handleCadastro(e) {
    e.preventDefault();
    const nome = document.getElementById('cadastro-nome').value;
    const email = document.getElementById('cadastro-email').value;
    const senha = document.getElementById('cadastro-senha').value;
    const confirma = document.getElementById('cadastro-confirma').value;

    if (senha !== confirma) {
    alert('As senhas não conferem!');
    return;
    }

    if (!selectedProfile) {
    alert('Por favor, selecione um perfil (Comunidade ou Instituição)');
    return;
    }

    alert(`Cadastro realizado com sucesso!\nNome: ${nome}\nPerfil: ${selectedProfile}`);
}