const express = require('express');
const login = express.Router();

const crypto = require('crypto');

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

login.post('/login', (request, response) => {
  const { email, password } = request.body;
  
  return response.status(200).send(`{ "token": "${generateToken()}" }`);
});

module.exports = login;