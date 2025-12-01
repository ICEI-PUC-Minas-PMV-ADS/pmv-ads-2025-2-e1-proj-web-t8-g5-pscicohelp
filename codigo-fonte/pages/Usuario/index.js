// ==========================================
// DASHBOARD DO USUÁRIO - PSICOHELP
// ==========================================

const API_URL = 'http://localhost:3000/api';
let dadosUsuario = null;

// ==========================================
// VERIFICAÇÃO DE AUTENTICAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', async function() {
  const usuarioLogadoId = localStorage.getItem('usuarioLogado');
  
  if (!usuarioLogadoId) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = '../../index.html';
    return;
  }
  
  await carregarDadosUsuario(usuarioLogadoId);
  renderizarDashboard();
  configurarEventos();
});

// ==========================================
// CARREGAR DADOS DO USUÁRIO DA API
// ==========================================

async function carregarDadosUsuario(usuarioId) {
  try {
    const response = await fetch(`${API_URL}/usuario/${usuarioId}`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar dados do usuário');
    }
    
    const resultado = await response.json();
    
    if (resultado.success && resultado.usuario) {
      dadosUsuario = resultado.usuario;
      console.log('✅ Dados do usuário carregados:', dadosUsuario);
    } else {
      throw new Error('Formato de resposta inválido');
    }
    
  } catch (error) {
    console.error('❌ Erro ao carregar dados:', error);
    alert('Erro ao carregar seus dados. Tente novamente mais tarde.');
    localStorage.removeItem('usuarioLogado');
    window.location.href = '../../index.html';
  }
}

// ==========================================
// RENDERIZAR DADOS NO DASHBOARD
// ==========================================

function renderizarDashboard() {
  if (!dadosUsuario) {
    console.error('Nenhum dado de usuário disponível');
    return;
  }
  
  console.log('🎨 Renderizando dashboard...');
  
  // ===== HEADER - DADOS DO USUÁRIO =====
  renderizarHeader();
  
  // ===== ABA: VISÃO GERAL =====
  renderizarVisaoGeral();
  
  // ===== ABA: MEUS DADOS =====
  renderizarMeusDados();
}

// ==========================================
// RENDERIZAR HEADER
// ==========================================

function renderizarHeader() {
  // Avatar com iniciais
  const avatar = document.querySelector('.avatar');
  if (avatar) {
    const iniciais = obterIniciais(dadosUsuario.dadosPessoais.nome);
    avatar.textContent = iniciais;
  }
  
  // Nome do usuário
  const nomeElement = document.querySelector('.user-details h1');
  if (nomeElement) {
    nomeElement.textContent = dadosUsuario.dadosPessoais.nome || 'Usuário';
  }
  
  // Email e CPF
  const detalhesElement = document.querySelector('.user-details p');
  if (detalhesElement) {
    const email = dadosUsuario.dadosPessoais.email || 'Não informado';
    const cpf = dadosUsuario.dadosPessoais.cpf || 'Não informado';
    detalhesElement.textContent = `${email} • CPF: ${cpf}`;
  }
}

// ==========================================
// RENDERIZAR VISÃO GERAL
// ==========================================

