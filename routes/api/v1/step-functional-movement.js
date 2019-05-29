var express = require('express');
var api = express.Router();

var stepFunctionalMovementController = require('../../../controllers/step-functional-movement');
const {verificarToken} = require('../../../middleware/authentication');

api.post('/',[verificarToken], stepFunctionalMovementController.post);
api.get('/:id',[verificarToken], stepFunctionalMovementController.getTotalsByStep);

module.exports = api;