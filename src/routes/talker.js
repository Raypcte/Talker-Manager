/* eslint-disable max-lines-per-function */
const express = require('express');
const { converter, escrever } = require('../middlewares/ferramentas');

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

const validaData = (data) => {
  const regex = /\d\d\/\d\d\/\d\d\d\d/;
  console.log(data);
  return regex.test(data);
};

const validacaoTalker = (condicao, res, status, message) => {
  if (condicao) {
    res.status(status).json({
      message,
    });
  }
};

talker.post('/talker', (req, res) => {
  const pessoaNova = req.body;
  const token = req.headers;
  console.log(token.authorization);

  validacaoTalker(!token.authorization, res, 401, 'Token não encontrado');
  validacaoTalker(token.authorization.length !== 16, res, 401, 'Token inválido');
  validacaoTalker(!pessoaNova.name, res, 400, 
    'O campo "name" é obrigatório');
  validacaoTalker(pessoaNova.name.length < 3, res, 400, 
    'O "name" deve ter pelo menos 3 caracteres');
  validacaoTalker(!pessoaNova.age, res, 400, 
    'O campo "age" é obrigatório');
  validacaoTalker(pessoaNova.age < 18, res, 400, 
    'A pessoa palestrante deve ser maior de idade');
  validacaoTalker(!pessoaNova.talk, res, 400, 
    'O campo "talk" é obrigatório');
  validacaoTalker(!pessoaNova.talk.watchedAt, res, 400, 
    'O campo "watchedAt" é obrigatório');
  validacaoTalker(!validaData(pessoaNova.talk.watchedAt), res, 400, 
    'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"');
  validacaoTalker(!pessoaNova.talk.rate, res, 400, 
    'O campo "rate" é obrigatório');
  validacaoTalker(pessoaNova.talk.rate < 1 || pessoaNova.talk.rate > 5,
    res, 400, 'O campo "rate" deve ser um inteiro de 1 à 5');

  const path = `${__dirname}/../talker.json`;
  escrever(path, pessoaNova);
});
module.exports = talker;
