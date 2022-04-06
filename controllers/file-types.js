const config = require('../dbconfig'); 
const sql = require('mssql'); 
const logger = require('../Utils/logger');

async function getWorkflowFileTypeExtension(fileType) {

    try {

        const pool = await sql.connect(config);

        const record = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, 'R')
            .input('pvIdFileType', sql.VarChar, fileType)
            .execute('spCat_File_Types_CRUD_Records');

        const workflowFileTypeExtension = record.recordset[0].Extension;

        return workflowFileTypeExtension;
        
    } catch (error) {
    
        console.log('Error en getWorkflowFileTypeExtension: ', error);
        logger.error('Error en getWorkflowFileTypeExtension: ', error);

    }

}

async function getWorkflowFileTypePath(fileType) {

    try {

        const pool = await sql.connect(config);

        const record = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, 'R')
            .input('pvIdFileType', sql.VarChar, fileType)
            .execute('spCat_File_Types_CRUD_Records');

        const workflowFileTypePath = record.recordset[0].Path;

        return workflowFileTypePath;
        
    } catch (error) {
    
        console.log('Error en getWorkflowFileTypePath: ', error);
        logger.error('Error en getWorkflowFileTypePath: ', error);

    }

}

async function getWorkflowFileTypePrefix(fileType) {

    try {

        const pool = await sql.connect(config);

        const record = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, 'R')
            .input('pvIdFileType', sql.VarChar, fileType)
            .execute('spCat_File_Types_CRUD_Records');

        const workflowFileTypePrefix = record.recordset[0].File_Name_Prefix;

        return workflowFileTypePrefix;
        
    } catch (error) {
    
        console.log('Error en getWorkflowFileTypePrefix: ', error);
        logger.error('Error en getWorkflowFileTypePrefix: ', error);

    }

}

module.exports = {
    getWorkflowFileTypeExtension : getWorkflowFileTypeExtension,
    getWorkflowFileTypePath : getWorkflowFileTypePath,
    getWorkflowFileTypePrefix : getWorkflowFileTypePrefix 
}