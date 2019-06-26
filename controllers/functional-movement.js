'use strict'

const {HttpError} = require('../resources/error');
const FunctionalMovement = require('../schemas/functional-movement');
const fs = require('fs');
const uuidv1 = require('uuid/v1');

module.exports = {
    post: (req, res, next) =>{
        let body = req.body;
        var date = new Date();
        let functionalMovement = new FunctionalMovement({
            name: body.name,
            description: body.description,
            steps: body.steps,
            anglesOfMovement: body.anglesOfMovement,
            movementFactor: body.movementFactor,
            height: body.height,
            depthMin: body.depthMin,
            depthMax: body.depthMax,
            time_stamp:  body.time_stamp || date.getTime(),
            focusJoin: body.focusJoin
        });
        functionalMovement.save((err, functionalMovementDB) => {
            if (err){
                return next (HttpError.BadRequest); 
            }
            res.json({
                ok: true,
                functionalMovements: [functionalMovementDB]
            }); 
        });
    },
    get: (req, res, next) =>{
        let desde = parseInt(req.query.desde) || parseInt(process.env.DESDE);
        let limite = parseInt(req.query.limite) || parseInt(process.env.LIMITE);
        let condicion = {state:true};
        FunctionalMovement.find(condicion)
            .sort({time_stamp:1})
            .limit(limite)
            .skip(desde)
            .exec((err, data) => {
                if(err){  console.log(err); return next (HttpError.BadRequest);}
                FunctionalMovement.count(condicion, (err, recordsFiltered) =>{
                    if(err){ return next (HttpError.BadRequest);}
                    res.json({
                        ok: true,
                        functionalMovements: data,
                        recordsFiltered
                    }); 
                })
            });
    },
    getById: (req, res, next) =>{
        let id = req.params.id;
        FunctionalMovement.findById(id)
        .exec((err, data) =>{
            if(err) {return next (HttpError.BadRequest);}
            else if (data === null){return next (HttpError.NotFound);}
            res.json({
                ok: true,
                functionalMovements: [data]
            }); 
        });
    },
    deleteById: (req, res, next) =>{
        let id = req.params.id;
        FunctionalMovement.findByIdAndUpdate(id, {state:false}, {new: true}, (err, data) =>{
            if(err) {return next (HttpError.BadRequest);}
            else if (data === null){return next (HttpError.NotFound);}
            FunctionalMovement.count({state:true}, (err, recordsFiltered) =>{
                if(err){ return next (HttpError.BadRequest);}
                res.json({
                    ok: true,
                    functionalMovements: [data],
                    recordsFiltered
                }); 
            })
        });
    },
    update:  (req, res, next) =>{
        let id = req.params.id;
        let body = req.body;

        FunctionalMovement.findByIdAndUpdate(id, body,  (err, data) =>{
            if(err) {return next (HttpError.BadRequest);}
            else if (data === null){return next (HttpError.NotFound);}
            res.json({
                ok: true,
                functionalMovements: [data]
            }); 
        });
    },
    getMetadata:  (req, res, next) =>{
        let id = req.params.id;
        FunctionalMovement.findById(id)
        .exec((err, data) =>{
            if(err) {return next (HttpError.BadRequest);}
            else if (data === null){return next (HttpError.NotFound);}
            var filename = `${uuidv1()}.json`;
            let absolutePath  =`${__dirname}\\${filename}`;
            fs.writeFile(absolutePath, JSON.stringify(data) ,{flag: 'w'}, function (err) {
                if(err) {return next (HttpError.BadRequest);}
                let _file = fs.createReadStream(absolutePath);
                var stat = fs.statSync(absolutePath);
                let _name = data.name.trim();
                _name = _name.replace(/\s+/g, '-');
                res.setHeader('Content-Length', stat.size);
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Content-Disposition', `attachment; filename=${_name}.json`);
                _file.pipe(res);
                fs.unlink(`${__dirname}\\${filename}`,(err)=>{
                    if(err) console.log(err);});
            }); 
        });
    }
}