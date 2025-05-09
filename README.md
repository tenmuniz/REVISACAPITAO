# Sistema de Escalas Militares

Sistema completo para gerenciamento de escalas de militares, incluindo calendário interativo, gerenciamento de militares e relatórios de horas trabalhadas.

## Funcionalidades

- Cadastro de militares (nome, patente, telefone, email)
- Gerenciamento de escalas (data, horário de início e fim)
- Limitação de 3 militares distintos por dia
- Visualização de escala em formato de calendário
- Relatórios detalhados por período

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- MySQL
- RESTful API

### Frontend
- React
- Material UI
- React Router
- Axios

## Estrutura do Banco de Dados

O sistema utiliza duas tabelas principais:

- **militar**: Armazena informações dos militares (id, nome, patente, telefone, email)
- **escala**: Gerencia os plantões (id, data_escala, horario_inicio, horario_fim, militar_id)

## Instalação e Execução

### Requisitos
- Node.js (v14 ou superior)
- MySQL (v5.7 ou superior)

### Configuração do Banco de Dados
1. Crie um banco de dados MySQL chamado `operacao_policial`
2. Ajuste as credenciais do banco no arquivo `.env` (use o arquivo `.env.example` como base)

### Instalação das Dependências
```bash
# Instalar dependências do backend
npm install

# Instalar dependências do frontend
npm run install-client
```

### Execução
```bash
# Iniciar apenas o backend
npm start

# Iniciar apenas o frontend
npm run client

# Iniciar backend e frontend (em terminais separados)
npm start
npm run client
```

O servidor backend estará disponível em: `http://localhost:3001`  
O frontend estará disponível em: `http://localhost:3000`

## Endpoints da API

### Militares
- GET `/api/militares` - Listar todos os militares
- GET `/api/militares/:id` - Buscar militar por ID
- POST `/api/militares` - Criar novo militar
- PUT `/api/militares/:id` - Atualizar militar
- DELETE `/api/militares/:id` - Excluir militar

### Escalas
- GET `/api/escalas` - Listar todas as escalas
- GET `/api/escalas/:id` - Buscar escala por ID
- GET `/api/escalas/data/:data` - Buscar escalas por data
- GET `/api/escalas/periodo` - Buscar escalas por período
- GET `/api/escalas/relatorio` - Gerar relatório de escalas
- POST `/api/escalas` - Criar nova escala
- PUT `/api/escalas/:id` - Atualizar escala
- DELETE `/api/escalas/:id` - Excluir escala 