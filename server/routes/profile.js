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
    console.log(req.body)
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
                    console.log(results[0]);
                    return res.json({results});
                } else {
                    return res.json({"status" : "error", "message" : "En feil oppstod under hetning av brukerdata"});
                }
            });       
        })
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
});

// // Henter aktive interesser til innlogget bruker //
router.post('/getInteresse', async (req, res) => {
    let brukerid = undefined;
    console.log(req.body)
    if (req.body.token !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid 
            let getQuery = "SELECT brukerid, beskrivelse, fagfelt.fagfeltid FROM interesse, fagfelt WHERE interesse.fagfeltid = fagfelt.fagfeltid AND interesse.brukerid = ?";
            let getQueryFormat = mysql.format(getQuery, [brukerid]);
            connection.query(getQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occurred while fetching user details, details: " + error.errno + ", " + error.sqlMessage)
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
              
                }
                
                // Returnerer påvirkede rader
                if(results[0] !== undefined) {
                    console.log(results[0]);
                    return res.json({results});
                } else {
                    return res.json({"status" : "error", "message" : "En feil oppstod under hetning av brukerdata"});
                }
            });       
        })
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
});

router.delete('/deleteInteresse', async (req, res) => {
    if(req.body.brukerid !== undefined && req.body.fagfeltid !== undefined) {

        let deleteQuery = "DELETE FROM interesse WHERE brukerid = ? AND fagfeltid = ?";
        let deleteQueryFormat = mysql.format(deleteQuery, [req.body.brukerid, req.body.fagfeltid]);

        connection.query(deleteQueryFormat, (error, results) => {
            if (error) {
                console.log("An error occurred while user was deleting an interest, details: " + error.errno + ", " + error.sqlMessage)
                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
          
            }
            // Returnerer påvirkede rader
            if(results.affectedRows > 0) {
                res.status(200).json({"status" : "success", "message" : "Interesse slettet"});
            } else {
                res.status(400).json({"status" : "error", "message" : "En feil oppstod under sletting av Interessen"});
            }
        });

    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
    }
});

module.exports = router;