const moongose = require('mongoose');

let Schema = moongose.Schema;

let functionalMovement = new Schema({
    name: {
        type: String,
        required: [true, 'Nombre del movimiento funcional es necesario']
    },
    description: {
        type: String,
        required: [true, 'La descripcion es necesario']
    },
    steps:[{
        type: Number,
        required: [true, 'Es necesario definir los pasos del movimiento funcional'] 
    }],
    anglesOfMovement:[{
        type: Number,
        required: [true, 'Es necesario definir los angulos del movimiento funcional'] 
    }],
    movementFactor: {
        type: Number,
        default: 0.1
    }, 
    height : {
        type: Number,
        required: [true, 'La altura del kinect del suelo'] 
    }, 
    depthMin : {
        type: Number,
        required: [true, 'La profundidad minima del kinect del suelo'] 
    }, 
    depthMax : {
        type: Number,
        required: [true, 'La profundidad maxima del kinect del suelo'] 
    }, 
    time_stamp : {
        type: Number,
        required: [true, 'Fecha de insercion es necesaria'] 
    }, 
    state : {
        type: Boolean,
        default: true
    }, 
    focusJoin  : {
        type: Number,
        required: [true, 'centro de analisis es necesario'] 
    }, 
    file: {
        type: Schema.Types.ObjectId,
        ref: 'File',
        required: false
    },
    stepsFunctionalMovement:[ {
        type: Schema.Types.ObjectId,
        ref: 'StepFunctionalMovement',
        required: false
    }]
});

module.exports = moongose.model('FunctionalMovement', functionalMovement);