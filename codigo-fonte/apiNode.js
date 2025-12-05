// ==========================================
// API NODE.JS - PSICOHELP
// Salva em: usuarios.json
// ==========================================

require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose')

const app = express();
const PORT = 3000;

// Caminho do arquivo JSON
const ARQUIVO_JSON = path.join(__dirname, 'usuarios.json');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Servir arquivos estáticos

//Mongodb
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conectado ao banco de dados"))
    .catch(err => console.log("Erro ao conectar com o banco de dados", err))


//Rotas
const instituicoesRoute = require("./routes/instituicoes");
app.use("/api/instituicoes", instituicoesRoute)



// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

// Ler usuários do arquivo
async function lerUsuarios() {
  try {
    const data = await fs.readFile(ARQUIVO_JSON, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Se arquivo não existe, criar vazio
    await fs.writeFile(ARQUIVO_JSON, JSON.stringify([], null, 2));
    return [];
  }
}

// Salvar usuários no arquivo
async function salvarUsuarios(usuarios) {
  await fs.writeFile(ARQUIVO_JSON, JSON.stringify(usuarios, null, 2), 'utf-8');
}

// Gerar ID único
function gerarId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Gerar protocolo
function gerarProtocolo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Verifica se um CPF (limpo ou formatado) já existe na lista de usuários.
 * @param {string} cpf - CPF a ser verificado.
 * @param {Array<Object>} usuarios - Lista de usuários.
 * @returns {boolean} True se o CPF existir, false caso contrário.
 */
function verificarCPFExistente(cpf, usuarios) {
  // Limpa o CPF que veio da requisição (pode vir formatado)
  const cpfLimpoRequisicao = cpf.replace(/\D/g, ''); 
  
  // Verifica se algum usuário existente tem o mesmo CPF limpo
  return usuarios.some(u => {
    // Usa Optional Chaining para garantir que não haverá erro se 'dadosPessoais' ou 'cpf' for undefined
    const cpfUsuarioExistente = u.dadosPessoais?.cpf;
    
    if (cpfUsuarioExistente) {
      return cpfUsuarioExistente.replace(/\D/g, '') === cpfLimpoRequisicao;
    }
    return false;
  });
}

// Verificar email existente
function verificarEmailExistente(email, usuarios) {
  const emailLower = email.toLowerCase();
  return usuarios.some(u => {
    const emailUsuarioExistente = u.dadosPessoais?.email;
    return emailUsuarioExistente && emailUsuarioExistente.toLowerCase() === emailLower;
  });
}

// Template de usuário
function obterTemplateUsuario() {
  return {
    id: '',
    protocolo: '',
    dadosPessoais: {
      nome: '',
      email: '',
      cpf: '',
      telefone: '',
      telefone2: '',
      dataNascimento: '',
      sexo: '',
      avatar: ''
    },
    endereco: {
      estado: '',
      cidade: '',
      bairro: '',
      cep: ''
    },
    atendimento: {
      situacao: 'lista_espera',
      instituicao: '',
      profissional: '',
      inicioTratamento: '',
      abordagem: '',
      faixaEtaria: '',
      urgencia: '',
      modalidade: '',
      observacoes: ''
    },
    sessoes: {
      realizadas: 0,
      total: 0,
      faltas: 0,
      reagendamentos: 0,
      proxima: null,
      agendadas: [],
      historico: []
    },
    documentos: [],
    avaliacoes: [],
    notificacoes: [],
    configuracoes: {
      receberEmails: false,
      receberTelefone: false,
      receberWhatsApp: false
    },
    dataCriacao: '',
    ultimoAcesso: ''
  };
}

// ==========================================
// ROTAS DA API
// ==========================================

// GET - Verificar CPF
app.get('/api/verificarCPF', async (req, res) => {
  try {
    const { cpf } = req.query;
    // Se não houver CPF na query, consideramos que não existe para evitar erro
    if (!cpf) {
      return res.json({ existe: false });
    }
    
    const usuarios = await lerUsuarios();
    const existe = verificarCPFExistente(cpf, usuarios);
    
    res.json({ existe });
  } catch (error) {
    console.error('Erro na rota /verificarCPF:', error);
    res.status(500).json({ erro: 'Erro interno ao verificar CPF' });
  }
});

// GET - Verificar Email
app.get('/api/verificarEmail', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.json({ existe: false });
    }
    const usuarios = await lerUsuarios();
    const existe = verificarEmailExistente(email, usuarios);
    
    res.json({ existe });
  } catch (error) {
    console.error('Erro na rota /verificarEmail:', error);
    res.status(500).json({ erro: 'Erro interno ao verificar email' });
  }
});

