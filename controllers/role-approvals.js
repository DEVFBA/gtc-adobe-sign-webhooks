var config = require('../dbconfig'); 
const sql = require('mssql'); 

const logger = require('../utils/logger');

const {
    getInvoicePoolByASAgreement
} = require('./invoices-pools');

const {
    getUserRole,
    getUserByEmail
} = require('./security-users');

async function getApproversByIdRole(idRole) {

    try {

        const pool = await sql.connect(config);

        const approversData = await pool.request()
            .input('pvOptionCRUD', sql.VarChar(5), 'R')
            .input('pvIdRole', sql.VarChar(10), idRole)
            .execute('spRole_Approvals_CRUD_Records');

        const approvers = approversData.recordsets[0];

        return approvers;
        
    } catch (error) {

        console.log('Error en getApproversByIdRole: ', error);
        logger.error('Error en getApproversByIdRole: ', error);

    }

}

async function getNextPoolASSigner( agreementId, email ) {

    try {

        logger.info('Resolviendo el Siguiete aprobador del Agreement Id ' + agreementId);
        logger.info('Último correo firmante: ' + email);

        /**
         * * Retrieve Invoice Pool Information
         */
        const invoicePoolData   = await getInvoicePoolByASAgreement( agreementId );

        if( !invoicePoolData ) {

            return null;

        }

        const poolGenerator     = invoicePoolData.Header_PH_Generated_By;
        const invoicePoolId     = invoicePoolData.Id_Invoice_Pool;

        logger.info('Generador del Pool: ' + poolGenerator);

        const generatorRole     = await getUserRole(poolGenerator);

        logger.info('Rol del Generador: ' + generatorRole);

        const approvers         = await getApproversByIdRole(generatorRole);

        logger.info('Aprobadores del Pool: ' + JSON.stringify(approvers));

        let signers = approvers.filter((approver) => {

            return approver.Apply_Sign === true;

        });

        signers = signers.sort(function (a, b) {
            if (a.Order_Sign > b.Order_Sign) {
              return 1;
            }
            if (a.Order_Sign < b.Order_Sign) {
              return -1;
            }
            // a must be equal to b
            return 0;
        });

        const user = await getUserByEmail(email);
        
        const currentSignerIndex = signers.map((signer) => { return signer.User; }).indexOf(user);

        const nextSigner = signers[currentSignerIndex + 1].User;

        if( !nextSigner ) {
            
            logger.info('No existen más firmantes después de ' + user);
            
            return null;

        }

        logger.info('El siguiente firmante es: ' + nextSigner + ' para el Invoice Pool No. ' + invoicePoolId);

        const result = {
            idInvoicePool: invoicePoolId,
            nextSigner: nextSigner
        }

        return result;
        
    } catch (error) {
        
        logger.error('ERR: Error en getNextPoolASSigner: ' + error);

        return null;

    }

}

module.exports = {
    getApproversByIdRole : getApproversByIdRole,
    getNextPoolASSigner : getNextPoolASSigner
}