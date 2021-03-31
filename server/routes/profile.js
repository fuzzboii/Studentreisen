const { connection } = require('../db');
const mysql = require('mysql');

const router = require('express').Router();

// TODO: Hent innlogget brukers id fra CommonFunctions
const brukerid = 1;

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
router.get('/getBruker', async (req, res) => {
    let getQuery = "SELECT fnavn, enavn, telefon, email FROM bruker WHERE brukerid=?";
    let getQueryFormat = mysql.format(getQuery, [brukerid]);
    try{
        connection.query(getQueryFormat, (error, results) => {
            res.send(results);
        });

    }catch(err) {
        res.json({message:err});
    }
});

// Henter aktive interesser til innlogget bruker //
router.get('/getInteresse', async (req, res) => {
    let getQuery = "SELECT brukerid, beskrivelse, fagfelt.fagfeltid FROM interesse, fagfelt WHERE interesse.fagfeltid = fagfelt.fagfeltid AND interesse.brukerid = ?";
    let getQueryFormat = mysql.format(getQuery, [brukerid]);
    try{
        connection.query(getQueryFormat, (error, results) => {
            res.send(results);
        });
    }catch(err) {
        res.json({message:err});
    }
})

router.post('/postInteresse', async (req, res) => {
    if(req.body.brukerid !== undefined && req.body.fagfeltid !== undefined) {

        let insertQuery = "INSERT INTO interesse (brukerid, fagfeltid) VALUES (?, ?)";
        let insertQueryFormat = mysql.format(insertQuery, [req.body.brukerid, req.body.fagfeltid]);

        connection.query(insertQueryFormat, (error, results) => {
            if (error) {
                console.log("An error occurred while user was creating an interest, details: " + error.errno + ", " + error.sqlMessage)
                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
          
            }
            // Returnerer påvirkede rader
            if(results.affectedRows > 0) {
                res.status(200).json({"status" : "success", "message" : "Interesse opprettet"});
            } else {
                res.status(400).json({"status" : "error", "message" : "En feil oppstod under oppretting av Interessen"});
            }
        });

    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
    }
});

router.post('/deleteInteresse', async (req, res) => {
    if(req.body.brukerid !== undefined && req.body.fagfeltid !== undefined) {

        let deleteQuery = "DELETE FROM interesse WHERE brukerid = % AND fagfeltid = %";
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