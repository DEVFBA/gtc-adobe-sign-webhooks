const router = require('express').Router();
const logger = require('../Utils/logger');

const dbwebhooks = require('../controllers/webhooks')

//Verificación de la intención de la URL del webhook
router.route('/develop-1').get((request, response)=>{
    console.log(request.headers)
    var clientId = request.headers['x-adobesign-clientid'];
    
    dbwebhooks.getIntencionW1(clientId).then(result => {
        //response.json(result[0]);
        if(result === true)
        {
            var responseBody = {
                "xAdobeSignClientId" : clientId // Return Client Id in the body
            };
            response.status(200).json(responseBody);
        }
        else {
            var responseBody = {
                "xAdobeSignClientId" : "ERROR" // Return Client Id in the body
            };
            response.status(400).json(responseBody);
        }
        
    })
})

//Para notificaciones entrantes
router.route('/develop-1').post((request, response)=>{
    dbwebhooks.escucharNotificacionesW1(request).then(result => {
        var responseBody = {
            "message" : "PRUEBA" // Return Client Id in the body
        };
        response.status(200).json(responseBody);
        
    })
})

module.exports = router;