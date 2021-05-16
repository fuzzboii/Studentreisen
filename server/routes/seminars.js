const mysqlpool = require('../db').pool;
const mysql = require('mysql');
const path = require('path');
const { verifyAuth } = require('../global/CommonFunctions');

const router = require('express').Router();

//Henter brukerens påmeldte seminarer
router.post('/getEnlistedSeminars', async (req, res) => {
    if(req.body.token !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid 
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }
                let getQuery = "SELECT seminar.seminarid, navn, adresse, oppstart FROM seminar, pamelding WHERE seminar.seminarid = pamelding.seminarid AND brukerid = ? AND oppstart > CURRENT_DATE() ORDER BY oppstart ASC";
                let getQueryFormat = mysql.format(getQuery, [brukerid]);

                connPool.query(getQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occurred while querying, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    
                    }
                    // Returning the number of affected rows to indicate the insert went OK
                    if(results[0] !== undefined) {
                        res.send(results);

                    } else {
                        res.send(results);
                    }
                });
            });
        })

    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        
    }

    });


router.get('/getAllSeminarUpcomingData', async (req, res) => {
    try{
        mysqlpool.getConnection(function(error, connPool) {
            if(error) {
                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
            }
            connPool.query(`SELECT seminarid, seminar.bildeid, navn, adresse, oppstart, varighet, beskrivelse, tilgjengelighet, plassering, brukerid, fnavn, enavn
                                FROM seminar
                                LEFT JOIN bilde
                                ON seminar.bildeid = bilde.bildeid
                                LEFT JOIN bruker
                                ON seminar.arrangor = bruker.brukerid
                                WHERE tilgjengelighet = true AND varighet > CURRENT_DATE()
                                ORDER BY oppstart ASC`, (error, results) => {
                connPool.release();
                res.send(results);
            });
        });

    }catch(err) {
        res.json({message:err});
    }

    });

