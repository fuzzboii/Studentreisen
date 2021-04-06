const { connection } = require('../db');
const mysql = require('mysql');
const { verifyAuth } = require('../global/CommonFunctions');
const router = require('express').Router();  

// Henter alle fagfelter i database //
router.get('/getFagfelt', async (req, res) => {
    try{
        connection.query('SELECT * FROM fagfelt', (error, results) => {
            res.send(results);
        });

    }catch(err) {
        res.json({message:err});
    }
});

// Henter personalia til innlogget bruker //
router.post('/getBruker', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid 
            let getQuery = "SELECT fnavn, enavn, telefon, email FROM bruker WHERE brukerid = ?";
            let getQueryFormat = mysql.format(getQuery, [brukerid]);
            connection.query(getQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occurred while fetching user details, details: " + error.errno + ", " + error.sqlMessage)
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
              
                }
                
                // Returnerer påvirkede rader
                if(results[0] !== undefined) {
                    return res.json({results});
                } else {
                    return res.json({"status" : "error", "message" : "En feil oppstod under henting av brukerdata"});
                }
            });       
        })
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
});

// // Henter aktive interesser til innlogget bruker //
router.post('/getInteresser', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid 
            let getQuery = "SELECT beskrivelse, interesse.fagfeltid FROM interesse, fagfelt WHERE interesse.fagfeltid = fagfelt.fagfeltid AND interesse.brukerid = ?";
            let getQueryFormat = mysql.format(getQuery, [brukerid]);
            connection.query(getQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occurred while fetching user interests, details: " + error.errno + ", " + error.sqlMessage)
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
              
                }
                
                // Returnerer påvirkede rader
                if(results.length > 0) {
                    return res.json({results});
                } else {
                    return res.json({"status" : "error", "message" : "En feil oppstod under henting av brukerens interesser"});
                }
            });       
        })
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
});

// Sletter en av innloget brukers aktive interesser
router.post('/deleteInteresse', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined && req.body.fagfeltid !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid
            let insertQuery = "DELETE FROM interesse WHERE brukerid = ? AND fagfeltid = ?";
            let insertQueryFormat = mysql.format(insertQuery, [brukerid, req.body.fagfeltid]);
            connection.query(insertQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occurred while deleting an interest, details: " + error.errno + ", " + error.sqlMessage)
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
              
                }
                
                // Returnerer påvirkede rader
                if(results.length > 0) {
                    // console.log("Hentet");
                    // return res.json({results});
                } else {
                    return res.json({"status" : "error", "message" : "En feil oppstod under sletting av brukerens interesser"});
                }
            });       
        })
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
});

// Legger til en interesse på innlogget bruker
router.post('/postInteresse', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined && req.body.fagfeltid !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid
            let insertQuery = "INSERT INTO interesse(brukerid, fagfeltid) VALUES(?, ?)";
            let insertQueryFormat = mysql.format(insertQuery, [brukerid, req.body.fagfeltid]);
            connection.query(insertQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occurred while fetching user interests, details: " + error.errno + ", " + error.sqlMessage)
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
              
                }
                
                // Returnerer påvirkede rader
                if(results.length > 0) {
                    // console.log("Hentet");
                    // return res.json({results});
                } else {
                    return res.json({"status" : "error", "message" : "En feil oppstod under henting av brukerens interesser"});
                }
            });       
        })
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
});

// Oppdaterer brukerens passord
router.post('/updatePassord', async (req, res) => {
    console.log("1")
    let brukerid = undefined
    if (req.body.token !== undefined && req.body.pwd !== undefined) {
        console.log("2")
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid
            let updateQuery = "UPDATE bruker SET pwd= ? WHERE brukerid= ?"
            let updateQueryFormat = mysql.format(updateQuery, [req.body.pwd, brukerid])
            connection.query(updateQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occured while updating the users password, details: " + error.errno + ", " + error.sqlMessage)
                    return res.json({ "status" : "error", "message" : "en intern feil oppstod, vennligst forsøk igjen senere"})
                }

                if(results.length > 0) {
                    console.log("3")

                } else {
                    return res.json({"status" : "error", "message" : "En feil oppstod under oppdatering av brukerens passord"})
                }
            })
        })
    } else {
        res.status(400).json({"stauts" : "error", "message" : "Ikke tilstrekkelig data"})
    }
});

// Oppdater brukerens telefonnummer
router.post('/updateTelefon', async (req, res) => {
    let brukerid = undefined
    if (req.body.token !== undefined && req.body.telefon !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid
            let updateQuery = "UPDATE bruker SET telefon= ? WHERE brukerid= ?"
            let updateQueryFormat = mysql.format(updateQuery, [req.body.telefon, brukerid])
            connection.query(updateQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occured while updating the users phone number, details: " + error.errno + ", " + error.sqlMessage)
                    return res.jason({ "status" : "error", "message" : "en intern feil oppstod, vennligst forsøk igjen senere" })
                }

                if(results.length > 0) {

                } else {
                    return res.json({"status" : "error", "message" : "En feil oppstod under oppdatering av brukerens telefonnummer"})
                }
            })
        })
    } else {
        res.status(400).json({"stauts" : "error", "message" : "Ikke tilstrekkelig data"})
    }
})

// Oppdater brukerens telefonnummer
router.post('/updateEmail', async (req, res) => {
    let brukerid = undefined
    if (req.body.token !== undefined && req.body.email !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid
            let updateQuery = "UPDATE bruker SET email= ? WHERE brukerid= ?"
            let updateQueryFormat = mysql.format(updateQuery, [req.body.email, brukerid])
            connection.query(updateQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occured while updating the users email, details: " + error.errno + ", " + error.sqlMessage)
                    return res.jason({ "status" : "error", "message" : "en intern feil oppstod, vennligst forsøk igjen senere" })
                }

                if(results.length > 0) {

                } else {
                    return res.json({"status" : "error", "message" : "En feil oppstod under oppdatering av brukerens email"})
                }
            })
        })
    } else {
        res.status(400).json({"stauts" : "error", "message" : "Ikke tilstrekkelig data"})
    }
})

module.exports = router;