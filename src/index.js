const express = require('express');
const bodyParser = require('body-parser');
const talker = require('./routes/talker');
const login = require('./routes/login');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send('Rota Inicial');
});

app.use('/', talker);
app.use('/', login);

app.listen(PORT, () => {
  console.log('Online');
});
