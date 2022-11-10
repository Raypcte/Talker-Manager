const fs = require('fs').promises;

const path = `${__dirname}/../talker.json`;

async function converter() {
  const arq = await fs.readFile(path);
  const dados = JSON.parse(arq);
  return dados;
}  

async function escrever(novoDado) {
  const dados = await converter() || [];

  const novosDados = JSON.stringify([
    ...dados,
    { id: dados.length + 1, ...novoDado },
  ]);

  await fs.writeFile(path, novosDados);
  return { id: dados.length + 1, ...novoDado };
}

module.exports = {
  converter,
  escrever,
};