function renderizarVisaoGeral() {
  const visaoGeral = document.getElementById('visao-geral');
  if (!visaoGeral) {
    console.warn('⚠️ Elemento #visao-geral não encontrado');
    return;
  }
  
  console.log('🎨 Renderizando Visão Geral...');
  
  // ===== CARD: MEU STATUS =====
  const situacao = traduzirSituacao(dadosUsuario.atendimento.situacao);
  const instituicao = dadosUsuario.atendimento.instituicao || 'Aguardando alocação';
  const profissional = dadosUsuario.atendimento.profissional || 'Aguardando alocação';
  const inicioTratamento = dadosUsuario.atendimento.inicioTratamento 
    ? formatarData(dadosUsuario.atendimento.inicioTratamento) 
    : 'Não iniciado';
  
  // Buscar todos os .info-value dentro do primeiro .card
  const cardStatus = visaoGeral.querySelector('.card');
  if (cardStatus) {
    const infoValues = cardStatus.querySelectorAll('.info-value');
    if (infoValues.length >= 4) {
      infoValues[0].textContent = situacao;
      infoValues[1].textContent = instituicao;
      infoValues[2].textContent = profissional;
      infoValues[3].textContent = inicioTratamento;
      console.log('✅ Status atualizado:', { situacao, instituicao, profissional, inicioTratamento });
    } else {
      console.warn('⚠️ Não encontrou 4 .info-value no card de status');
    }
    
    // Badge de status
    const badge = cardStatus.querySelector('.status-badge');
    if (badge) {
      const statusClass = dadosUsuario.atendimento.situacao === 'em_atendimento' ? 'status-active' : 'status-pending';
      badge.className = `status-badge ${statusClass}`;
      badge.textContent = dadosUsuario.atendimento.situacao === 'em_atendimento' ? '● Ativo' : '● Aguardando';
    }
    
    // Barra de progresso
    const progressoLabel = cardStatus.querySelector('.progress-label span:last-child');
    const progressoFill = cardStatus.querySelector('.progress-fill');
    if (progressoLabel && progressoFill) {
      const realizadas = dadosUsuario.sessoes.realizadas || 0;
      const total = dadosUsuario.sessoes.total || 0;
      
      if (total > 0) {
        const percentual = (realizadas / total) * 100;
        progressoLabel.innerHTML = `<strong>${realizadas}</strong> de ${total} sessões`;
        progressoFill.style.width = `${percentual}%`;
      } else {
        progressoLabel.textContent = 'Nenhuma sessão agendada';
        progressoFill.style.width = '0%';
      }
    }
  }
  
  // ===== CARD: PRÓXIMA SESSÃO =====
  const todosCards = visaoGeral.querySelectorAll('.card');
  const cardProxima = todosCards[1]; // Segundo card
  
  if (cardProxima) {
    console.log('📅 Atualizando card de Próxima Sessão...');
    
    if (dadosUsuario.sessoes.proxima) {
      const proxima = dadosUsuario.sessoes.proxima;
      
      const dateElement = cardProxima.querySelector('.appointment-date');
      const timeElement = cardProxima.querySelector('.appointment-time');
      const detailsElement = cardProxima.querySelector('.appointment-details');
      
      if (dateElement) dateElement.textContent = formatarDataCompleta(proxima.data);
      if (timeElement) timeElement.textContent = proxima.horario || '00:00 - 00:00';
      if (detailsElement) {
        detailsElement.innerHTML = `
          📍 Modalidade: ${proxima.modalidade || dadosUsuario.atendimento.modalidade}<br>
          👨‍⚕️ ${proxima.profissional || dadosUsuario.atendimento.profissional || 'Profissional não definido'}<br>
          💬 Sessão nº ${proxima.numero || (dadosUsuario.sessoes.realizadas + 1)}
        `;
      }
      console.log('✅ Próxima sessão atualizada');
    } else {
      const appointmentCard = cardProxima.querySelector('.appointment-card');
      if (appointmentCard) {
        appointmentCard.innerHTML = `
          <div style="text-align: center; padding: 20px; color: #999;">
            <div style="font-size: 48px; margin-bottom: 10px;">📅</div>
            <p>Nenhuma sessão agendada no momento</p>
          </div>
        `;
        console.log('ℹ️ Nenhuma sessão agendada');
      }
    }
  } else {
    console.warn('⚠️ Card de Próxima Sessão não encontrado');
  }
  
  // ===== CARD: OBJETIVOS DO TRATAMENTO =====
  const cardObjetivos = todosCards[2]; // Terceiro card
  
  if (cardObjetivos) {
    console.log('🎯 Atualizando card de Objetivos...');
    
    const abordagem = dadosUsuario.atendimento.abordagem || 'Não definida';
    const observacoes = dadosUsuario.atendimento.observacoes || 'Nenhuma observação registrada';
    
    const objetivosInfoValues = cardObjetivos.querySelectorAll('.info-value');
    if (objetivosInfoValues.length >= 2) {
      objetivosInfoValues[0].textContent = observacoes;
      objetivosInfoValues[1].textContent = traduzirAbordagem(abordagem);
      
      if (objetivosInfoValues[2]) {
        objetivosInfoValues[2].textContent = 
          dadosUsuario.sessoes.total > 0 
            ? `${Math.ceil(dadosUsuario.sessoes.total / 4)} meses (${dadosUsuario.sessoes.total} sessões)` 
            : 'A definir';
      }
      console.log('✅ Objetivos atualizados');
    }
  } else {
    console.warn('⚠️ Card de Objetivos não encontrado');
  }
}

