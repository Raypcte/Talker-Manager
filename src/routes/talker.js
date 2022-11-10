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
  const dateRegex = new RegExp(/\d{2}\/\d{2}\/\d{4}/);
  return !dateRegex.test(data);
};

const midAut = (req, res, next) => {
  const { headers: { authorization } } = req;
  if (!authorization) {
    res.status(401).json({
      message: 'Token não encontrado',
    });
  }
  if (authorization.length !== 16) {
    res.status(401).json({
      message: 'Token inválido',
    });
  }
  next();
};

const midName = (req, res, next) => {
  const { body: pessoaNova, headers: { authorization } } = req;
  if (authorization) {
    if (!pessoaNova.name) {
      res.status(400).json({
        message: 'O campo "name" é obrigatório',
      });
    }
    if (pessoaNova.name.length < 3) {
      res.status(400).json({
        message: 'O "name" deve ter pelo menos 3 caracteres',
      });
    }
  }
  next();
};

const midAge = (req, res, next) => {
  const { body: pessoaNova, headers: { authorization } } = req;
  if (authorization) {
    if (!pessoaNova.age) {
      res.status(400).json({
        message: 'O campo "age" é obrigatório',
      });
    }
    if (pessoaNova.age < 18) {
      res.status(400).json({
        message: 'A pessoa palestrante deve ser maior de idade',
      });
    }
  }
  next();
};

const midTalk = (req, res, next) => {
  const { body: pessoaNova, headers: { authorization } } = req;
  if (authorization) {
    if (!pessoaNova.talk) {
      res.status(400).json({
        message: 'O campo "talk" é obrigatório',
      });
    }
    if (!pessoaNova.talk.watchedAt) {
      res.status(400).json({
        message: 'O campo "watchedAt" é obrigatório',
      });
    }
    if (validaData(pessoaNova.talk.watchedAt)) {
      res.status(400).json({
        message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
      });
    }
    if (!pessoaNova.talk.rate) {
      res.status(400).json({
        message: 'O campo "rate" é obrigatório',
      });
    }
    if (pessoaNova.talk.rate < 1 || pessoaNova.talk.rate > 5) {
      res.status(400).json({
        message: 'O campo "rate" deve ser um inteiro de 1 à 5',
      });
    }
  }
  next();
};

talker.post(
  '/talker',
  midAut,
  midName,
  midAge,
  midTalk,
 async (req, res) => {
  const pessoaNova = req.body;
  console.log(pessoaNova);
  const path = `${__dirname}/../talker.json`;
  const pessoa = await escrever(path, pessoaNova);

  // res.status(201).json(pessoa);
},
);

module.exports = talker;