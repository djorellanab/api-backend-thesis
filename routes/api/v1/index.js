const express = require('express');
const app = express();

app.use('/login', require('./login'));
app.use('/functionalmovement', require('./functional-movement'));

module.exports = app;