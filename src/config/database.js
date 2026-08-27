const mongoose = require('mongoose');

/** Conexão Mongoose reutilizável por server.js e seed.js (testes usam tests/helpers/mongo.js). */
async function connect(uri) {
  await mongoose.connect(uri);
  return mongoose.connection;
}

async function disconnect() {
  await mongoose.disconnect();
}

module.exports = { connect, disconnect };
