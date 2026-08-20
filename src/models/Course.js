const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  codigo: { type: String, required: true, unique: true, trim: true },
  descricao: { type: String, trim: true },
  idadeMinima: { type: Number, required: true, default: 0, min: 0 },
  capacidadeVagas: { type: Number, required: true, min: 1 },
  vagasOcupadas: { type: Number, default: 0, min: 0 },
  valorMensalidade: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['ABERTO', 'ENCERRADO'],
    default: 'ABERTO'
  }
}, { timestamps: true });

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
