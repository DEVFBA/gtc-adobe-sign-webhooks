var config          = require('../dbconfig'); 
const sql           = require('mssql'); 
const logger        = require('../utils/logger');
const path          = require('path');
const fs            = require('fs');

const {
    getAdobeSignClientId, 
    getPoolCoverFileType,
    getGeneralFilesPath
} = require('./cat-general-parameters');

const {
    acceptInvoicePool,
    getInvoicePoolByASAgreement,
    updateInvoicePoolNextSigner
} = require('./invoices-pools');

const {
    getWorkflowFileTypePath,
} = require('./file-types');

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
        console.log(request.body);
        var invoicePool = await getInvoicePoolByASAgreement(request.body.agreement.id);

        if(invoicePool!==null)
        {
            console.log(invoicePool)
            var idInvoicePool = invoicePool.Id_Invoice_Pool
            console.log(invoicePool)

            const catRegister = {
                piIdInvoicePool: idInvoicePool,
                pvUser: "Adobe Sign",
                pvIP: "0.0.0.0",
                petitionType: "BACK"
            };

            //console.log(catRegister)

            var accept = await acceptInvoicePool(catRegister);
            //console.log(accept)

            const generalPath                   = await getGeneralFilesPath();
            const poolFileType                  = await getPoolCoverFileType();
            const filePath                      = await getWorkflowFileTypePath(poolFileType);
            var coverPath       = path.join(generalPath, filePath);
            
            var coverFullPath   = path.join(coverPath,  invoicePool.Header_PH_Path);

            if( request.body.agreement.signedDocumentInfo.document.length > 0 ) {

                try {
    
                    fs.writeFileSync(coverFullPath, request.body.agreement.signedDocumentInfo.document, 'base64');
                    
                } catch (error) {
    
                    console.log('Error al guardar Archivo PDF FIRMADO de la Carátula: ', error);
                    logger.error('Error al guardar Archivo PDF FIRMADO de la Carátula: ', error);
                    
                }
    
            }
            
            //Por último actualizamos el Next Signer a NULO
            const updateNextSigner = await updateInvoicePoolNextSigner(invoicePool.Id_Invoice_Pool, "-", "SIGNED");
            if(updateNextSigner === true)
            {
                console.log("EL NEXT SIGNER SE ACTUALIZO A NULO")
            }
            else {
                console.log("EL NEXT SIGNER NO SE ACTUALIZO A NULLO")
            }
        }
    }catch(error){
        console.log(error)
    }
}

async function getIntencionW2(clientId){
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

async function escucharNotificacionesW2(request){
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

async function getIntencionW3(clientId){
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

async function escucharNotificacionesW3(request){
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
    escucharNotificacionesW1 : escucharNotificacionesW1,
    getIntencionW2 : getIntencionW2,
    escucharNotificacionesW2 : escucharNotificacionesW2,
    getIntencionW3 : getIntencionW3,
    escucharNotificacionesW3 : escucharNotificacionesW3
}