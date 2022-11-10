const fs = require('fs').promises;

async function converter(caminho) {
  const arq = await fs.readFile(caminho);
  const dados = JSON.parse(arq);
  return dados;
}  
  async function escrever(caminho, novoDado) {
  const dados = await converter(caminho) || [];
  const novosDados = JSON.stringify([...dados, { id: dados.length + 1, ...novoDado }]);

  await fs.writeFile(caminho, novosDados);
  return { id: dados.length + 1, ...novoDado };
}

module.exports = {
  converter,
  escrever,
};
