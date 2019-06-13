'use strict'

const { HttpError } = require('../resources/error');
const { FunctionalMovement } = require('../schemas/functional-movement');
const { DetailOfStepFunctionalMovement } = require('../schemas/detail-of-step-functional-movement');
const { StepFunctionalMovement } = require('../schemas/step-functional-movement');
const mongoose = require('mongoose');

module.exports = {
    post:  (req, res, next) => {
        try {
            let body = req.body;
            body.forEach(function (el) {
                let detailsOfStepFunctionalMovement = [];
                el.detailsOfStepFunctionalMovement.forEach(function (detail) {
                    let detailOfStepFunctionalMovement = new DetailOfStepFunctionalMovement({
                        join: detail.join,
                        angle: detail.angle,
                        x: detail.x,
                        y: detail.y
                    });
                    let _detail =  detailOfStepFunctionalMovement.save();
                    detailsOfStepFunctionalMovement.push(_detail._id);
                });
                let stepFunctionalMovement = new StepFunctionalMovement({
                    step: el.step,
                    time: el.time,
                    clasification: el.clasification,
                    detailsOfStepFunctionalMovement
                });
                let _step =  stepFunctionalMovement.save();

                let fm =  FunctionalMovement.db.collection.update(
                    { "_id": mongoose.Types.ObjectId(body.functionalMovement) },
                    {
                        "$push": {
                            "stepsFunctionalMovement": _step._id
                        }
                    });
            });
            res.json({
                ok: true,
                functionalMovements: []
            });
        } catch (error) {
            return next(HttpError.BadRequest);
        }
    },
    getTotalsByStep: (req, res, next) => {
        let id = req.params.id;
        FunctionalMovement.findById(id)
            .populate({ path: 'stepsFunctionalMovement', select: 'step' })
            .exec((err, data) => {
                if (err) { return next(HttpError.BadRequest); }
                else if (data === null) { return next(HttpError.NotFound); }
                let countSteps = data.steps.length;
                let steps = [];
                let total = 0;
                for (let i = 0; i < countSteps; i++) {
                    let count = data.stepsFunctionalMovement.filter(x => x === i);
                    total += count;
                    steps.push({ step: i + 1, count });
                }
                steps.push({ step: "Total de datos", total })
                res.json({
                    ok: true,
                    name: data.name,
                    steps
                });
            });
    }
}