const { connection } = require('../db');
const mysql = require('mysql');

const router = require('express').Router();

const { verifyAuth } = require('../global/CommonFunctions');

router.post('/getNotifs', async (req, res) => {
    if(req.body.token !== undefined) {
        verifyAuth(req.body.token).then(function(response) {
            if(response.authenticated) {
                let getNotifsQuery = "SELECT kid, CONCAT(fnavn, ' ', enavn) as lagetav, tekst, dato FROM kunngjoring, bruker WHERE av = brukerid ORDER BY kid DESC LIMIT 5";
                let getNotifsQueryFormat = mysql.format(getNotifsQuery);

                connection.query(getNotifsQueryFormat, (error, results) => {
                    if (error) {
                        console.log("En feil oppstod ved henting av kunngjøringer: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    }   
                    
                    if(results[0] !== undefined) {
                        return res.json({results});
                    } else {
                        return res.json({});
                    }
                });
            } else {
                return res.json({success: false});
            }
        }); 
    } else {
        return res.status(403).send();
    }
});

router.post('/readNotifs', async (req, res) => {
    if(req.body.token !== undefined && req.body.notifs !== undefined) {
        verifyAuth(req.body.token).then(function(response) {
            if(response.authenticated) {
                req.body.notifs.forEach(kunngjoring => {
                    let readNotifsQuery = "INSERT INTO lest_kunngjoring(kid, brukerid) VALUES(?, ?)";
                    let readNotifsQueryFormat = mysql.format(readNotifsQuery, [kunngjoring.kid, response.brukerid]);
    
                    connection.query(readNotifsQueryFormat, (error, results) => {
                        if (error) {
                            console.log("En feil oppstod ved lagring av leste kunngjøringer: " + error.errno + ", " + error.sqlMessage)
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }
                    });
                });
            }
        }); 
    } else {
        return res.status(403).send();
    }
});

module.exports = router;