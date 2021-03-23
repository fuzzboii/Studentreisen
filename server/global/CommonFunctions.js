const { connection } = require('../db');
const mysql = require('mysql');

const verifyAuth = (token) => {
    return new Promise(function(resolve, reject){
        try {
            if(token !== undefined) {
                token = token;
                // Sjekker om authtoken fremdeles er gyldig
                let checkQuery = "SELECT gjelderfor FROM login_token WHERE token = ? AND utlopsdato > NOW()";
                let checkQueryFormat = mysql.format(checkQuery, [token]);
    
                connection.query(checkQueryFormat, (error, results) => {
                    if (error) {
                        console.log("En feil oppstod ved henting av token fra login_token: " + error.errno + ", " + error.sqlMessage)
                    }
    
                    if(results[0] !== undefined) {
                        // authtoken er gyldig, henter brukerIDen
                        checkQuery = "SELECT brukerid, niva FROM bruker WHERE brukerid = ?";
                        checkQueryFormat = mysql.format(checkQuery, [results[0].gjelderfor]);
    
                        connection.query(checkQueryFormat, (error, results) => {
                            if (error) {
                                console.log("En feil oppstod ved henting av bruker nivå i BrukerOversikt: " + error.errno + ", " + error.sqlMessage);
                            }
    
                            if(results[0] !== undefined) {
                                resolve({"authenticated" : true, "usertype" : results[0].niva});
                            } else {
                                resolve({"authenticated" : false});
                            }
                        });
                    } else {
                        resolve({"authenticated" : false});
                    }
                });
            } else {
                resolve({"authenticated" : false});
            }
        } catch(e) {
            reject({"authenticated" : false});
        }
    });
}

module.exports.verifyAuth = verifyAuth;