// GET - Listar todos os usuários
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await lerUsuarios();
    res.json({
      success: true,
      total: usuarios.length,
      usuarios
    });
  } catch (error) {
    console.error('Erro na rota /usuarios:', error);
    res.status(500).json({ 
      success: false,
      erro: 'Erro ao listar usuários' 
    });
  }
});

// GET - Buscar usuário por ID
app.get('/api/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuarios = await lerUsuarios();
    const usuario = usuarios.find(u => u.id === id);
    
    if (usuario) {
      res.json({ success: true, usuario });
    } else {
      res.status(404).json({ 
        success: false,
        mensagem: 'Usuário não encontrado' 
      });
    }
  } catch (error) {
    console.error(`Erro na rota /usuario/${id}:`, error);
    res.status(500).json({ 
      success: false,
      erro: 'Erro ao buscar usuário' 
    });
  }
});

// POST - Criar novo usuário
app.post('/api/usuario', async (req, res) => {
  try {
    const { dados } = req.body;
    const usuarios = await lerUsuarios();
    
    // Verificar duplicidade antes de criar
    const cpf = dados.dadosPessoais?.cpf || '';
    const email = dados.dadosPessoais?.email || '';
    
    if (verificarCPFExistente(cpf, usuarios)) {
      return res.status(400).json({
        success: false,
        mensagem: 'CPF já cadastrado'
      });
    }
    
    if (verificarEmailExistente(email, usuarios)) {
      return res.status(400).json({
        success: false,
        mensagem: 'Email já cadastrado'
      });
    }
    
    // Criar novo usuário
    const novoUsuario = obterTemplateUsuario();
    novoUsuario.id = gerarId();
    novoUsuario.protocolo = gerarProtocolo();
    novoUsuario.dataCriacao = new Date().toISOString();
    novoUsuario.ultimoAcesso = new Date().toISOString();
    
    // Mesclar dados fornecidos
    novoUsuario.dadosPessoais = { 
      ...novoUsuario.dadosPessoais, 
      ...(dados.dadosPessoais || {}) 
    };
    
    novoUsuario.endereco = { 
      ...novoUsuario.endereco, 
      ...(dados.endereco || {}) 
    };
    
    novoUsuario.atendimento = { 
      ...novoUsuario.atendimento, 
      ...(dados.atendimento || {}) 
    };
    
    novoUsuario.configuracoes = { 
      ...novoUsuario.configuracoes, 
      ...(dados.configuracoes || {}) 
    };
    
    // Adicionar e salvar
    usuarios.push(novoUsuario);
    await salvarUsuarios(usuarios);
    
    res.json({
      success: true,
      mensagem: 'Usuário criado com sucesso',
      usuario: novoUsuario
    });
    
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      success: false,
      erro: 'Erro ao criar usuário'
    });
  }
});

// PUT - Atualizar usuário
app.put('/api/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { dados } = req.body;
    const usuarios = await lerUsuarios();
    
    const index = usuarios.findIndex(u => u.id === id);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        mensagem: 'Usuário não encontrado'
      });
    }
    
    // Atualizar dados
    if (dados.dadosPessoais) {
      usuarios[index].dadosPessoais = {
        ...usuarios[index].dadosPessoais,
        ...dados.dadosPessoais
      };
    }
    
    if (dados.endereco) {
      usuarios[index].endereco = {
        ...usuarios[index].endereco,
        ...dados.endereco
      };
    }
    
    if (dados.atendimento) {
      usuarios[index].atendimento = {
        ...usuarios[index].atendimento,
        ...dados.atendimento
      };
    }
    
    usuarios[index].ultimoAcesso = new Date().toISOString();
    
    await salvarUsuarios(usuarios);
    
    res.json({
      success: true,
      mensagem: 'Usuário atualizado com sucesso',
      usuario: usuarios[index]
    });
    
  } catch (error) {
    console.error(`Erro na rota /usuario/${id} PUT:`, error);
    res.status(500).json({
      success: false,
      erro: 'Erro ao atualizar usuário'
    });
  }
});

// DELETE - Deletar usuário
app.delete('/api/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuarios = await lerUsuarios();
    
    const usuariosFiltrados = usuarios.filter(u => u.id !== id);
    
    if (usuariosFiltrados.length === usuarios.length) {
      return res.status(404).json({
        success: false,
        mensagem: 'Usuário não encontrado'
      });
    }
    
    await salvarUsuarios(usuariosFiltrados);
    
    res.json({
      success: true,
      mensagem: 'Usuário deletado com sucesso'
    });
    
  } catch (error) {
    console.error(`Erro na rota /usuario/${id} DELETE:`, error);
    res.status(500).json({
      success: false,
      erro: 'Erro ao deletar usuário'
    });
  }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {
  console.log(`
  🚀 Servidor rodando!
  
  📍 URL: http://localhost:${PORT}
  📊 API: http://localhost:${PORT}/api/usuarios
  
  ✅ Pronto para receber requisições!
  `);
});