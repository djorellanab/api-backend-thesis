'use strict'

const { HttpError } = require('../resources/error');
const FunctionalMovement = require('../schemas/functional-movement');
const DetailOfStepFunctionalMovement = require('../schemas/detail-of-step-functional-movement');
const StepFunctionalMovement = require('../schemas/step-functional-movement');
const mongoose = require('mongoose');
const fs = require('fs');
const uuidv1 = require('uuid/v1');

module.exports = {
    post: async function(req, res, next){
        let body = req.body;
        try {
            let values = [];
            for (let index = 0; index < body.stepFunctionalMovement.length; index++) {
                const el = body.stepFunctionalMovement[index];
                let detailsOfStepFunctionalMovement = [];
                for (let index2 = 0; index2 < el.detailsOfStepFunctionalMovement.length; index2++) {
                    const detail = el.detailsOfStepFunctionalMovement[index2];
                    let detailOfStepFunctionalMovement = new DetailOfStepFunctionalMovement({
                        join: detail.join,
                        angle: detail.angle,
                        x: detail.x,
                        y: detail.y
                    });
                    let _detail = await detailOfStepFunctionalMovement.save();
                    detailsOfStepFunctionalMovement.push(_detail._id);
                }
                let stepFunctionalMovement = new StepFunctionalMovement({
                    step: el.step,
                    time: el.time,
                    clasification: el.clasification,
                    factorMovement: el.factorMovement,
                    detailsOfStepFunctionalMovement
                });
                let _s = await stepFunctionalMovement.save();
                values.push(_s._id);
            }
            FunctionalMovement.update(
                { _id: body.functionalMovement },
                { $push: 
                    { 
                        stepsFunctionalMovement: 
                        {
                            $each: values
                        }
                    }
                },(err, data) =>{
                    if (err) { return next(HttpError.BadRequest); }
                    else if (data === null) { return next(HttpError.NotFound); }
                    res.json({
                        ok: true,
                        functionalMovements: []
                    });
                });   
        } catch (_error2) {
            return next(HttpError.BadRequest);
        }
    },
    getTotalsByStep: async (req, res, next) => {
        let id = req.params.id;
        let _clasification = req.query.clasification == "true";
        let _step = +req.query.step || 0;
        try {
            let data = await FunctionalMovement
            .findById(id)
            .populate(
                {
                    path: 'stepsFunctionalMovement',
                    match: {
                        step: _step,
                        clasification: true
                    },
                    populate: {
                        path: 'detailsOfStepFunctionalMovement'
                    }
                })
            .exec();
            if (data === null) { return next(HttpError.NotFound); }
            let steps = data.steps.map((e, i)=>{
                return { step: i, selected: _step === i}
            })
            let hasData = data.stepsFunctionalMovement.length > 0;
            let joints = [];
            for (let x = 0; x <  data.anglesOfMovement.length; x++) {
                const element = data.anglesOfMovement[x];
                joints[element] = {
                    joint: element,
                    metadata: [
                        {
                            avg: 0,
                            max: Number.MIN_VALUE,
                            min: Number.MAX_VALUE,
                            total: 0
                        }
                    ],
                    points: []
                };
            }
            for (let x = 0; x < data.stepsFunctionalMovement.length; x++) {
                const elementStep = data.stepsFunctionalMovement[x];
                for (let y = 0; y < elementStep.detailsOfStepFunctionalMovement.length; y++) {
                    const elementDetail = elementStep.detailsOfStepFunctionalMovement[y];
                    joints[elementDetail.join].points.push({ x: elementStep.factorMovement, y: elementDetail.angle });
                    joints[elementDetail.join].metadata[0].avg += elementDetail.angle;
                    joints[elementDetail.join].metadata[0].max = (joints[elementDetail.join].metadata[0].max < elementDetail.angle) ? elementDetail.angle : joints[elementDetail.join].metadata[0].max;
                    joints[elementDetail.join].metadata[0].min = (elementDetail.angle < joints[elementDetail.join].metadata[0].min) ? elementDetail.angle : joints[elementDetail.join].metadata[0].min;
                    joints[elementDetail.join].metadata[0].total += 1;
                }
            }
            for (let x = 0; x < data.anglesOfMovement.length; x++) {
                const _angle = data.anglesOfMovement[x];
                const element = joints[_angle];
                element.metadata[0].avg = (element.metadata[0].total < 1) ? Number.MIN_VALUE : element.metadata[0].avg / element.metadata[0].total;
                element.metadata[0].max = (element.metadata[0].total < 1) ? "sin minimo" : element.metadata[0].max;
                element.metadata[0].min = (element.metadata[0].total < 1) ? "sin maximo" : element.metadata[0].min;
            }
            if (_clasification === true) {
                joints = joints.filter(x => x !== null);
                res.json({
                    ok: true,
                    name: data.name,
                    hasData,
                    joints,
                    steps,
                    headers: ['distribucion de datos buenos'],
                    anglesOfMovement: data.anglesOfMovement,
                });
            }
            else{
                data = await FunctionalMovement
                .findById(id)
                .populate(
                    {
                        path: 'stepsFunctionalMovement',
                        match: {
                            step: _step,
                            clasification: false
                        },
                        populate: {
                            path: 'detailsOfStepFunctionalMovement'
                        }
                    })
                .exec();
                if (data === null) { return next(HttpError.NotFound); }
                let joints2 = [];
                let hasData2 = data.stepsFunctionalMovement.length > 0;
                for (let x = 0; x <  data.anglesOfMovement.length; x++) {
                    const element = data.anglesOfMovement[x];
                    joints2[element] = {
                        joint: element,
                        metadata: [
                            {
                                avg: 0,
                                max: Number.MIN_VALUE,
                                min: Number.MAX_VALUE,
                                total: 0
                            }
                        ],
                        points: []
                    };
                    if(hasData === true){
                        joints2[element].metadata.push({
                            avg: 0,
                            max: Number.MIN_VALUE,
                            min: Number.MAX_VALUE,
                            total: 0
                        });
                    }
                }

                for (let x = 0; x < data.stepsFunctionalMovement.length; x++) {
                    const elementStep = data.stepsFunctionalMovement[x];
                    for (let y = 0; y < elementStep.detailsOfStepFunctionalMovement.length; y++) {
                        const elementDetail = elementStep.detailsOfStepFunctionalMovement[y];
                        let indexDecision = ((joints[elementDetail.join].metadata[0].avg < elementDetail.angle)
                         && (hasData ===true)) ? 1 : 0;
                         joints2[elementDetail.join].points.push({ x: elementStep.factorMovement, y: elementDetail.angle });
                         joints2[elementDetail.join].metadata[indexDecision].avg += elementDetail.angle;
                         joints2[elementDetail.join].metadata[indexDecision].max = (joints2[elementDetail.join].metadata[indexDecision].max < elementDetail.angle) ? elementDetail.angle : joints2[elementDetail.join].metadata[indexDecision].max;
                         joints2[elementDetail.join].metadata[indexDecision].min = (elementDetail.angle < joints2[elementDetail.join].metadata[indexDecision].min) ? elementDetail.angle : joints2[elementDetail.join].metadata[indexDecision].min;
                         joints2[elementDetail.join].metadata[indexDecision].total += 1;
                    }
                }

                for (let x = 0; x <  data.anglesOfMovement.length; x++) {
                    const elemAngle = data.anglesOfMovement[x];
                    const element1 = joints2[elemAngle];
                    for (let y = 0; y < element1.metadata.length; y++) {
                        const element2 = element1.metadata[y];  
                        element2.avg = (element2.total < 1) ? "sin promedio" : element2.avg / element2.total;
                        element2.max = (element2.total < 1) ? "sin minimo" : element2.max;
                        element2.min = (element2.total < 1) ? "sin maximo" : element2.min;
                    }
                }
                let header2 = [];
                joints2 = joints2.filter(x => x !== null);
                if (hasData === true) {
                    header2.push('distribucion de datos malos inferiores');
                    header2.push('distribucion de datos malos superiores');
                }else{
                    header2.push('distribucion de datos malos');
                }

                res.json({
                    ok: true,
                    name: data.name,
                    hasData: hasData2,
                    joints: joints2,
                    steps,
                    headers: header2,
                    anglesOfMovement: data.anglesOfMovement,
                });
            }

        } catch (error) {
            console.log(error);
            return next(HttpError.BadRequest);
        }
    },
    getCSV: (req, res, next) => {
        let id = req.params.id;
        FunctionalMovement
            .findById(id)
            .populate(
                {
                    path: 'stepsFunctionalMovement',
                    populate: {
                        path: 'detailsOfStepFunctionalMovement'
                    }
                })
            .exec((err, data) => {
                if (err) { return next(HttpError.BadRequest); }
                else if (data === null) { return next(HttpError.NotFound); }
                let matriz = "step, factorMovement, join, angle, clasification\r\n";
                for (let x = 0; x < data.stepsFunctionalMovement.length; x++) {
                    const elementStep = data.stepsFunctionalMovement[x];
                    for (let y = 0; y < elementStep.detailsOfStepFunctionalMovement.length; y++) {
                        const elementDetail = elementStep.detailsOfStepFunctionalMovement[y];
                        matriz += `${elementStep.step}, ${elementStep.factorMovement}, ${elementDetail.join}, ${elementDetail.angle}, ${elementStep.clasification}\r\n`;
                    }
                }
                var filename = `${uuidv1()}.csv`;
                let absolutePath = `${__dirname}\\${filename}`;
                fs.writeFile(absolutePath, matriz, { flag: 'w' }, function (err) {
                    if (err) { return next(HttpError.BadRequest); }
                    let _file = fs.createReadStream(absolutePath);
                    var stat = fs.statSync(absolutePath);
                    let _name = data.name.trim();
                    _name = _name.replace(/\s+/g, '-');
                    res.setHeader('Content-Length', stat.size);
                    res.setHeader('Content-Type', 'text/csv');
                    res.setHeader('Content-Disposition', `attachment; filename=${_name}.csv`);
                    _file.pipe(res);
                    fs.unlink(absolutePath, (err) => {
                        if (err) console.log(err);
                    });
                });
            });
    }
}