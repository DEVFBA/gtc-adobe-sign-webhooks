var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql
// Para el logger
const logger = require('../Utils/logger');

async function getUsers(params){

    try{

        let pool = await sql.connect(config);

        let users = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .execute('spSecurity_Users_CRUD_Records');
        
        pool.close();

        return users.recordsets;

    }catch(error){

        console.log(error);
        logger.error('Error en controllers/security-users/getUsers: ', error);

    }

}

async function getUserRole(userId) {

    try {

        const pool = await sql.connect(config);

        const userData = await pool.request()
            .input('pvOptionCRUD', sql.VarChar(5), 'R')
            .input('pvIdUser', sql.VarChar(60), userId)
            .execute('spSecurity_Users_CRUD_Records');

        const userRole = userData.recordset[0].Id_Role;

        pool.close();

        return userRole;
        
    } catch (error) {

        logger.error('Error en getUserRole: ', error);
        
    }

}

async function getUserByEmail(email) {

    try {
        
        logger.info('Buscando Registro de Usuario para el Correo: ' + email);

        const usersData = await getUsers({pvOptionCRUD: 'R'});

        const userRecord = usersData[0].filter((record) => {

            return record.Email === email;

        });

        const userRecordLength = userRecord.length;

        if( userRecordLength === 0 ) {

            logger.info('No se encontró un Registro de Usuario con el correo: ' + email);

            return null;

        } else {

            const userId = userRecord[0].User;
            
            logger.info('Usuario ' + userId + ' encontrado para el correo: ' + email);

            return userId;

        }

    } catch (error) {

        logger.error('ERR: Error en getUserByEmail: ' + error);

        return null;
        
    }

}

module.exports = {
    getUserRole : getUserRole,
    getUserByEmail : getUserByEmail
}