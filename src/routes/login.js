const express = require('express');

const login = express.Router();

const crypto = require('crypto');

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}
const emailValido = (email) => {
  const regex = /\w+@\w+\.\w+/;
  return regex.test(email);
};

login.post('/login', (request, response) => {
  const { email, password } = request.body;

  if (!email) {
    return response.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (emailValido(email) === false) {
    return response.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    return response.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length <= 5) {
    return response.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  
  return response.status(200).send(`{ "token": "${generateToken()}" }`);
});

module.exports = login;