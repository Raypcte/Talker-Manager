const express = require('express');
const { converter } = require('../middlewares/ferramentas');

const talker = express.Router();

// ROTA LEITURA DE TODOS PALESTRANTES
talker.get('/talker', async (_req, res) => {
  const path = `${__dirname}/../talker.json`;
  const palestrantes = await converter(path);

  if (!palestrantes) {
    return res.status(200).json([]);
  }

  return res.status(200).json(palestrantes);
});

// ROTA LEITURA DE 01 PALESTRANTE
talker.get('/talker/:id', async (req, res) => {
  const { id } = req.params;

  const path = `${__dirname}/../talker.json`;
  const palestrantes = await converter(path);

  const response = palestrantes
    .find((palestrante) => Number(palestrante.id) === Number(id));

  if (!response) {
    res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }

  res.status(200).json(response);
});

module.exports = {
  talker,
};
