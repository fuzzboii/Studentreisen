const mysqlpool = require('../db').pool;
const mysql = require('mysql');

const router = require('express').Router();

const { verifyAuth } = require('../global/CommonFunctions');

router.post('/getNotifs', async (req, res) => {
    if(req.body.token !== undefined) {
        verifyAuth(req.body.token).then(function(response) {
            if(response.authenticated) {
                mysqlpool.getConnection(function(error, connPool) {
                    if(error) {
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    }
        
                    let getNotifsQuery = "SELECT kid, CONCAT(fnavn, ' ', enavn) as lagetav, tekst, dato FROM kunngjoring, bruker WHERE av = brukerid AND til = ? AND dato >= NOW() - INTERVAL 7 DAY ORDER BY kid DESC LIMIT 5";
                    let getNotifsQueryFormat = mysql.format(getNotifsQuery, [response.brukerid]);

                    connPool.query(getNotifsQueryFormat, (error, results) => {
                        connPool.release();
                        if (error) {
                            console.log("En feil oppstod ved henting av kunngjøringer: " + error.errno + ", " + error.sqlMessage)
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }   
                        
                        if(results[0] !== undefined) {
                            return res.json({"notifs" : results});
                        } else {
                            return res.json({"nodata" : "Ingen kunngjøringer å vise"});
                        }
                    });
                });
            } else {
                return res.status(403).json({"status": "error", "message": "Ingen tilgang"});
            }
        }); 
    } else {
        return res.status(403).json({"status": "error", "message": "Et eller flere felt mangler fra forespørselen"});
    }
});

router.post('/readNotifs', async (req, res) => {
    if(req.body.token !== undefined && req.body.notifs !== undefined) {
        verifyAuth(req.body.token).then(function(response) {
            if(response.authenticated) {
                if(req.body.notifs.length >= 1) {
                    mysqlpool.getConnection(function(error, connPool) {
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
                        
                        connPool.release();
                        
                        return res.json({"status": "success", "message": "Kunngjøringer lest"});
                    });
                }
            } else {
                return res.status(403).json({"status": "error", "message": "Ingen tilgang"});
            }
        }); 
    } else {
        return res.status(403).json({"status": "error", "message": "Et eller flere felt mangler fra forespørselen"});
    }
});

module.exports = router;