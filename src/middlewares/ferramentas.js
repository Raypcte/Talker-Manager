const fs = require('fs').promises;

async function converter(caminho) {
  const arq = await fs.readFile(caminho);
  const dados = JSON.parse(arq);
  return dados;
}  

module.exports = {
  converter,
}
