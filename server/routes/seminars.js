const { connection } = require('../db');
const mysql = require('mysql');

const router = require('express').Router();

router.get('/getAllSeminarData', async (req, res) => {
    try{
        // let checkQuery = "SELECT * FROM Seminar";
        // let checkQueryFormat = mysql.format(checkQuery);
        connection.query('SELECT seminarid, seminar.bildeid, navn, arrangor, adresse, oppstart, varighet, beskrivelse, tilgjengelighet, plassering FROM Seminar, Bilde WHERE tilgjengelighet = true and Seminar.bildeid = Bilde.bildeid;', (error, results) => {
            res.send(results);
        });

    }catch(err) {
        res.json({message:err});
    }

    });

    /* 
    Order
    {
        "bildeid": "",
        "arrangor": "",
        "adresse": "",
        "oppstart": "",
        "varighet": "",
        "beskrivelse": ""
        "tilgjengelighet": ""
    }
    */

    router.post('/', async (req, res) => {
        if(req.body.emnekode !== undefined && req.body.navn !== undefined && req.body.beskrivelse !== undefined && req.body.semester !== undefined
            && req.body.studiepoeng !== undefined && req.body.lenke !== undefined) {

            let insertQuery = "INSERT INTO seminar (bildeid, arrangor, adresse, oppstart, varighet, beskrivelse, tilgjengelighet) VALUES (?, ?, ?, ?, ?, ?)";
            let insertQueryFormat = mysql.format(insertQuery, [req.body.emnekode, req.body.navn, req.body.beskrivelse, req.body.semester, req.body.studiepoeng, req.body.lenke]);

            connection.query(insertQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occurred while user was creating a course, details: " + error.errno + ", " + error.sqlMessage)
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
              
                }
                // Returning the number of affected rows to indicate the insert went OK
                if(results.affectedRows > 0) {
                    res.status(200).json({"status" : "success", "message" : "Seminar opprettet"});
                } else {
                    res.status(400).json({"status" : "error", "message" : "En feil oppstod under oppretting av seminaret"});
                }
            });

    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
       }
    });
   

module.exports = router;