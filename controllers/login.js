'use strict'

const {HttpError} = require('../resources/error');
const jwt = require('jsonwebtoken');

module.exports = {
    post: (req, res, next) =>{
        let body = req.body;
        if ( (body.username === process.env.ADMINUSER) && (body.password === process.env.ADMINPASSWORD) ){
            let token = jwt.sign({
                usuario: body
            }, process.env.SEED, {
                expiresIn: process.env.CADUCIDAD_TOKEN
            });
            body.token = token;
            res.json({
                ok: true,
                usuario:body
            });
        } else {
            return next (HttpError.Unauthorized); 
        }
    }
}