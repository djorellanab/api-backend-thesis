const jwt = require('jsonwebtoken');
const {HttpError} = require('../../resources/error');

/**
 * Verificación del Json Web Token
 */
let verificarToken = (req, res, next) => {
    let token = req.get('Authorization');
    let vector =token.split(' ');
    if(vector.length !== 2){
        return next (HttpError.Forbidden);
    }
    else if (vector[0] !== "Bearer"){
        return next (HttpError.Forbidden);
    }
    jwt.verify(vector[1], process.env.SEED, (err, decoded) => {
        if(err){ 
            return next (HttpError.Forbidden);
        }
        req.usuario = decoded.usuario;
        next();
    } );
};

module.exports = {verificarToken};