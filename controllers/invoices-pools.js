const config                = require('../dbconfig'); 
const sql                   = require('mssql'); 

const {
    getApprovePoolWFTracker,
    getCierreFlujoAdobeSign,
    getApprovePoolInvoiceWFTracker,
} = require('./cat-general-parameters');

const {
    getInvoiceId
} = require('./invoices');

const {
    getWFTrackerByIdWF
} = require('./workflow-tracker');

const {
    insertWorkflow
} = require('./workflow');

const {
    execStoredProcedure
} = require('../Utils/mssql-database');

const logger = require('../utils/logger');

async function getInvoicePoolByASAgreement(agreementId) {

    try {

        const sqlParams = [
            {
                name: 'pvOptionCRUD',
                type: sql.VarChar(1),
                value: 'R'
            },
            {
                name: 'pvAgreementId',
                type: sql.VarChar(500),
                value: agreementId
            }
        ]

        const spExecutionResponse = await execStoredProcedure( 'spInvoices_Pools_CRUD_Records', sqlParams );

        const invoicePoolRecord = spExecutionResponse[0];

        const invoicePoolRecordLength = invoicePoolRecord.length;

        if( invoicePoolRecordLength === 0 ) {

            logger.info('No se encontró un Pool de Facturas para el Agreement ID: ' + agreementId);

            return null;

        } else {

            logger.info('Pool Encontrado para el Agreement ID ' + agreementId);

            return invoicePoolRecord[0];

        }
        
    } catch (error) {

        logger.error('ERR: Error en getInvoicePoolByASAgreement' + error);

        return null;
        
    }

}

async function getInvoicePoolById(poolNumber){
    try{
        let pool = await sql.connect(config);
        let users = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('piIdInvoicePool', sql.Int, poolNumber)
            .execute('spInvoices_Pools_CRUD_Records')
        return users.recordsets
    }catch(error){
        console.log(error)
    }
}

async function acceptInvoicePool(req) {

    let response = {
        data: {
            success: 0,
            message: '',
            invoices: []
        }
    }

    try {

        var invoices = await getInvoicePoolById(req.piIdInvoicePool)
        var acceptWFTracker;
        var worflowInfo;
        if(req.petitionType === "FRONT")
        {
            acceptWFTracker = await getApprovePoolWFTracker();
            worflowInfo = await getWFTrackerByIdWF(acceptWFTracker)
        }
        else {
            acceptWFTracker = await getCierreFlujoAdobeSign();
            worflowInfo = await getWFTrackerByIdWF(acceptWFTracker)
        }

        var registerPool = {
            pvIdWorkflowType: worflowInfo.Id_Workflow_Type,
            piIdWorkflowStatus: worflowInfo.Id_Workflow_Status,
            piIdWorkflowStatusChange: worflowInfo.Id_Workflow_Status_Change,
            pvRecordIdentifier: req.piIdInvoicePool.toString(),
            pvComments: req.pvComments,
            pvUser: req.pvUser,
            pvIP: req.pvIP
        }

        console.log("REGISTER POOL")
        console.log(registerPool)

        var workflowPool = await insertWorkflow(registerPool)
        if(workflowPool[0][0].Code_Type === "Warning" || workflowPool[0][0].Code_Type === "Error")
        {
            response.data.success = 0;
            response.data.message = "Error al cambiar el Workflow Pool";
            return response;
        }
        else 
        {
            var approveInvoiceWFTracker = await getApprovePoolInvoiceWFTracker();
            var worflowInvoiceInfo = await getWFTrackerByIdWF(approveInvoiceWFTracker)

            //Bandera para saber si alguno falló
            var flagInvoices = 0
            for(var i=0; i<invoices[0].length; i++)
            {
                const invoiceData = await getInvoiceId(invoices[0][i].UUID)
                const invoiceWFType = invoiceData[0][0].Id_Workflow_Type

                var register = {
                    pvIdWorkflowType: invoiceWFType,
                    piIdWorkflowStatus: worflowInvoiceInfo.Id_Workflow_Status,
                    piIdWorkflowStatusChange: worflowInvoiceInfo.Id_Workflow_Status_Change,
                    pvRecordIdentifier: invoices[0][i].UUID,
                    pvComments: req.pvComments,
                    pvUser: req.pvUser,
                    pvIP: req.pvIP
                }

                var workflow = await insertWorkflow(register)
                if(workflow[0][0].Code_Type === "Warning" || workflow[0][0].Code_Type === "Error")
                {
                    response.data.invoices[i] = {
                        status: 0,
                        uuid: invoices[0][i].UUID,
                        message: workflow[0][0].Code_Message_User
                    }
                }
                else {
                    response.data.invoices[i] = {
                        status: 1,
                        uuid: invoices[0][i].UUID,
                        message: workflow[0][0].Code_Message_User
                    }
                }
            }

            if(flagInvoices>0)
            {
                //Significa que alguno falló
                response.data.success = 0;
                response.data.message = "Error al cambiar el estatus en alguna factura."
            }
            else {
                response.data.success = 1;
                response.data.message = "Pool aceptado con éxito."
            }

            return response
        }
       
        

    } catch (error) {
        console.log('Error en acceptInvoicePool: ', error);
        logger.error('Error en acceptInvoicePool: ', error);

        response.data.success = 0;
        response.data.message = 'Error interno al aceptar el pool. Revisa el log';
        
        return response;
        
    }

}

async function updateInvoicePoolNextSigner(idInvoicePool, nextSigner, idAgreementStatus)
{
    try {

        const sqlParams = [
            {
                name: 'pvOptionCRUD',
                type: sql.VarChar(1),
                value: 'U'
            },
            {
                name: 'piIdInvoicePool',
                type: sql.Int,
                value: idInvoicePool
            },
            {
                name: 'pvNextSigner',
                type: sql.VarChar,
                value: nextSigner
            },
            {
                name: 'pvIdAgreementStatus',
                type: sql.VarChar,
                value: idAgreementStatus
            }
        ]

        const spExecutionResponse = await execStoredProcedure( 'spInvoices_Pools_CRUD_Records', sqlParams );

        const invoicePoolRecord = spExecutionResponse[0];
        console.log(invoicePoolRecord)

        if( invoicePoolRecord[0].Code_Successful !== true ) {

            logger.info('No se pudo actualizar el next signer para el pool: ' + idInvoicePool);

            return false;

        } else {

            logger.info('Next Signer actualizado para el pool: ' + idInvoicePool);

            return true;

        }
        
    } catch (error) {

        logger.error('ERR: Error en updateInvoicePoolNextSigner' + error);

        return null;
        
    }
}

module.exports = {
    getInvoicePoolByASAgreement : getInvoicePoolByASAgreement,
    acceptInvoicePool : acceptInvoicePool,
    updateInvoicePoolNextSigner : updateInvoicePoolNextSigner
}