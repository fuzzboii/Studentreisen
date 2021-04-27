const { connection } = require('../db');
const mysql = require('mysql');
const { verifyAuth } = require('../global/CommonFunctions');
const router = require('express').Router();  

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

// Henter personalia til innlogget bruker //
router.post('/getBrukerbilde', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid 
            let getQuery = "SELECT plassering FROM profilbilde WHERE brukerid = ?";
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

// Legg til seminar på CV
router.post('/postCVSeminar', async (req, res) => {
    let brukerid = undefined
    if (req.body.token !== undefined && req.body.innlegg !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid
            let updateQuery = "INSERT INTO cv_seminar(brukerid, innlegg, datoFra, datoTil) VALUES(?, ?, ?, ?)";
            let updateQueryFormat = mysql.format(updateQuery, [brukerid, req.body.seminarInnlegg, req.body.seminarDatoFra, req.body.seminarDatoTil]);
            connection.query(updateQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occured while updating the users email, details: " + error.errno + ", " + error.sqlMessage)
                    return res.jason({ "status" : "error", "message" : "en intern feil oppstod, vennligst forsøk igjen senere" })
                }

                if(results.length > 0) {
                    return res.json({results});
                } else {
                    return res.json({"status" : "error", "message" : "En feil oppstod under oppdatering av brukerens email"})
                }
            })
        })
    } else {
        res.status(400).json({"stauts" : "error", "message" : "Ikke tilstrekkelig data"})
    }
});

// Legg til utdanning på CV
router.post('/postCVEducation', async (req, res) => {
    let brukerid = undefined
    if (req.body.token !== undefined && req.body.innlegg !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid
            let updateQuery = "INSERT INTO cv_education(brukerid, innlegg, datoFra, datoTil) VALUES(?, ?, ?, ?)";
            let updateQueryFormat = mysql.format(updateQuery, [brukerid, req.body.educationInnlegg, req.body.educationDatoFra, req.body.educationDatoTil]);
            connection.query(updateQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occured while updating the users email, details: " + error.errno + ", " + error.sqlMessage)
                    return res.jason({ "status" : "error", "message" : "en intern feil oppstod, vennligst forsøk igjen senere" })
                }

                if(results.length > 0) {
                    return res.json({results});
                } else {
                    return res.json({"status" : "error", "message" : "En feil oppstod under oppdatering av brukerens email"})
                }
            })
        })
    } else {
        res.status(400).json({"stauts" : "error", "message" : "Ikke tilstrekkelig data"})
    }
});

// Legg til seminar på CV
router.post('/postCVWork', async (req, res) => {
    let brukerid = undefined
    if (req.body.token !== undefined && req.body.innlegg !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid
            let updateQuery = "INSERT INTO cv_work(brukerid, innlegg, datoFra, datoTil) VALUES(?, ?, ?, ?)";
            let updateQueryFormat = mysql.format(updateQuery, [brukerid, req.body.workInnlegg, req.body.workDatoFra, req.body.workDatoTil]);
            connection.query(updateQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occured while updating the users email, details: " + error.errno + ", " + error.sqlMessage)
                    return res.jason({ "status" : "error", "message" : "en intern feil oppstod, vennligst forsøk igjen senere" })
                }

                if(results.length > 0) {
                    return res.json({results});
                } else {
                    return res.json({"status" : "error", "message" : "En feil oppstod under oppdatering av brukerens email"})
                }
            })
        })
    } else {
        res.status(400).json({"stauts" : "error", "message" : "Ikke tilstrekkelig data"})
    }
});

// Legg til annet på CV
router.post('/postCVOther', async (req, res) => {
    let brukerid = undefined
    if (req.body.token !== undefined && req.body.innlegg !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid
            let updateQuery = "INSERT INTO cv_other(brukerid, innlegg, datoFra, datoTil) VALUES(?, ?, ?, ?)";
            let updateQueryFormat = mysql.format(updateQuery, [brukerid, req.body.otherInnlegg, req.body.otherDatoFra, req.body.otherDatoTil]);
            connection.query(updateQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occured while updating the users email, details: " + error.errno + ", " + error.sqlMessage)
                    return res.jason({ "status" : "error", "message" : "en intern feil oppstod, vennligst forsøk igjen senere" })
                }

                if(results.length > 0) {
                    return res.json({results});
                } else {
                    return res.json({"status" : "error", "message" : "En feil oppstod under oppdatering av brukerens email"})
                }
            })
        })
    } else {
        res.status(400).json({"stauts" : "error", "message" : "Ikke tilstrekkelig data"})
    }
});

// // Henter seminar innlegg til cv for innlogget bruker //
router.post('/getCVSeminar', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid 
            let getQuery = "SELECT cv_seminar_id, brukerid, innlegg, datoFra, datoTil FROM cv_seminar WHERE brukerid = ? ORDER BY datoFra ASC";
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

// // Henter utdanning innlegg til cv for innlogget bruker //
router.post('/getCVEducation', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid 
            let getQuery = "SELECT cv_education_id, brukerid, innlegg, datoFra, datoTil FROM cv_education WHERE brukerid = ? ORDER BY datoFra ASC";
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

// // Henter arbeid innlegg til cv for innlogget bruker //
router.post('/getCVWork', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid 
            let getQuery = "SELECT cv_work_id, brukerid, innlegg, datoFra, datoTil FROM cv_work WHERE brukerid = ? ORDER BY datoFra ASC";
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

// // Henter andre innlegg til cv for innlogget bruker //
router.post('/getCVOther', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid 
            let getQuery = "SELECT cv_other_id, brukerid, innlegg, datoFra, datoTil FROM cv_other WHERE brukerid = ? ORDER BY datoFra ASC";
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

module.exports = router;