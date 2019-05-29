const moongose = require('mongoose');

let Schema = moongose.Schema;

let stepFunctionalMovement = new Schema({
    step: {
        type: Number,
        required: [true, 'El numero del paso se requiere']
    },
    time: {
        type: Number,
        required: [true, 'El tiempo de toma de datos se requiere']
    },
    clasification:{
        type: Boolean,
        required: [true, 'La clasificacion del paso es requerida'] 
    },
    detailsOfStepFunctionalMovement:[ {
        type: Schema.Types.ObjectId,
        ref: 'DetailOfStepFunctionalMovement',
        required: false
    }]
});

module.exports = moongose.model('StepFunctionalMovement', stepFunctionalMovement);