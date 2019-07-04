'use strict'
const FunctionalMovement = require('../schemas/functional-movement');
const {HttpError} = require('../resources/error');
const {trainModel, predict} = require('../middleware/model-ia')

module.exports = {
    train: (req, res, next) =>{
        let id = req.params.id;
        FunctionalMovement
        .findById(id)
        .populate(
            {
                path: 'stepsFunctionalMovement',
                match: {
                    step: _step
                },
                populate: {
                    path: 'detailsOfStepFunctionalMovement'
                }
            })
        .exec((err, data) =>{
            if(err) {return next (HttpError.BadRequest);}
            else if (data === null){return next (HttpError.NotFound);}
            let dataset = [];
            let datasetResult = [];
            for (let x = 0; x < data.stepsFunctionalMovement.length; x++) {
                const elementStep = data.stepsFunctionalMovement[x];
                let _data = [];
                _data.push(elementStep.step);
                _data.push(elementStep.factorMovement);
                elementStep.detailsOfStepFunctionalMovement = elementStep.detailsOfStepFunctionalMovement.sort((a,b) => a.join >= b.join);
                for (let y = 0; y < elementStep.detailsOfStepFunctionalMovement.length; y++) {
                    const elementDetail = elementStep.detailsOfStepFunctionalMovement[y];
                    _data.push(elementDetail.angle);
                }
                datasetResult.push(+elementStep.clasification);
                dataset.push(_data);
            }
            trainModel(dataset,datasetResult);
            res.json({
                ok: true,
                message:"modelo entrenado"
            });
        });
    },

    predict: (req, res, next) =>{
        let body = req.body;
        FunctionalMovement.findById(body.id)
        .exec((err, data) =>{
            if(err) {return next (HttpError.BadRequest);}
            else if (data === null){return next (HttpError.NotFound);}
            let detailRepetitions =[];
            for (let index = 0; index < data.steps.length; index++) {
                detailRepetitions.push({detail:`Paso ${index+1}`,goodData:0, badData:0})
            }
            for (let index = 0; index < body.datasIa.length; index++) {
                const element = body.datasIa[index];
                let _predict = predict(body.id,element);
                if(_predict === true)
                {
                    detailRepetitions[element[0]].goodData =1 + detailRepetitions[element[0]].goodData;
                }else{
                    detailRepetitions[element[0]].badData =1 + detailRepetitions[element[0]].badData;
                }
            }
            for (let index = 0; index < data.steps.length; index++) {
                let total = detailRepetitions[index].goodData +  detailRepetitions[index].badData;
                detailRepetitions[index].goodData =  (detailRepetitions[index].goodData / total) * 100;
                detailRepetitions[index].badData = 100 - detailRepetitions[index].goodData;
            }
            res.json({
                ok: true,
                data:{detailSteps:[], detailRepetitions}
            });
        });
    }
}