const moongose = require('mongoose');

let Schema = moongose.Schema;

let detailOfStepFunctionalMovement = new Schema({
    join: {
        type: Number,
        required: [true, 'El indice de la articulacion se requiere']
    },
    angle: {
        type: Number,
        required: [true, 'El angulo de la articulacion se requiere']
    },
    x: {
        type: Number,
        required: [true, 'la distancia horizontal de la articulacion referente al kinect se requiere']
    },
    y: {
        type: Number,
        required: [true, 'la distancia vertical de la articulacion referente al kinect se requiere']
    },
});

module.exports = moongose.model('DetailOfStepFunctionalMovement', detailOfStepFunctionalMovement);