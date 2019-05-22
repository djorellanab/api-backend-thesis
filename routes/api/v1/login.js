var express = require('express');
var api = express.Router();

var loginController = require('../../../controllers/login');

api.post('/', loginController.post);

module.exports = api;