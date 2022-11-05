const express = require('express');
const { converter } = require('../middlewares/ferramentas');

const talker = express.Router();

talker.get('/', async (_req, res) => {
  const path = `${__dirname}/../talker.json`;
  const palestrantes = await converter(path);

  if (!palestrantes) {
    return res.status(200).json([]);
  }

  return res.status(200).json(palestrantes);
});

module.exports = {
  talker,
};
