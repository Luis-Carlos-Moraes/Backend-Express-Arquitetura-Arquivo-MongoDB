const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Course = require('./models/Course');

const app = express();

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// NOTA PARA O CANDIDATO:
// Esta aplicação é intencionalmente pequena. Organize o novo código de forma
// proporcional ao desafio e refatore o que considerar útil. Não existe um padrão
// arquitetural ou uma quantidade mínima de camadas obrigatória.
// ---------------------------------------------------------------------------

// Rota de Healthcheck
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const isReady = dbState === 1;

  return res.status(isReady ? 200 : 503).json({
    status: isReady ? 'ok' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbStatusMap[dbState] || 'unknown'
  });
});

// Rota básica de listagem de cursos
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().lean();
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
