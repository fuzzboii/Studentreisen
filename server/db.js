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
        if (error) throw error;
        console.log('Connection to the database established');
    });

} catch (error) {
    console.log("An error occurred while connecting to the database");
    console.log(error);
}




module.exports = {connection}