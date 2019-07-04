const moongose = require('mongoose');

let Schema = moongose.Schema;

let stepOrderFunctionalMovement = new Schema({
    step: {
        type: Number,
        required: [true, 'El numero del paso se requiere']
    },
    stepsGoodFunctionalMovement:[ {
        type: Schema.Types.ObjectId,
        ref: 'StepFunctionalMovement',
        required: false
    }],
    stepsBadFunctionalMovement:[ {
        type: Schema.Types.ObjectId,
        ref: 'StepFunctionalMovement',
        required: false
    }]
});

module.exports = moongose.model('StepOrderFunctionalMovement', stepOrderFunctionalMovement);