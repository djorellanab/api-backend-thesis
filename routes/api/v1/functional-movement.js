var express = require('express');
var api = express.Router();

var functionalMovementController = require('../../../controllers/functional-movement');
const {verificarToken} = require('../../../middleware/authentication');

api.post('/',[verificarToken], functionalMovementController.post);
api.get('/',[verificarToken], functionalMovementController.get);
api.get('/metadata/:id',[verificarToken], functionalMovementController.getMetadata);
api.get('/:id',[verificarToken], functionalMovementController.getById);
api.put('/:id',[verificarToken], functionalMovementController.update);
api.delete('/:id',[verificarToken], functionalMovementController.deleteById);

module.exports = api;