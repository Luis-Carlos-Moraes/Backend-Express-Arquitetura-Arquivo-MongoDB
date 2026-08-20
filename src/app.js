const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// NOTA PARA O CANDIDATO:
// O código abaixo foi escrito de forma simples e acoplada apenas para garantir
// que o boilerplate execute imediatamente. Sua missão inclui refatorar esta
// estrutura para uma arquitetura limpa, desacoplada e profissional (ex: camadas,
// Clean Architecture, Hexagonal, DDD, separando rotas, controllers, services, etc).
// ---------------------------------------------------------------------------

// Schema e Model inicial de Exemplo (Cursos)
const courseSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  descricao: { type: String },
  idadeMinima: { type: Number, required: true, default: 0 },
  capacidadeVagas: { type: Number, required: true, min: 1 },
  vagasOcupadas: { type: Number, default: 0, min: 0 },
  valorMensalidade: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['ABERTO', 'ENCERRADO'], default: 'ABERTO' }
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);

// Rota de Healthcheck
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  return res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatusMap[dbState] || 'unknown'
  });
});

// Rota básica de listagem de cursos
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar cursos', message: error.message });
  }
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  return res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  return res.status(err.status || 500).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'Ocorreu um erro interno no servidor'
  });
});

module.exports = app;
