var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql
const logger = require("../Utils/logger");

async function getWFTrackerByIdWF(idWorkflowTracker) {

    try{
        
        let pool = await sql.connect(config);

        let record = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, 'R')
            .input('piIdWorkflowTracker', sql.Int, idWorkflowTracker)
            .execute('spWorkflow_Tracker_CRUD_Records');

        return record.recordset[0];

    }catch(error){

        logger.error('Error en getWFTrackerByIdWF: ', error);

    }

}

module.exports = {
    getWFTrackerByIdWF : getWFTrackerByIdWF,
}