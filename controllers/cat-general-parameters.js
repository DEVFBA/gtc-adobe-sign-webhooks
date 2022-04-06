var config          = require('../dbconfig'); 
const sql           = require('mssql'); 

const logger        = require('../utils/logger');

const {
    execStoredProcedure
} = require('../Utils/mssql-database');

async function getGeneralParameters(params){
    try{
        let pool = await sql.connect(config);
        let generalParameters = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .execute('spCat_General_Parameters_CRUD_Records')
        return generalParameters.recordsets
    }catch(error){
        console.log(error)
    }
}

//Actualizar un registro de los usuarios (solo la contraseña)
async function updateGeneralParameter(register){
    console.log("ENTRE")
    try{
        let pool = await sql.connect(config);
        let updateRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('piIdParameter', sql.Int, register.piIdParameter)
            .input('pvLongDesc', sql.VarChar, register.pvLongDesc)
            .input('pvValue', sql.VarChar, register.pvValue)
            .input('pvUser', sql.VarChar, register.pvUser)
            .input('pvIP', sql.VarChar, register.pvIP)
            .execute('spCat_General_Parameters_CRUD_Records')
        console.log(JSON.stringify(updateRegister.recordsets[0][0])); 
        return updateRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

async function getGeneralParametersGrouper(params){
    try{
        let pool = await sql.connect(config);
        let generalParameters = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('pvidGrouper', sql.VarChar, params.pvidGrouper)
            .execute('spCat_General_Parameters_CRUD_Records')
        return generalParameters.recordsets
    }catch(error){
        console.log(error)
    }
}


async function getParameterById(parameterId) {

    try {

        const sqlParams = [
            {
                name: 'pvOptionCRUD',
                type: sql.VarChar(1),
                value: 'R'
            },
            {
                name: 'piIdParameter',
                type: sql.Int,
                value: parameterId
            }
        ];

        const parameterRecord = await execStoredProcedure('spCat_General_Parameters_CRUD_Records', sqlParams);
        
        return parameterRecord[0][0];

    } catch (error) {
        
        logger.error('ERRO: Function getParameterById: ' + JSON.stringify(error));

    }

}

async function getXMLInvoicesPath() {

    try {

        const record = await getParameterById(8);

        const XMLInvoicesPath = record.Value;
        
        return XMLInvoicesPath;

    } catch (error) {
        
        logger.error('Function getXMLInvoicesPath: ', error);

    }

}

async function getXMLInvoicesURLPath() {

    try {

        const record = await getParameterById(9);

        const XMLInvoicesURLPath = record.Value;
        
        return XMLInvoicesURLPath;

    } catch (error) {
        
        logger.error('Function getXMLInvoicesURLPath: ', error);

    }

}

async function getPDFInvoicesPath() {

    try {

        const record = await getParameterById(10);

        const PDFInvoicesPath = record.Value;
        
        return PDFInvoicesPath;

    } catch (error) {
        
        logger.error('Function getPDFInvoicesPath: ', error);

    }

}

async function getCPorteRequestsPath() {

    try {

        const record = await getParameterById(16);

        const cPorteRequestsPath = record.Value;
        
        return cPorteRequestsPath;

    } catch (error) {
        
        logger.error('Function getCPorteRequestsPath: ', error);

    }

}

async function getCPorteRequestsURLPath() {

    try {

        const record = await getParameterById(17);

        const cPorteRequestsURLPath = record.Value;
        
        return cPorteRequestsURLPath;

    } catch (error) {
        
        logger.error('Function getCPorteRequestsURLPath: ', error);

    }

}

async function getSecretJWTExternalAppl() {

    try {

        const record = await getParameterById(18);

        const secret = record.Value;
        
        return secret;

    } catch (error) {
        
        logger.error('Function getSecretJWTExternalAppl: ', error);

    }

}

async function getExpirationJWTExternalAppl() {

    try {

        const record = await getParameterById(19);

        const expiration = record.Value;
        
        return expiration;

    } catch (error) {
        
        console.log(error);
        logger.error('Function getExpirationJWTExternalAppl: ', error);

    }

}

async function getcPorteFileLoadWFTracker() {

    try {

        const record = await getParameterById(20);

        const cPorteFileLoadWFTracker = record.Value;
        
        return cPorteFileLoadWFTracker;

    } catch (error) {
        
        logger.error('Function getcPorteFileLoadWFTracker: ', error);

    }

}

async function getcPorteShipmentApprovalWFTracker() {

    try {

        const record = await getParameterById(21);

        const cPorteShipmentApprovalWFTracker = record.Value;
        
        return cPorteShipmentApprovalWFTracker;

    } catch (error) {
        
        logger.error('Function getcPorteShipmentApprovalWFTracker: ', error);

    }

}

async function getcPorteShipmentRejectionWFTracker() {

    try {

        const record = await getParameterById(22);

        const cPorteShipmentRejectionWFTracker = record.Value;
        
        return cPorteShipmentRejectionWFTracker;

    } catch (error) {
        
        logger.error('Function getcPorteShipmentRejectionWFTracker: ', error);

    }

}

async function getVendorEvidencesLoadedWFTracker() {

    try {

        const record = await getParameterById(24);

        const vendorEvidencesLoadedWFTracker = record.Value;
        
        return vendorEvidencesLoadedWFTracker;

    } catch (error) {
        
        logger.error('Function getVendorEvidencesLoadedWFTracker: ', error);

    }
}

async function getGeneralFilesPath() {

    try {

        const record = await getParameterById(25);

        const generalFilesPath = record.Value;
        
        return generalFilesPath;

    } catch (error) {
        
        logger.error('Function getGeneralFilesPath: ', error);

    }
}

async function getGeneralFilesURLPath() {

    try {

        const record = await getParameterById(26);

        const generalFilesURLPath = record.Value;
        
        return generalFilesURLPath;

    } catch (error) {
        
        logger.error('Function getGeneralFilesURLPath: ', error);

    }
}

async function getLoadedEvidencesStatus() {

    try {

        const record = await getParameterById(27);

        const loadedEvidencesStatus = record.Value;
        
        return loadedEvidencesStatus;

    } catch (error) {
        
        logger.error('Function getLoadedEvidencesStatus: ', error);

    }
}

async function getcPortePoolGenerationWFTracker() {

    try {

        const record = await getParameterById(28);

        const cPortePoolGenerationWFTracker = record.Value;
        
        return cPortePoolGenerationWFTracker;

    } catch (error) {
        
        logger.error('Function getcPortePoolGenerationWFTracker: ', error);

    }
}

async function getcPorteEvidencesRejectionWFTracker() {

    try {

        const record = await getParameterById(29);

        const cPorteEvidencesRejectionWFTracker = record.Value;
        
        return cPorteEvidencesRejectionWFTracker;

    } catch (error) {
        
        logger.error('Function getcPorteEvidencesRejectionWFTracker: ', error);

    }

}

async function getPoolCoverComplementFilePrefix() {

    try {

        const record = await getParameterById(30);

        const poolCoverComplementFilePrefix = record.Value;
        
        return poolCoverComplementFilePrefix;

    } catch (error) {
        
        logger.error('Function getPoolCoverComplementFilePrefix: ', error);

    }

}

async function getPoolCoverFileType() {

    try {

        const record = await getParameterById(31);

        const poolCoverFileType = record.Value;
        
        return poolCoverFileType;

    } catch (error) {
        
        logger.error('Function getPoolCoverFileType: ', error);

    }

}

async function getPoolsWorkFlowType() {

    try {

        const record = await getParameterById(33);

        const poolsWorkFlowType = record.Value;
        
        return poolsWorkFlowType;

    } catch (error) {
        
        logger.error('Function getPoolsWorkFlowType: ', error);

    }

}

async function getPoolsWorkFlowInitialTracker() {

    try {

        const record = await getParameterById(34);

        const poolsWorkFlowInitialTracker = record.Value;
        
        return poolsWorkFlowInitialTracker;

    } catch (error) {
        
        logger.error('Function getPoolsWorkFlowInitialTracker: ', error);

    }

}

async function getPoolCoverLogo() {

    try {

        const record = await getParameterById(35);

        const poolCoverLogo = record.Value;
        
        return poolCoverLogo;

    } catch (error) {
        
        logger.error('Function getPoolCoverLogo: ', error);

    }

}

async function getInterfacedAccountsPayableFilesPath() {

    try {

        const record = await getParameterById(36);

        const interfacedAccountsPayableFilesPath = record.Value;
        
        return interfacedAccountsPayableFilesPath;

    } catch (error) {
        
        logger.error('Function getInterfacedAccountsPayableFilesPath: ', error);

    }

}

async function getReceivedAccountsPayableFilesPath() {

    try {

        const record = await getParameterById(37);

        const receivedAccountsPayableFilesPath = record.Value;
        
        return receivedAccountsPayableFilesPath;

    } catch (error) {
        
        logger.error('Function getReceivedAccountsPayableFilesPath: ', error);

    }

}

async function getReceivedPaymentsFilesPath() {

    try {

        const record = await getParameterById(38);

        const receivedPaymentsFilesPath = record.Value;
        
        return receivedPaymentsFilesPath;

    } catch (error) {
        
        logger.error('Function getReceivedPaymentsFilesPath: ', error);

    }

}

async function getApprovePoolWFTracker() {

    try {

        const record = await getParameterById(40);

        const approvePoolWFTracker = record.Value;
        
        return approvePoolWFTracker;

    } catch (error) {
        
        logger.error('Function getApprovePoolWFTracker: ', error);

    }

}

async function getCierreFlujoAdobeSign() {

    try {

        const record = await getParameterById(58);

        const cierreFlujoAdobeSign = record.Value;
        
        return cierreFlujoAdobeSign;

    } catch (error) {
        
        logger.error('Function getCierreFlujoAdobeSign: ', error);

    }

}

async function getRejectPoolWFTracker() {

    try {

        const record = await getParameterById(41);

        const rejectPoolWFTracker = record.Value;
        
        return rejectPoolWFTracker;

    } catch (error) {
        
        logger.error('Function getRejectPoolWFTracker: ', error);

    }

}

async function getRejectPoolInvoiceWFTracker() {

    try {

        const record = await getParameterById(42);

        const rejectPoolGenerationWFTracker = record.Value;
        
        return rejectPoolGenerationWFTracker;

    } catch (error) {
        
        logger.error('Function getApprovePoolWFTracker: ', error);

    }
}

async function getApprovePoolInvoiceWFTracker() {

    try {

        const record = await getParameterById(43);

        const approvePoolGenerationWFTracker = record.Value;
        
        return approvePoolGenerationWFTracker;

    } catch (error) {
        
        logger.error('Function getApprovePoolWFTracker: ', error);

    }
}

async function getApprovedPoolStatus() {

    try {

        const record = await getParameterById(44);

        const approvedPoolStatus = record.Value;
        
        return approvedPoolStatus;

    } catch (error) {
        
        logger.error('Function getApprovedPoolStatus: ', error);

    }

}

async function getAdobeSignOAUTH_ACCESS_TOKEN() {
    
    try {

        const record = await getParameterById(45);

        const adobeSignOAUTH_ACCESS_TOKEN = record.Value;

        console.log("SI ENTRE")
        console.log(record)

        return adobeSignOAUTH_ACCESS_TOKEN;

    } catch (error) {
        
        logger.error('Function getAdobeSignOAUTH_ACCESS_TOKEN: ' + JSON.stringify(error));

    }

}

async function getAdobeSignClientId() {

    try {

        const record = await getParameterById(54);

        const adobeSignClientId = record.Value;
        
        return adobeSignClientId;

    } catch (error) {
        
        logger.error('Function getAdobeSignClientId: ' + JSON.stringify(error));

    }

}

async function getAdobeSignApplicationId() {

    try {

        const record = await getParameterById(46);

        const adobeSignApplicationId = record.Value;
        
        return adobeSignApplicationId;

    } catch (error) {
        
        logger.error('Function getAdobeSignClientId: ' + JSON.stringify(error));

    }

}

async function getAdobeSignApplicationSecret() {

    try {

        const record = await getParameterById(47);

        const adobeSignApplicationSecret = record.Value;
        
        return adobeSignApplicationSecret;

    } catch (error) {
        
        logger.error('Function getAdobeSignClientSecret: ' + JSON.stringify(error));

    }

}

async function getEnvironment() {

    try {

        const record = await getParameterById(48);

        const environment = record.Value;
        
        return environment;

    } catch (error) {
        
        logger.error('Function getEnvironment: ' + JSON.stringify(error));

    }

}

async function getAdobeSignTestMails() {

    try {

        const record = await getParameterById(49);

        const adobeSignTestMails = record.Value;
        
        return adobeSignTestMails;

    } catch (error) {
        
        logger.error('Function getAdobeSignTestMails: ' + JSON.stringify(error));

    }

}

async function getASDocLoadFailWFStatus() {

    try {

        const record = await getParameterById(50);

        const asDocLoadFailWFStatus = record.Value;
        
        return asDocLoadFailWFStatus;

    } catch (error) {
        
        logger.error('Function getASDocLoadFailWFStatus: ' + JSON.stringify(error));

    }

}

async function getASDocLoadSuccessWFStatus() {

    try {

        const record = await getParameterById(51);

        const asDocLoadSuccessWFStatus = record.Value;
        
        return asDocLoadSuccessWFStatus;

    } catch (error) {
        
        logger.error('Function getASDocLoadSuccessWFStatus: ' + JSON.stringify(error));

    }

}

async function getASAgrLoadFailWFStatus() {

    try {

        const record = await getParameterById(52);

        const asAgrLoadFailWFStatus = record.Value;
        
        return asAgrLoadFailWFStatus;

    } catch (error) {
        
        logger.error('Function getASAgrLoadFailWFStatus: ' + JSON.stringify(error));

    }

}

async function getASAgrLoadSuccessWFStatus() {

    try {

        const record = await getParameterById(53);

        const asAgrLoadSuccessWFStatus = record.Value;
        
        return asAgrLoadSuccessWFStatus;

    } catch (error) {
        
        logger.error('Function getASAgrLoadSuccessWFStatus: ' + JSON.stringify(error));

    }

}

async function getValidarCFDISat() {

    try {

        const record = await getParameterById(57);

        const validarCFDI = record.Value;
        
        return validarCFDI;

    } catch (error) {
        
        logger.error('Function getValidarCFDISat: ' + JSON.stringify(error));

    }

}

module.exports = {
    getGeneralParameters : getGeneralParameters,
    getExpirationJWTExternalAppl : getExpirationJWTExternalAppl,
    getSecretJWTExternalAppl : getSecretJWTExternalAppl,
    getCPorteRequestsPath : getCPorteRequestsPath,
    getCPorteRequestsURLPath : getCPorteRequestsURLPath,
    getcPorteFileLoadWFTracker : getcPorteFileLoadWFTracker,
    getcPorteShipmentApprovalWFTracker : getcPorteShipmentApprovalWFTracker,
    getcPorteShipmentRejectionWFTracker : getcPorteShipmentRejectionWFTracker,
    getXMLInvoicesPath : getXMLInvoicesPath,
    getXMLInvoicesURLPath : getXMLInvoicesURLPath,
    getPDFInvoicesPath : getPDFInvoicesPath,
    getParameterById: getParameterById,
    updateGeneralParameter : updateGeneralParameter,
    getGeneralParametersGrouper : getGeneralParametersGrouper,
    getVendorEvidencesLoadedWFTracker : getVendorEvidencesLoadedWFTracker,
    getGeneralFilesPath : getGeneralFilesPath,
    getGeneralFilesURLPath : getGeneralFilesURLPath,
    getLoadedEvidencesStatus : getLoadedEvidencesStatus,
    getcPortePoolGenerationWFTracker : getcPortePoolGenerationWFTracker,
    getcPorteEvidencesRejectionWFTracker : getcPorteEvidencesRejectionWFTracker,
    getPoolCoverComplementFilePrefix : getPoolCoverComplementFilePrefix,
    getPoolCoverFileType : getPoolCoverFileType,
    getPoolsWorkFlowType : getPoolsWorkFlowType,
    getPoolsWorkFlowInitialTracker : getPoolsWorkFlowInitialTracker,
    getInterfacedAccountsPayableFilesPath : getInterfacedAccountsPayableFilesPath,
    getReceivedAccountsPayableFilesPath : getReceivedAccountsPayableFilesPath,
    getReceivedPaymentsFilesPath : getReceivedPaymentsFilesPath,
    getApprovePoolWFTracker : getApprovePoolWFTracker,
    getCierreFlujoAdobeSign : getCierreFlujoAdobeSign,
    getRejectPoolWFTracker : getRejectPoolWFTracker,
    getRejectPoolInvoiceWFTracker : getRejectPoolInvoiceWFTracker,
    getApprovePoolInvoiceWFTracker : getApprovePoolInvoiceWFTracker,
    getApprovedPoolStatus : getApprovedPoolStatus,
    getAdobeSignOAUTH_ACCESS_TOKEN :  getAdobeSignOAUTH_ACCESS_TOKEN,
    getAdobeSignClientId : getAdobeSignClientId,
    getAdobeSignApplicationId : getAdobeSignApplicationId,
    getAdobeSignApplicationSecret : getAdobeSignApplicationSecret,
    getEnvironment : getEnvironment,
    getAdobeSignTestMails : getAdobeSignTestMails,
    getPoolCoverLogo : getPoolCoverLogo,
    getASDocLoadFailWFStatus : getASDocLoadFailWFStatus,
    getASDocLoadSuccessWFStatus : getASDocLoadSuccessWFStatus,
    getASAgrLoadFailWFStatus : getASAgrLoadFailWFStatus,
    getASAgrLoadSuccessWFStatus : getASAgrLoadSuccessWFStatus,
    getValidarCFDISat : getValidarCFDISat
}