const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {HttpError} =require('./resources/error');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Disposition');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
      return res.send(200);
    } else {
      return next();
    }
});

app.use(require('./routes'));

app.use(function(req, res, next) {
    if (!req.route){
        return next (HttpError.BadRequest);  
    }
    next();
});

app.use(function(err, req, res, next) {
    err.status  = err.status || 500;
    if(err.status === 500){
        res.status(err.status).send('Something broke!');
    } else {
        res.status(err.status).send(err.message);
    }
  });


app.listen( process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
});