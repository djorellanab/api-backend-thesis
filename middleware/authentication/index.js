const jwt = require('jsonwebtoken');
const {HttpError} = require('../../resources/error');

/**
 * Verificación del Json Web Token
 */
let verificarToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err){ 
            return next (HttpError.Forbidden);
        }
        req.usuario = decoded.usuario;
        next();
    } );
};

module.exports = {verificarToken};