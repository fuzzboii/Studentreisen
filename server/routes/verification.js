const mysqlpool = require('../db').pool;
const mysql = require('mysql');
const cryptojs = require('crypto-js');
const { emailValidation, hexValidation } = require('../validation');

const router = require('express').Router();

router.get('/auth', async (req, res) => {
    res.send(404);
});

router.post('/auth', async (req, res) => {
    if(req.body.token !== undefined) {
        const decryptedToken = cryptojs.AES.decrypt(req.body.token, process.env.TOKEN_SECRET);

        const validation = emailValidation({epost : decryptedToken.toString(cryptojs.enc.Utf8)});
        
        if(validation.error) {
            // Validering feilet for den dekrypterte e-posten, antar token er ugyldig
            return res.json({ "authenticated" : false});
        } else {      
            // Henter IP-adressen til brukeren
            let ip;
            if(process.env.DEVMODE === "true") {
                // Tillater en IP-adresse å være tom
                if(req.socket.remoteAddress.substring(7).length == 0) {
                    // Localhost
                    ip = "devmode";
                } else {
                    ip = req.socket.remoteAddress.substring(7);
                }
            } else {
                if(req.socket.remoteAddress.substring(7).length == 0) {
                    return res.json({ "authenticated" : false});
                } else {
                    ip = req.socket.remoteAddress.substring(7);
                }
            }

            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }
                // Sjekk om token fremdeles er gyldig
                let checkQuery = "SELECT gjelderfor, ip, niva FROM login_token, bruker WHERE gjelderfor in (SELECT brukerid as gjelderfor FROM bruker WHERE email = ?) AND gjelderfor = brukerid AND token = ? AND ip = ? AND utlopsdato > NOW();";
                let checkQueryFormat = mysql.format(checkQuery, [decryptedToken.toString(cryptojs.enc.Utf8), req.body.token, ip]);

                connPool.query(checkQueryFormat, (error, results) => {
                    if (error) {
                        connPool.release();
                        console.log("An error occurred while checking for matches while authenticating, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "authenticated" : false});
                    }
                    if(results[0] !== undefined) {
                        // Henter de siste 5 kunngjøringene for brukeren som ikke er lest
                        let hentKunngjoring = "SELECT kid, CONCAT(fnavn, ' ', enavn) as lagetav, tekst, dato FROM kunngjoring, bruker WHERE av = brukerid AND til = ? AND lest = 0 ORDER BY kid DESC LIMIT 5";
                        let hentKunngjoringFormat = mysql.format(hentKunngjoring, [results[0].gjelderfor]);
                        
                        connPool.query(hentKunngjoringFormat, (error, kunngjoring) => {
                            if (error) {
                                connPool.release();
                                console.log("An error occurred while checking for matches while fetching notifications, details: " + error.errno + ", " + error.sqlMessage)
                                return res.json({ "authenticated" : false});
                            }
                            if(kunngjoring[0] !== undefined) {
                                connPool.release();
                                // Kunngjøringer funnet
                                return res.json({ "authenticated" : true, "usertype" : results[0].niva, "notif" : {kunngjoring}, "brukerid" : results[0].gjelderfor });

                            } else {
                                connPool.release();
                                // Ingen kunngjøringer
                                return res.json({ "authenticated" : true, "usertype" : results[0].niva, "notif" : {}, "brukerid" : results[0].gjelderfor });
                            }
                        });
                    } else {
                        connPool.release();
                        // Token ikke funnet
                        return res.json({ "authenticated" : false});
                    }
                });
            });
        }
    } else {
        return res.json({ "authenticated" : false});
    }
});

router.get('/token', async (req, res) => {
    res.send(404);
});

router.post('/token', async (req, res) => {
    if(req.body.token !== undefined) {
        const validation = hexValidation({token : req.body.token});
        
        if(validation.error) {
            // Validering feilet for token
            return res.json({ "verified" : "false"});
        } else {
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }

                // Sjekk om token fremdeles er gyldig
                let checkQuery = "SELECT gjelderfor FROM glemtpassord_token WHERE token = ? AND utlopsdato > NOW()";
                let checkQueryFormat = mysql.format(checkQuery, [req.body.token]);

                connPool.query(checkQueryFormat, (error, results) => {
                    if (error) {
                        connPool.release();
                        console.log("An error occurred while checking for matches while verifying a token, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "verified" : "false"});
                    }
                    if(results[0] !== undefined) {
                        connPool.release();
                        // Token funnet og har ikke utløpt
                        return res.json({ "verified" : "true"});
                    } else {
                        connPool.release();
                        // Token ble ikke funnet
                        return res.json({ "verified" : "false"});
                    }
                });
            });
        }
    } else {
        return res.json({ "verified" : "false"});
    }
});


module.exports = router;