router.get('/getAllSeminarExpiredData', async (req, res) => {
    try{
        mysqlpool.getConnection(function(error, connPool) {
            if(error) {
                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
            }
            connPool.query(`SELECT seminarid, seminar.bildeid, navn, adresse, oppstart, varighet, beskrivelse, tilgjengelighet, plassering, brukerid, fnavn, enavn
                                FROM seminar
                                LEFT JOIN bilde
                                ON seminar.bildeid = bilde.bildeid
                                LEFT JOIN bruker
                                ON seminar.arrangor = bruker.brukerid
                                WHERE tilgjengelighet = true AND varighet <= CURRENT_DATE()
                                ORDER BY oppstart DESC`, (error, results) => {
                connPool.release();
                res.send(results);
            });
        });

    }catch(err) {
        res.json({message:err});
    }

    }); 


    router.post('/updateSeminar', async (req, res) => { 
        if(req.body.token !== undefined && req.body.seminarid !== undefined) {
            
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }
                let updateQuery = "UPDATE seminar SET navn = ?, oppstart = ?, varighet = ?, beskrivelse = ?, adresse = ? WHERE seminarid = ?";
                let updateQueryFormat = mysql.format(updateQuery, [req.body.title, req.body.startdate, req.body.enddate, req.body.description, req.body.address, req.body.seminarid]);

                connPool.query(updateQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occured while updating the data, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    
                    }
                    
                    if(res.status(200)) {
                        res.send(results);

                    } else {
                        res.status(400).json({"status" : "error", "message" : "En feil oppstod under oppdatering av seminaret"});
                    }         
                    
                });
            });
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
    });

    router.post('/getParticipants', async (req, res) => {
        if(req.body.token !== undefined && req.body.seminarid !== undefined) {
            
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }
                let getQuery = "SELECT bruker.brukerid, pamelding.seminarid, fnavn, enavn, pamelding.seminarid FROM bruker, pamelding WHERE bruker.brukerid = pamelding.brukerid AND pamelding.seminarid = ? ORDER BY enavn ASC";
                let getQueryFormat = mysql.format(getQuery, [req.body.seminarid]);
        
                connPool.query(getQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occured while fetching the data, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    
                    }
                    
                    if(res.status(200)) {
                        res.send(results);
        
                    } else {
                        res.status(400).json({"status" : "error", "message" : "En feil oppstod under spørring"});
                    }         
                    
                });
            });
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
    });

    router.post('/updateAvailabilitySeminar', async (req, res) => { 
        if(req.body.token !== undefined && req.body.seminarid !== undefined) {
            
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }
                let updateQuery = "UPDATE seminar SET tilgjengelighet = ? WHERE seminarid = ?";
                let updateQueryFormat = mysql.format(updateQuery, [req.body.availability, req.body.seminarid]);

                connPool.query(updateQueryFormat, (error, results) => {
                    connPool.release();
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
            });
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
    });
    
    router.post('/postEnlist', async (req, res) => {
        let brukerid = undefined;
        if (req.body.token !== undefined && req.body.seminarid !== undefined) {
            verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
                brukerid = resAuth.brukerid

                mysqlpool.getConnection(function(error, connPool) {
                    if(error) {
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    }
                    let insertQuery = "INSERT INTO pamelding(seminarid, brukerid) VALUES(?, ?)";
                    let insertQueryFormat = mysql.format(insertQuery, [req.body.seminarid, brukerid]);
                    connPool.query(insertQueryFormat, (error, results) => {
                        connPool.release();
                        if (error) {
                            console.log("An error occurred while deleting an interest, details: " + error.errno + ", " + error.sqlMessage)
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    
                        }
                        
                        // Returnerer påvirkede rader
                        if(res.status(200)) {
                            res.send(results);
                            
                        } else {
                            res.status(400).json({"status" : "error", "message" : "En feil oppstod under spørring"});
                        }   
                    });      
                });      
            })
            } else {
                res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
            }
    });
    
    router.post('/deleteEnlist', async (req, res) => {
        let brukerid = undefined;
        if (req.body.token !== undefined && req.body.seminarid !== undefined) {
            verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
                brukerid = resAuth.brukerid
                mysqlpool.getConnection(function(error, connPool) {
                    if(error) {
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    }
                    let insertQuery = "DELETE FROM pamelding WHERE seminarid = ? AND brukerid = ?";
                    let insertQueryFormat = mysql.format(insertQuery, [req.body.seminarid, brukerid]);
                    connPool.query(insertQueryFormat, (error, results) => {
                        connPool.release();
                        if (error) {
                            console.log("An error occurred while deleting an interest, details: " + error.errno + ", " + error.sqlMessage)
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    
                        }
                        
                        // Returnerer påvirkede rader
                        if(res.status(200)) {
                            res.send(results);
                            
                        } else {
                            res.status(400).json({"status" : "error", "message" : "En feil oppstod under spørring"});
                        }   
                    });      
                });      
            })
            } else {
                res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
            }
    });
    
    
    router.post('/', async (req, res) => {
        if(req.body.emnekode !== undefined && req.body.navn !== undefined && req.body.beskrivelse !== undefined && req.body.semester !== undefined
            && req.body.studiepoeng !== undefined && req.body.lenke !== undefined) {

            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }
                let insertQuery = "INSERT INTO seminar (bildeid, arrangor, adresse, oppstart, varighet, beskrivelse, tilgjengelighet) VALUES (?, ?, ?, ?, ?, ?)";
                let insertQueryFormat = mysql.format(insertQuery, [req.body.emnekode, req.body.navn, req.body.beskrivelse, req.body.semester, req.body.studiepoeng, req.body.lenke]);

                connPool.query(insertQueryFormat, (error, results) => {
                    connPool.release();
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
            });

    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
       }
    });


