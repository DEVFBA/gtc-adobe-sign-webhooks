var config          = require('../dbconfig'); 
const sql           = require('mssql'); 
const logger        = require('../utils/logger');
const path          = require('path');
const fs            = require('fs');

const {
    getAdobeSignClientId, 
} = require('./cat-general-parameters');

const {
    updateInvoicePoolNextSigner
} = require('./invoices-pools');

const {
    getNextPoolASSigner,
} = require('./role-approvals');

async function getIntencionW1(clientId){
    try{
        const adobeSignClientId = await getAdobeSignClientId();
        console.log(adobeSignClientId)
        //Validate it
        if (clientId === adobeSignClientId) //Replace 'BGBQIIE7H253K6' with the client id of the application using which the webhook is created
        {
            return true;
        }
        else {
            return false;
        }
    }catch(error){
        console.log(error)
    }
}

async function escucharNotificacionesW1(request){
    try{
        const participantId = request.body.participantUserEmail;
        const agreementId = request.body.agreement.id;
        console.log(participantId)
        console.log(agreementId)

        const nextSigner = await getNextPoolASSigner(agreementId, participantId);
        console.log(nextSigner)
        if(nextSigner !== null)
        {
            const updateNextSigner = await updateInvoicePoolNextSigner(nextSigner.idInvoicePool, nextSigner.nextSigner, "IN_PROCESS");
        }
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getIntencionW1 : getIntencionW1,
    escucharNotificacionesW1 : escucharNotificacionesW1
}