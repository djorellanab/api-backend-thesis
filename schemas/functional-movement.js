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
    gdb: {
        type: String,
        default: ""
    }, 
    height : {
        type: Number,
        required: [true, 'La altura del kinect del suelo'] 
    }, 
    depth : {
        type: Number,
        required: [true, 'La profundidad del kinect del suelo'] 
    }, 
    time_stamp : {
        type: Number,
        required: [true, 'Fecha de insercion es necesaria'] 
    }, 
    time_stamp_hour : {
        type: Number,
        required: [true, 'Hora de insercion es necesaria'] 
    }, 
    state : {
        type: Boolean,
        default: true
    }, 
});

module.exports = moongose.model('FunctionalMovement', functionalMovement);