router.post('/submitSeminar', (req, res) => {
    if(req.body.title !== undefined && req.body.startdate !== undefined && req.body.enddate !== undefined && req.body.address !== undefined && req.body.description !== undefined && req.body.token !== undefined) {
        // Kun innloggede brukere skal kunne opprette et seminar, verifiserer authtoken og IP
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then(function(response) {
            if(response.authenticated) {
                // Bruker er innlogget med gyldig token og IP
                if(response.usertype.toString() !== process.env.ACCESS_STUDENT) {
                    // Bruker er ikke av type Student
                    mysqlpool.getConnection(function(error, connPool) {
                        if(error) {
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }
                        
                        // Sjekker om et bilde skal opplastes
                        if(req.files) {
                            // Oppretter seminar med bilde
                            let insertSeminarQuery = "INSERT INTO seminar(navn, arrangor, adresse, oppstart, varighet, beskrivelse, tilgjengelighet) VALUES(?, ?, ?, ?, ?, ?, ?)";
                            let insertSeminarQueryFormat = mysql.format(insertSeminarQuery, [req.body.title, response.brukerid, req.body.address, req.body.startdate, req.body.enddate, req.body.description, (req.body.availability === "true") ? 1 : 0]);
                    
                            connPool.query(insertSeminarQueryFormat, (error, insertedSeminar) => {
                                if (error) {
                                    connPool.release();
                                    console.log("En feil oppstod ved oppretting av nytt seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                }
                                
                                if(insertedSeminar.affectedRows > 0) {
                                    // Bruker har oppgitt et bilde som skal lastes opp
                                    const opplastetFilnavn = req.files.image.name;
                                    const filtype = opplastetFilnavn.substring(opplastetFilnavn.lastIndexOf('.'));
                                    const filnavn = "seminar" + insertedSeminar.insertId + filtype;

                                    // valider at filen er .jpg, .jpeg, .png eller .jfif
                                    if (filtype !== '.jpg' && filtype !== '.jpeg' && filtype !== '.png' && filtype !== ".jfif") {
                                        return res.json({"status" : "error", "message" : "Seminarbilder må være av filtype .jpg, .jpeg, .png, eller .jfif"})
                                    } else {
                                        // Filtype OK
                                        const opplastetBilde = req.files.image;
                                        opplastetBilde.mv(path.join(__dirname, process.env.USER_IMG_UPLOAD_PATH) + filnavn);
    
                                        // Oppretter referanse til bilde og kobler mot seminar
                                        let insertImageQuery = "INSERT INTO bilde(plassering) VALUES(?)";
                                        let insertImageQueryFormat = mysql.format(insertImageQuery, [filnavn]);
                                
                                        connPool.query(insertImageQueryFormat, (error, insertedImage) => {
                                            if (error) {
                                                connPool.release();
                                                console.log("En feil oppstod ved oppretting av nytt bilde til et seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                            }
                                            
                                            if(insertedImage.affectedRows > 0) {
                                                // Oppretter referanse til bilde og kobler mot seminar
                                                let insertQuery = "UPDATE seminar SET bildeid = ? WHERE seminarid = ?";
                                                let insertQueryFormat = mysql.format(insertQuery, [insertedImage.insertId, insertedSeminar.insertId]);
                                        
                                                connPool.query(insertQueryFormat, (error, results) => {
                                                    // Løser ut kobling til database nå som alle spørringer er ferdige
                                                    connPool.release();
                                                    if (error) {
                                                        console.log("En feil oppstod ved kobling av bilde og seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                                        return res.json({ "status" : "info", "message" : "Seminaret er opprettet, men feil oppstod ved lagring av bilde" });
                                                    }
                                                    
                                                    if(results.affectedRows > 0) {
                                                        return res.json({ "status" : "success", "seminarid" : insertedSeminar.insertId});
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            // Oppretter seminar uten bilde
                            let insertQuery = "INSERT INTO seminar(navn, arrangor, adresse, oppstart, varighet, beskrivelse, tilgjengelighet) VALUES(?, ?, ?, ?, ?, ?, ?)";
                            let insertQueryFormat = mysql.format(insertQuery, [req.body.title, response.brukerid, req.body.address, req.body.startdate, req.body.enddate, req.body.description, (req.body.availability === "true") ? 1 : 0]);
                    
                            connPool.query(insertQueryFormat, (error, insertedSeminar) => {
                                connPool.release();
                                if (error) {
                                    console.log("En feil oppstod under registrering av nytt seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                }
                                
                                if(insertedSeminar.affectedRows > 0) {
                                    return res.json({ "status" : "success", "seminarid" : insertedSeminar.insertId});
                                }
                            });
                        }
                    });
                } else {
                    // Studenter kan ikke opprette ett seminar
                    console.log("En innlogget bruker uten riktige tilganger har forsøkt å opprette et seminar, brukerens ID: " + response.brukerid);
                    return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
                }
            } else {
                // Authtoken er ikke gyldig / IP-adresse passer ikke authtoken
                return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
            }
        })
    } else {
        // Et av de påkrevde feltene er ikke tilstede i forspørselen
        return res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"})
    }
}); 


module.exports = router;