require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27028/desafio_senior';

const initialCourses = [
  {
    nome: 'Introdução ao Direito Digital e Proteção de Dados',
    codigo: 'DIR-DIG-01',
    descricao: 'Fundamentos de LGPD, segurança da informação e compliance digital.',
    idadeMinima: 18,
    capacidadeVagas: 2, // Vagas pequenas propositalmente para facilitar testes de fila de espera!
    vagasOcupadas: 0,
    valorMensalidade: 600.00,
    status: 'ABERTO'
  },
  {
    nome: 'Lógica de Programação e Algoritmos com JavaScript',
    codigo: 'DEV-LOG-01',
    descricao: 'Introdução à computação, estruturas de dados e algoritmos.',
    idadeMinima: 16,
    capacidadeVagas: 5,
    vagasOcupadas: 0,
    valorMensalidade: 450.00,
    status: 'ABERTO'
  },
  {
    nome: 'Especialização em Arquitetura de Software e Microsserviços',
    codigo: 'ARQ-SEN-01',
    descricao: 'Padrões de arquitetura, Clean Architecture, DDD e mensageria.',
    idadeMinima: 21,
    capacidadeVagas: 1, // Capacidade 1 para teste rápido de lotação e repescagem
    vagasOcupadas: 0,
    valorMensalidade: 1200.00,
    status: 'ABERTO'
  }
];

async function seed() {
  try {
    console.log('Conectando ao MongoDB para executar seed...');
    await mongoose.connect(MONGO_URI);

    const Course = mongoose.models.Course || mongoose.model('Course', new mongoose.Schema({
      nome: String,
      codigo: String,
      descricao: String,
      idadeMinima: Number,
      capacidadeVagas: Number,
      vagasOcupadas: Number,
      valorMensalidade: Number,
      status: String
    }));

    console.log('Limpando cursos existentes...');
    await Course.deleteMany({});

    console.log('Inserindo cursos iniciais...');
    await Course.insertMany(initialCourses);

    console.log('✅ Seed executado com sucesso! Cursos disponíveis:');
    const courses = await Course.find();
    console.table(courses.map(c => ({
      Codigo: c.codigo,
      Nome: c.nome,
      IdadeMin: c.idadeMinima,
      Vagas: `${c.vagasOcupadas}/${c.capacidadeVagas}`,
      Mensalidade: `R$ ${c.valorMensalidade.toFixed(2)}`
    })));

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
}

seed();
