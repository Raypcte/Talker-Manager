const express = require('express');
const fs = require('fs').promises;
const { converter, escrever } = require('../middlewares/ferramentas');

const path = `${__dirname}/../talker.json`;
const talker = express.Router();

// MIDDLEWARES DE VALIDACAO
const validaData = (data) => {
  const dateRegex = new RegExp(/\d{2}\/\d{2}\/\d{4}/);
  console.log(data, dateRegex.test(data), 'dataaaaa');
  return dateRegex.test(data);
};

const midAut = (req, res, next) => {
  const {
    headers: { authorization },
  } = req;
  console.log(authorization);
  if (!authorization) {
    return res.status(401).json({
      message: 'Token não encontrado',
    });
  }
  if (authorization.length !== 16) {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }
  next();
};

const midName = (req, res, next) => {
  const {
    body: pessoaNova,
    headers: { authorization },
  } = req;
  if (authorization) {
    if (!pessoaNova.name) {
      return res.status(400).json({
        message: 'O campo "name" é obrigatório',
      });
    }
    if (pessoaNova.name.length < 3) {
      return res.status(400).json({
        message: 'O "name" deve ter pelo menos 3 caracteres',
      });
    }
  }
  next();
};

const midAge = (req, res, next) => {
  const {
    body: pessoaNova,
    headers: { authorization },
  } = req;
  if (authorization) {
    if (!pessoaNova.age) {
      return res.status(400).json({
        message: 'O campo "age" é obrigatório',
      });
    }
    if (pessoaNova.age < 18) {
      return res.status(400).json({
        message: 'A pessoa palestrante deve ser maior de idade',
      });
    }
  }
  next();
};

const midTalk = (req, res, next) => {
  const { body: pessoaNova } = req;
    if (!pessoaNova.talk) {
      return res.status(400).json({
        message: 'O campo "talk" é obrigatório',
      });
    }
    if (!pessoaNova.talk.watchedAt) {
      return res.status(400).json({
        message: 'O campo "watchedAt" é obrigatório',
      });
    }
    if (validaData(pessoaNova.talk.watchedAt) !== true) {
      return res.status(400).json({
        message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
      });
    }
  next();
};

const midRate = (req, res, next) => {
  const { body: pessoaNova } = req;
    if (!pessoaNova.talk.rate && typeof pessoaNova.talk.rate !== 'number') {
      console.log(pessoaNova.talk.rate);
      return res.status(400).json({
        message: 'O campo "rate" é obrigatório',
      });
    }
  next();
};

const midRateNumber = (req, res, next) => {
  const { body: pessoaNova } = req;
    if (
      pessoaNova.talk.rate < 1
      || pessoaNova.talk.rate > 5
      || String(pessoaNova.talk.rate).includes('.')
    ) {
      return res.status(400).json({
        message: 'O campo "rate" deve ser um inteiro de 1 à 5',
      });
    }
  next();
};

// ROTA DE LEITURA PARA TODOS OS PALESTRANTES
talker.get('/talker', async (_req, res) => {
  const palestrantes = await converter();

  if (!palestrantes) {
    return res.status(200).json([]);
  }

  return res.status(200).json(palestrantes);
});

// ROTA DE LEITURA PELO NOME DO PALESTRANTE
talker.get('/talker/search', midAut, async (req, res) => {
  const { q } = req.query;
  console.log(q, 'busca');

  const users = await converter();
  const searchUsers = users.filter((el) => el.name.includes(q));

  if (!q) {
    res.status(200).json(users);
  } else {
    res.status(200).json(searchUsers);
  }
});

// ROTA LEITURA PELO ID DO PALESTRANTE
talker.get('/talker/:id', async (req, res) => {
  const { id } = req.params;

  const palestrantes = await converter();

  const response = palestrantes.find(
    (palestrante) => Number(palestrante.id) === Number(id),
  );

  if (!response) {
    return res
      .status(404)
      .json({ message: 'Pessoa palestrante não encontrada' });
  }

  return res.status(200).json(response);
});

// ROTA DE ESCRITA PARA ADICIONAR UM PALESTRANTE
talker.post(
  '/talker',
  midAut,
  midName,
  midAge,
  midTalk,
  midRate,
  midRateNumber,
  async (req, res) => {
    const pessoaNova = req.body;

    const pessoa = await escrever(pessoaNova);
    return res.status(201).json({ ...pessoa });
  },
);

// ROTA DE ATUALIZACAO DE UM PALESTRANTE
talker.put('/talker/:id', 
midAut,
midName,
midAge,
midTalk,
midRate,
midRateNumber,
async (req, res) => {
  const { id } = req.params;
  const user = await converter();
  // console.log(user);

  const userMap = user
    .map((el) => (
      el.id === Number(id) ? { id: el.id, ...req.body } : el));

  const response = userMap[id - 1];
  await fs.writeFile(path, JSON.stringify(userMap));

  res.status(200).json(response);
});

// ROTA PARA DELETAR UM PALESTRANTE
talker.delete('/talker/:id', midAut, async (req, res) => {
  const { id } = req.params;
  const users = await converter();

  const userFind = users.filter((el) => el.id !== Number(id));
  await fs.writeFile(path, JSON.stringify(userFind));

  return res.sendStatus(204);
});

module.exports = talker;