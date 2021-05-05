const dotenv = require("dotenv");
dotenv.config();

const mysql = require('mysql');

let connection;
try {
    connection = mysql.createPool({
        host: process.env.DBHOST,
        user: process.env.DBUSERNAME,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME
    });

    connection.getConnection(function(error, connPool) {
        if (!error) {
            console.log('Tilkoblet databasen');
            connPool.release();
        } else {
            console.log("En feil oppstod ved tilkobling mot databasen: " + error.code);
        }
    });

} catch (error) {
    console.log("En feil oppstod ved tilkobling mot databasen: " + error.code);
}



exports.pool = connection