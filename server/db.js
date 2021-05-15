const dotenv = require("dotenv");
dotenv.config();

const mysql = require('mysql');

let connection;
try {
    connection = mysql.createPool({
        connectionLimit : 1000,
        host: process.env.DBHOST,
        port: process.env.DBPORT,
        user: process.env.DBUSERNAME,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME
    });

    connection.getConnection(function(error, connPool) {
        if (!error) {
            console.log('Tilkoblet database på ' + process.env.DBHOST + ':' + process.env.DBPORT);
            connPool.release();
        } else {
            console.log("En feil oppstod ved tilkobling mot databasen: \n - " + error.code + "\n - Detaljert: " + error.message);
        }
    });

} catch (error) {
    console.log("En feil oppstod ved tilkobling mot databasen: " + error.code);
}



exports.pool = connection