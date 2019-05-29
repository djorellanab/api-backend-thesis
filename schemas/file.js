const moongose = require('mongoose');

let Schema = moongose.Schema;

let file = new Schema({
    name: {
        type: String,
        required: [true, 'Nombre del archivo es requerido']
    },
    guid: {
        type: String,
        required: [true, 'guid del archivo es requerido']
    },
    extension: {
        type: String,
        required: [true, 'La extension del archivo es requerido']
    },
    path: {
        type: String,
        required: [true, 'el path del archivo es requerido']
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

module.exports = moongose.model('File', file);