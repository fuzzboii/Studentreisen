const { connection } = require('../db');
const mysql = require('mysql');
const { verifyAuth } = require('../global/CommonFunctions');

const router = require('express').Router();

router.get('/getAllSeminarUpcomingData', async (req, res) => {
    try{

        connection.query('SELECT seminarid, seminar.bildeid, navn, adresse, oppstart, varighet, beskrivelse, tilgjengelighet, plassering, brukerid, fnavn, enavn FROM Seminar, Bilde, bruker WHERE tilgjengelighet = true and varighet > CURRENT_DATE() and Seminar.bildeid = Bilde.bildeid and Seminar.arrangor = Bruker.brukerid;', (error, results) => {
            res.send(results);
        });

    }catch(err) {
        res.json({message:err});
    }

    });

router.get('/getAllSeminarExpiredData', async (req, res) => {
    try{

        connection.query('SELECT seminarid, seminar.bildeid, navn, adresse, oppstart, varighet, beskrivelse, tilgjengelighet, plassering, brukerid, fnavn, enavn FROM Seminar, Bilde, bruker WHERE tilgjengelighet = true and varighet < CURRENT_DATE() and Seminar.bildeid = Bilde.bildeid and Seminar.arrangor = Bruker.brukerid;', (error, results) => {
            res.send(results);
        });

    }catch(err) {
        res.json({message:err});
    }

    });    




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


router.post('/submitSeminar', (req, res) => {
    if(req.body.title !== undefined && req.body.startdate !== undefined && req.body.enddate !== undefined && req.body.address !== undefined && req.body.description !== undefined && req.body.token !== undefined) {
        verifyAuth(req.body.token).then(function(response) {
            if(response.authenticated) {
                if(response.usertype.toString() !== process.env.ACCESS_STUDENT) {
                    if(req.files) {
                        // Bruker har oppgitt et bilde som skal lastes opp
                        console.log("Last opp seminar med bilde");
                    } else {
                        // Oppretter seminar uten bilde
                        console.log("Last opp seminar uten bilde");
                    }
                    return res.json({success: true});
                } else {
                    // Studenter kan ikke opprette ett seminar
                    console.log("En innlogget bruker uten riktige tilganger har forsøkt å opprette et seminar, brukerens ID: " + response.brukerid);
                    return res.json({success: false});
                }
            } else {
                return res.json({success: false});
            }
        })
    } else {
        return res.status(403).send();
    }
}); 


module.exports = router;