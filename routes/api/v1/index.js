const express = require('express');
const app = express();

app.use('/functionalmovement', require('./functional-movement'));
app.use('/ia', require('./ia'));
app.use('/login', require('./login'));
app.use('/stepfunctionalmovement', require('./step-functional-movement'));

module.exports = app;