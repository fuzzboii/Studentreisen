const mysqlpool = require('../db').pool;
const mysql = require('mysql');

const router = require('express').Router();

const { verifyAuth } = require('../global/CommonFunctions');

router.post('/getNotifs', async (req, res) => {
    if(req.body.token !== undefined) {
        // Sjekker om token er korrekt og at IP-adressen er gyldig for token
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then(function(response) {
            if(response.authenticated) {
                // OK, kan fortsette
                mysqlpool.getConnection(function(error, connPool) {
                    if(error) {
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    }
        
                    // Oppretter spørring, henter alle kunngjøringer for de siste 7 dagene, tester på om kunngjøringene er lest på klientsiden
                    let getNotifsQuery = "SELECT kid, CONCAT(fnavn, ' ', enavn) as lagetav, tekst, dato, lest FROM kunngjoring, bruker WHERE av = brukerid AND til = ? AND dato >= NOW() - INTERVAL 7 DAY ORDER BY kid DESC LIMIT 5";
                    let getNotifsQueryFormat = mysql.format(getNotifsQuery, [response.brukerid]);

                    connPool.query(getNotifsQueryFormat, (error, results) => {
                        // Ferdig med spørringer, løser ut koblingen til databasen
                        connPool.release();
                        if (error) {
                            console.log("En feil oppstod ved henting av kunngjøringer: " + error.errno + ", " + error.sqlMessage)
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }   
                        
                        if(results[0] !== undefined) {
                            // OK, sender til klient
                            return res.json({"notifs" : results});
                        } else {
                            // Bruker har ingen kunngjøringer for de siste 7 dagene
                            return res.json({"nodata" : "Ingen kunngjøringer å vise"});
                        }
                    });
                });
            } else {
                // Authtoken ikke gyldig / IP-adressen var forskjellig fra forventet IP
                return res.status(403).json({"status": "error", "message": "Ingen tilgang"});
            }
        }); 
    } else {
        // Authtoken ikke tilstede i forespørselen
        return res.status(403).json({"status": "error", "message": "Et eller flere felt mangler fra forespørselen"});
    }
});

router.post('/readNotifs', async (req, res) => {
    if(req.body.token !== undefined && req.body.notifs !== undefined) {
        // Sjekker om token er korrekt og at IP-adressen er gyldig for token
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then(function(response) {
            if(response.authenticated) {
                // Token og IP er korrekt
                if(req.body.notifs.length >= 1) {
                    // Har 1 eller flere kunngjøringer å lese
                    mysqlpool.getConnection(function(error, connPool) {
                        // Går igjennom alle kunngjøringene og setter de til lest
                        req.body.notifs.forEach(kunngjoring => {
                            if(error) {
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }
                
                            let readNotifsQuery = "UPDATE kunngjoring SET lest = 1 WHERE kid = ? AND til = ?";
                            let readNotifsQueryFormat = mysql.format(readNotifsQuery, [kunngjoring.kid, response.brukerid]);
            
                            connPool.query(readNotifsQueryFormat, (error, results) => {
                                if (error) {
                                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                }
                            });
                        });
                        
                        // Løser ut koblingen til database etter vi har gått igjennom kunngjøringene
                        connPool.release();
                        
                        return res.json({"status": "success", "message": "Kunngjøringer lest"});
                    });
                }
            } else {
                // Authtoken ikke gyldig / IP-adressen var forskjellig fra forventet IP
                return res.status(403).json({"status": "error", "message": "Ingen tilgang"});
            }
        }); 
    } else {
        // Authtoken ikke tilstede i forespørselen
        return res.status(403).json({"status": "error", "message": "Et eller flere felt mangler fra forespørselen"});
    }
});

module.exports = router;