var express = require('express');
var api = express.Router();

var iaController = require('../../../controllers/ia');

api.get('/train/:id', iaController.train);
api.post('/predict', iaController.predict);

module.exports = api;