var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

// Objeto global de la app
var app = express();

// Para el logger
const logger = require('./Utils/logger');

// configuración de middlewares
app.use(bodyParser.urlencoded({ 
    limit: '50mb',
    extended: true
 }));
 
app.use(bodyParser.json({
    limit: '50mb', 
    extended: true
}));

/*app.use(cors({
    origin: ['http://cartaporte.itwpolymex.com/', 'http://142.44.240.116/']
}));*/

app.use(cors({origin: '*'}));

// Agregamos el código de nuestro router (routes/index.js)
app.use('/webhooks-api', require('./routes'));

// Manejando los errores 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    logger.error(`404 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    next(err);
});

// Manejando los errores 500
app.use(function (err,req,res,next) {
    logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
})

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://itwpolymex-servicios.com/');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

process.on('unhandledRejection', (reason, p) => {
    logger.error("Unhandled Rejection at: " +  p + " reason: " + reason);
    console.log('Unhandled Rejection at: ', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

var port = process.env.PORT || 8093;
app.listen(port);
logger.info("Categoría API iniciando en el puerto: " + port)
console.log("Categoría API iniciando en el puerto: " + port);