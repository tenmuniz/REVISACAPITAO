// Função serverless para proteger a chave da API OpenAI
export default async function handler(req, res) {
  // Configurar CORS para permitir requisições da origem do seu site
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
