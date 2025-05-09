const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

console.log('Iniciando configuração do Sistema de Escalas Militares...');

// Verificar se .env existe, caso contrário, criar um
if (!fs.existsSync('.env')) {
  console.log('Criando arquivo .env...');
  const envContent = `DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=operacao_policial
PORT=3001
JWT_SECRET=sistema_escalas_militares_seguro`;

  fs.writeFileSync('.env', envContent);
  console.log('Arquivo .env criado com sucesso!');
}

// Verificar se as dependências estão instaladas
console.log('Verificando dependências do backend...');
if (!fs.existsSync('node_modules')) {
  console.log('Instalando dependências do backend...');
  execSync('npm install', { stdio: 'inherit' });
}

// Verificar se a pasta client/node_modules existe
const clientNodeModulesPath = path.join('client', 'node_modules');
console.log('Verificando dependências do frontend...');
if (!fs.existsSync(clientNodeModulesPath)) {
  console.log('Instalando dependências do frontend...');
  execSync('npm run install-client', { stdio: 'inherit' });
}

console.log('Configuração concluída com sucesso!');
console.log('\nInstruções para iniciar o sistema:');
console.log('1. Certifique-se de que o MySQL está em execução');
console.log('2. Inicie o backend: npm start');
console.log('3. Inicie o frontend: npm run client');
console.log('\nAcesse o frontend em: http://localhost:3000');
console.log('O backend estará disponível em: http://localhost:3001'); 