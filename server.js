const express = require('express');
const cors = require('cors');
require('dotenv').config();
const militarRoutes = require('./routes/militarRoutes');
const escalaRoutes = require('./routes/escalaRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/militares', militarRoutes);
app.use('/api/escalas', escalaRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.json({ mensagem: 'API do Sistema de Escalas Militares' });
});

// Criação das tabelas do banco de dados
const db = require('./config/database');
const inicializarBancoDados = async () => {
  try {
    // Criar tabela de militares
    await db.execute(`
      CREATE TABLE IF NOT EXISTS militar (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        patente VARCHAR(50) NOT NULL,
        telefone VARCHAR(20),
        email VARCHAR(100)
      )
    `);
    
    // Criar tabela de escalas
    await db.execute(`
      CREATE TABLE IF NOT EXISTS escala (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data_escala DATE NOT NULL,
        horario_inicio TIME NOT NULL,
        horario_fim TIME NOT NULL,
        militar_id INT NOT NULL,
        FOREIGN KEY (militar_id) REFERENCES militar(id)
      )
    `);
    
    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
};

// Iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await inicializarBancoDados();
});

module.exports = app; 