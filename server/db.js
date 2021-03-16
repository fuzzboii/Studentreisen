const dotenv = require("dotenv");
dotenv.config();

const mysql = require('mysql');

let connection;
try {
    connection = mysql.createConnection({
        host: process.env.DBHOST,
        user: process.env.DBUSERNAME,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME
    });
    
    connection.connect((error) => {
        if (!error) {
            console.log('Tilkoblet databasen');
        } else {
            console.log("En feil oppstod ved tilkobling mot databasen: " + error.code);
        }
    });

} catch (error) {
    console.log("En feil oppstod ved tilkobling mot databasen: " + error.code);
}




module.exports = {connection}