// ==========================================
// RENDERIZAR MEUS DADOS
// ==========================================

function renderizarMeusDados() {
  const abaDados = document.getElementById('dados');
  if (!abaDados) return;
  
  // ===== DADOS PESSOAIS =====
  const inputNome = abaDados.querySelector('#edit-nome');
  const inputEmail = abaDados.querySelector('#edit-email');
  const inputTelefone = abaDados.querySelector('#edit-telefone');
  const inputCPF = abaDados.querySelector('#edit-cpf');
  const inputData = abaDados.querySelector('#edit-data');
  
  if (inputNome) inputNome.value = dadosUsuario.dadosPessoais.nome || '';
  if (inputEmail) inputEmail.value = dadosUsuario.dadosPessoais.email || '';
  if (inputTelefone) inputTelefone.value = dadosUsuario.dadosPessoais.telefone || '';
  if (inputCPF) inputCPF.value = dadosUsuario.dadosPessoais.cpf || '';
  if (inputData) inputData.value = dadosUsuario.dadosPessoais.dataNascimento || '';
  
  // ===== ENDEREÇO =====
  const selectEstado = abaDados.querySelector('#edit-estado');
  const inputCidade = abaDados.querySelector('#edit-cidade');
  const inputBairro = abaDados.querySelector('#edit-bairro');
  
  if (selectEstado) selectEstado.value = dadosUsuario.endereco.estado || '';
  if (inputCidade) inputCidade.value = dadosUsuario.endereco.cidade || '';
  if (inputBairro) inputBairro.value = dadosUsuario.endereco.bairro || '';
}

// ==========================================
// CONFIGURAR EVENTOS
// ==========================================

function configurarEventos() {
  // Botão de logout
  const btnLogout = document.querySelector('.btn-logout');
  if (btnLogout) {
    btnLogout.onclick = fazerLogout;
  }
}

function fazerLogout() {
  if (confirm('Deseja realmente sair?')) {
    localStorage.removeItem('usuarioLogado');
    window.location.href = '../../index.html';
  }
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function obterIniciais(nome) {
  if (!nome) return 'U';
  const partes = nome.trim().split(' ');
  if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
  return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
}

function formatarData(dataISO) {
  if (!dataISO) return '';
  const data = new Date(dataISO + 'T00:00:00');
  return data.toLocaleDateString('pt-BR');
}

function formatarDataCompleta(dataISO) {
  if (!dataISO) return '';
  const data = new Date(dataISO);
  const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const dia = data.getDate().toString().padStart(2, '0');
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  return `${diasSemana[data.getDay()]}, ${dia}/${mes}`;
}

function traduzirSituacao(situacao) {
  const map = {
    'lista_espera': 'Na Lista de Espera',
    'aguardando': 'Aguardando Análise',
    'em_analise': 'Em Análise',
    'aprovado': 'Aprovado',
    'em_atendimento': 'Em Atendimento',
    'concluido': 'Concluído',
    'cancelado': 'Cancelado'
  };
  return map[situacao] || situacao;
}

function traduzirAbordagem(abordagem) {
  const map = {
    'tcc': 'Terapia Cognitivo-Comportamental (TCC)',
    'psicanalitica': 'Psicanalítica',
    'humanista': 'Humanista',
    'gestalt': 'Gestalt-terapia',
    'sistemica': 'Sistêmica',
    'outra': 'Outra abordagem'
  };
  return map[abordagem] || abordagem;
}

// ==========================================
// FUNÇÕES DE MODAL (MANTER AS EXISTENTES)
// ==========================================

function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(tabName).classList.add('active');
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function setRating(stars) {
  const allStars = document.querySelectorAll('.star');
  allStars.forEach((star, index) => {
    star.style.opacity = index < stars ? '1' : '0.3';
  });
}

console.log('✅ Dashboard do usuário carregado com sucesso!');