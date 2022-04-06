var config = require('../dbconfig'); 
const sql = require('mssql'); 

//Funcion para obtener un registro mediante su id
async function getInvoiceId(params){

    try{

        let pool = await sql.connect(config);

        let catInvoices = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('pvUUID', sql.VarChar, params)
            .execute('spInvoices_CRUD_Records');
        
        pool.close();

        return catInvoices.recordsets;

    }catch(error){

        logger.error('Error en Get Invoice by UUID: ', error);

    }
}

module.exports = {
    getInvoiceId : getInvoiceId,
}