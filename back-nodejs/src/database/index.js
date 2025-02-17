const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    await mongoose.connect("mongodb://localhost:27017/reservationsystem", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado ao banco de dados!!! 🚀');
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados', err);
    process.exit(1);
  }
};

module.exports = { connectDB };