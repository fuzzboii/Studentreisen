const { connection } = require('../db');
const mysql = require('mysql');
const path = require('path');
const { verifyAuth } = require('../global/CommonFunctions');

const router = require('express').Router();

router.get('/getAllSeminarUpcomingData', async (req, res) => {
    try{

        connection.query('SELECT seminarid, seminar.bildeid, navn, adresse, oppstart, varighet, beskrivelse, tilgjengelighet, plassering, brukerid, fnavn, enavn FROM Seminar, Bilde, bruker WHERE tilgjengelighet = true and varighet > CURRENT_DATE() and Seminar.bildeid = Bilde.bildeid and Seminar.arrangor = Bruker.brukerid ORDER BY oppstart ASC;', (error, results) => {
            res.send(results);
        });

    }catch(err) {
        res.json({message:err});
    }

    });

router.get('/getAllSeminarExpiredData', async (req, res) => {
    try{

        connection.query('SELECT seminarid, seminar.bildeid, navn, adresse, oppstart, varighet, beskrivelse, tilgjengelighet, plassering, brukerid, fnavn, enavn FROM Seminar, Bilde, bruker WHERE tilgjengelighet = true and varighet < CURRENT_DATE() and Seminar.bildeid = Bilde.bildeid and Seminar.arrangor = Bruker.brukerid ORDER BY oppstart ASC;', (error, results) => {
            res.send(results);
        });

    }catch(err) {
        res.json({message:err});
    }

    }); 


    router.post('/updateSeminar', async (req, res) => { 
        console.log(req.body.seminarid);
        if(req.body.token !== undefined && req.body.seminarid !== undefined) {
            
            let updateQuery = "UPDATE seminar SET navn = ?, oppstart = ?, varighet = ?, beskrivelse = ?, adresse = ? WHERE seminarid = ?";
            let updateQueryFormat = mysql.format(updateQuery, [req.body.title, req.body.startdate, req.body.enddate, req.body.description, req.body.address, req.body.seminarid]);

            connection.query(updateQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occured while updating the data, details: " + error.errno + ", " + error.sqlMessage)
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                
                }
                
                if(res.status(200)) {
                    res.send(results);

                } else {
                    res.status(400).json({"status" : "error", "message" : "En feil oppstod under spørring"});
                }         
                
            });
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
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
                        // Oppretter seminar
                        let insertSeminarQuery = "INSERT INTO seminar(navn, arrangor, adresse, oppstart, varighet, beskrivelse, tilgjengelighet) VALUES(?, ?, ?, ?, ?, ?, ?)";
                        let insertSeminarQueryFormat = mysql.format(insertSeminarQuery, [req.body.title, response.brukerid, req.body.address, req.body.startdate, req.body.enddate, req.body.description, (req.body.availability === "true") ? 1 : 0]);
                
                        connection.query(insertSeminarQueryFormat, (error, insertedSeminar) => {
                            if (error) {
                                console.log("En feil oppstod ved oppretting av nytt seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }
                            
                            if(insertedSeminar.affectedRows > 0) {
                                // Bruker har oppgitt et bilde som skal lastes opp
                                const opplastetFilnavn = req.files.image.name;
                                const filtype = opplastetFilnavn.substring(opplastetFilnavn.lastIndexOf('.'));
                                const filnavn = "seminar" + insertedSeminar.insertId + filtype;


                                const rootFolder = path.join(__dirname, '../../');
        
                                const opplastetBilde = req.files.image;
                                opplastetBilde.mv(rootFolder + '/public/uploaded/' + filnavn);

                                // Oppretter referanse til bilde og kobler mot seminar
                                let insertImageQuery = "INSERT INTO bilde(plassering) VALUES(?)";
                                let insertImageQueryFormat = mysql.format(insertImageQuery, [filnavn]);
                        
                                connection.query(insertImageQueryFormat, (error, insertedImage) => {
                                    if (error) {
                                        console.log("En feil oppstod ved oppretting av nytt bilde til et seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                    }
                                    
                                    if(insertedImage.affectedRows > 0) {
                                        // Oppretter referanse til bilde og kobler mot seminar
                                        let insertQuery = "UPDATE seminar SET bildeid = ? WHERE seminarid = ?";
                                        let insertQueryFormat = mysql.format(insertQuery, [insertedImage.insertId, insertedSeminar.insertId]);
                                
                                        connection.query(insertQueryFormat, (error, results) => {
                                            if (error) {
                                                console.log("En feil oppstod ved kobling av bilde og seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                            }
                                            
                                            if(results.affectedRows > 0) {
                                                return res.json({success : true, seminarid : insertedSeminar.insertId});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                        
                    } else {
                        // Oppretter seminar uten bilde
                        let insertQuery = "INSERT INTO seminar(navn, arrangor, adresse, oppstart, varighet, beskrivelse, tilgjengelighet) VALUES(?, ?, ?, ?, ?, ?, ?)";
                        let insertQueryFormat = mysql.format(insertQuery, [req.body.title, response.brukerid, req.body.address, req.body.startdate, req.body.enddate, req.body.description, (req.body.availability === "true") ? 1 : 0]);
                
                        connection.query(insertQueryFormat, (error, results) => {
                            if (error) {
                                console.log("En feil oppstod under registrering av ny bruker, detaljer: " + error.errno + ", " + error.sqlMessage)
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }
                            
                            if(results.affectedRows > 0) {
                                return res.json({success: true, seminarid : results.insertId});
                            }
                        });
                    }
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