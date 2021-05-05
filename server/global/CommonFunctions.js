const mysqlpool = require('../db').pool;
const mysql = require('mysql');
const nodemailer = require('nodemailer');

const verifyAuth = (token) => {
    return new Promise(function(resolve, reject){
        try {
            if(token !== undefined) {
                mysqlpool.getConnection(function(error, connPool) {
                    if(error) {
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    }
                    token = token;
                    // Sjekker om authtoken fremdeles er gyldig
                    let checkQuery = "SELECT gjelderfor FROM login_token WHERE token = ? AND utlopsdato > NOW()";
                    let checkQueryFormat = mysql.format(checkQuery, [token]);
        
                    connPool.query(checkQueryFormat, (error, results) => {
                        if (error) {
                            connPool.release();
                            console.log("En feil oppstod ved henting av token fra login_token: " + error.errno + ", " + error.sqlMessage)
                        }
        
                        if(results[0] !== undefined) {
                            // authtoken er gyldig, henter brukerIDen
                            checkQuery = "SELECT brukerid, niva FROM bruker WHERE brukerid = ?";
                            checkQueryFormat = mysql.format(checkQuery, [results[0].gjelderfor]);
        
                            connPool.query(checkQueryFormat, (error, results) => {
                                if (error) {
                                    connPool.release();
                                    console.log("En feil oppstod ved henting av bruker nivå i BrukerOversikt: " + error.errno + ", " + error.sqlMessage);
                                }
        
                                if(results[0] !== undefined) {
                                    connPool.release();
                                    resolve({"authenticated" : true, "usertype" : results[0].niva, "brukerid" : results[0].brukerid});
                                } else {
                                    connPool.release();
                                    resolve({"authenticated" : false});
                                }
                            });
                        } else {
                            connPool.release();
                            resolve({"authenticated" : false});
                        }
                    });
                });
            } else {
                resolve({"authenticated" : false});
            }
        } catch(e) {
            reject({"authenticated" : false});
        }
    });
}

const sendEmail = (recipient, subject, body) => {
    return new Promise(function(resolve, reject){
        try {
            if(recipient !== undefined && subject !== undefined && body !== undefined) {
                // Oppretter tilkobling mot Gmail
                const mailTransporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_ADDRESS,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });

                // Oppretter e-posten som sendes til bruker
                const mailOptions = {
                    from: 'usnstudentreisen@gmail.com',
                    to: recipient,
                    subject: subject,
                    text: body
                };

                // Sender e-posten
                mailTransporter.sendMail(mailOptions, (err, mailResponse) => {
                    if(err) {
                        console.log("En feil oppstod ved utsendelse av e-post, detaljer: " + err)
                        resolve("En feil oppstod ved sending av e-post")
                    } else {
                        resolve("Sendt")
                    }
                });
            } else {
                resolve("En eller flere av de obligatoriske feltene er ikke med")
            }
        } catch(e) {
            reject(e);
        }
    });
}

module.exports.verifyAuth = verifyAuth;
module.exports.sendEmail = sendEmail;