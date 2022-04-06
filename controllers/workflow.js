var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

const logger = require("../Utils/logger");

//Crear un workflow
async function insertWorkflow(register) { 
    try{

        let pool = await sql.connect(config);

        let insertWorkflow = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('pvIdWorkflowType', sql.VarChar, register.pvIdWorkflowType)
            .input('piIdWorkflowStatus', sql.Int, register.piIdWorkflowStatus)
            .input('piIdWorkflowStatusChange', sql.Int, register.piIdWorkflowStatusChange)
            .input('pvRecordIdentifier', sql.VarChar, register.pvRecordIdentifier)
            .input('pvComments', sql.VarChar, register.pvComments)
            .input('pvUser', sql.VarChar, register.pvUser)
            .input('pvIP', sql.VarChar, register.pvIP)
            .execute('spWorkflow_CRUD_Records');

        console.log(JSON.stringify(insertWorkflow.recordsets[0][0])); 

        pool.close();

        return insertWorkflow.recordsets;

    }catch(error){

        console.log('Error en insertWorkflow: ', error);
        logger.error('Error en insertWorkflow: ', error);

    }
}

module.exports = {
    insertWorkflow : insertWorkflow
}