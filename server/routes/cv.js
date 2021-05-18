const mysqlpool = require('../db').pool;
const mysql = require('mysql');
const { verifyAuth } = require('../global/CommonFunctions');
const router = require('express').Router();  

// Henter personalia til innlogget bruker //
router.post('/getBruker', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid 
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }
                
                let getQuery = "SELECT fnavn, enavn, telefon, email FROM bruker WHERE brukerid = ?";
                let getQueryFormat = mysql.format(getQuery, [brukerid]);
                connPool.query(getQueryFormat, (error, results) => {
                    connPool.release();
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
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid 
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }

                let getQuery = "SELECT plassering FROM profilbilde WHERE brukerid = ?";
                let getQueryFormat = mysql.format(getQuery, [brukerid]);
                connPool.query(getQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occurred while fetching user details, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                
                    }
                    
                    // Returnerer påvirkede rader
                    if(results[0] !== undefined) {
                        return res.json({results});
                    } else {
                        return res.json({"status" : "error", "message" : "En feil oppstod under henting av brukerbilde"});
                    }
                });       
            });       
        })
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
});


// Legg til seminar på CV
router.post('/postCVSeminar', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined && req.body.opprett_cv_innlegg !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }
                let updateQuery = "INSERT INTO cv_seminar(brukerid, innlegg, datoFra, datoTil) VALUES(?, ?, ?, ?)";
                let updateQueryFormat = mysql.format(updateQuery, [brukerid, req.body.opprett_cv_innlegg, (req.body.opprettdatoFra === '') ? null : req.body.opprettdatoFra, (req.body.opprettdatoTil === '') ? null : req.body.opprettdatoTil]);
                connPool.query(updateQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occured while adding to CV, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "en intern feil oppstod, vennligst forsøk igjen senere" })
                    }
                    // Returnerer påvirkede rader
                    if(results) {
                        return res.json({"status" : "success", "message" : "Data ble lagt inn i seminar listen"});
                    } else {
                        return res.json({"status" : "error", "message" : "Ingen data ble lagt inn i seminar listen"});
                    }
                })
            })
        })
    } else {
        res.status(400).json({"stauts" : "error", "message" : "Ikke tilstrekkelig data"})
    }
});

// Legg til utdanning på CV
router.post('/postCVEducation', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined && req.body.opprett_cv_innlegg !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }

                let updateQuery = "INSERT INTO cv_education(brukerid, innlegg, datoFra, datoTil) VALUES(?, ?, ?, ?)";
                let updateQueryFormat = mysql.format(updateQuery, [brukerid, req.body.opprett_cv_innlegg, (req.body.opprettdatoFra === '') ? null : req.body.opprettdatoFra, (req.body.opprettdatoTil === '') ? null : req.body.opprettdatoTil]);
                connPool.query(updateQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occured while  adding to CV, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "en intern feil oppstod, vennligst forsøk igjen senere" })
                    }
                    // Returnerer påvirkede rader
                    if(results) {
                        return res.json({"status" : "success", "message" : "Data ble lagt inn i utdanning listen"});
                    } else {
                        return res.json({"status" : "error", "message" : "Ingen data ble lagt inn i utdanning listen"});
                    }
                })
            })
        })
    } else {
        res.status(400).json({"stauts" : "error", "message" : "Ikke tilstrekkelig data"})
    }
});

// Legg til seminar på CV
router.post('/postCVWork', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined && req.body.opprett_cv_innlegg !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }
                let updateQuery = "INSERT INTO cv_work(brukerid, innlegg, datoFra, datoTil) VALUES(?, ?, ?, ?)";
                let updateQueryFormat = mysql.format(updateQuery, [brukerid, req.body.opprett_cv_innlegg, (req.body.opprettdatoFra === '') ? null : req.body.opprettdatoFra, (req.body.opprettdatoTil === '') ? null : req.body.opprettdatoTil]);
                connPool.query(updateQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occured while  adding to CV, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "en intern feil oppstod, vennligst forsøk igjen senere" })
                    }
                    // Returnerer påvirkede rader
                    if(results) {
                        return res.json({"status" : "success", "message" : "Data ble lagt inn i arbeidserfaring listen"});
                    } else {
                        return res.json({"status" : "error", "message" : "Ingen data ble lagt inn i arbeidserfaring listen"});
                    }
                })
            })
        })
    } else {
        res.status(400).json({"stauts" : "error", "message" : "Ikke tilstrekkelig data"})
    }
});

// Legg til annet på CV
router.post('/postCVOther', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined && req.body.opprett_cv_innlegg !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }
                let updateQuery = "INSERT INTO cv_other(brukerid, innlegg, datoFra, datoTil) VALUES(?, ?, ?, ?)";
                let updateQueryFormat = mysql.format(updateQuery, [brukerid, req.body.opprett_cv_innlegg, (req.body.opprettdatoFra === '') ? null : req.body.opprettdatoFra, (req.body.opprettdatoTil === '') ? null : req.body.opprettdatoTil]);
                connPool.query(updateQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occured while  adding to CV, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "en intern feil oppstod, vennligst forsøk igjen senere" })
                    }
                    // Returnerer påvirkede rader
                    if(results) {
                        return res.json({"status" : "success", "message" : "Data ble lagt inn i annet listen"});
                    } else {
                        return res.json({"status" : "error", "message" : "Ingen data ble lagt inn i annet listen"});
                    }
                })
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
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                } 
                let getQuery = "SELECT cv_seminar_id, brukerid, innlegg, datoFra, datoTil FROM cv_seminar WHERE brukerid = ? ORDER BY datoFra ASC";
                let getQueryFormat = mysql.format(getQuery, [brukerid]);
                connPool.query(getQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occurred while fetching user seminar list, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                
                    }
                    
                    // Returnerer påvirkede rader
                    if(results.length > 0) {
                        return res.json({results});
                    } else {
                        return res.json({"status" : "error", "message" : "Ingen data funnet i brukerens innlegg i seminar listen"});
                    }
                });       
            })
        })
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
});

router.post('/slettInnleggSem', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined && req.body.cv_seminar_id !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid 
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                } 
                let getQuery = "DELETE FROM cv_seminar WHERE brukerid = ? AND cv_seminar_id = ?";
                let getQueryFormat = mysql.format(getQuery, [brukerid, req.body.cv_seminar_id]);
                connPool.query(getQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occurred while attempting to delete the post, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                
                    }
                    
                    // Returnerer påvirkede rader
                    if(results) {
                        return res.json({"status" : "success", "message" :"Innlegget ble slettet"});
                    }
                });         
            })
        })
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
});

// // Henter utdanning innlegg til cv for innlogget bruker //
router.post('/getCVEducation', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined)  {
        console.log(req.body.token)
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid 
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                } 
                let getQuery = "SELECT cv_education_id, brukerid, innlegg, datoFra, datoTil FROM cv_education WHERE brukerid = ? ORDER BY datoFra ASC";
                let getQueryFormat = mysql.format(getQuery, [brukerid]);
                connPool.query(getQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occurred while fetching user education list, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                
                    }
                    
                    // Returnerer påvirkede rader
                    if(results.length > 0) {
                        return res.json({results});
                    } else {
                        return res.json({"status" : "error", "message" : "Ingen data funnet i brukerens innlegg i utdannings listen"});
                    }
                });         
            })
        })
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
});

// Sletter innlegg i CV for utdanning
router.post('/slettInnleggEdu', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined && req.body.cv_education_id !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid 
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                } 
                let getQuery = "DELETE FROM cv_education WHERE brukerid = ? AND cv_education_id = ?";
                let getQueryFormat = mysql.format(getQuery, [brukerid, req.body.cv_education_id]);
                connPool.query(getQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occurred while attempting to delete the post, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                
                    }
                    
                    // Returnerer påvirkede rader
                    if(results) {
                        return res.json({"status" : "success", "message" :"Innlegget ble slettet"});
                    }
                });         
            })
        })
    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
    }
});

// // Henter arbeid innlegg til cv for innlogget bruker //
router.post('/getCVWork', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid 
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                } 
                let getQuery = "SELECT cv_work_id, brukerid, innlegg, datoFra, datoTil FROM cv_work WHERE brukerid = ? ORDER BY datoFra ASC";
                let getQueryFormat = mysql.format(getQuery, [brukerid]);
                connPool.query(getQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occurred while fetching user work list, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                
                    }
                    
                    // Returnerer påvirkede rader
                    if(results.length > 0) {
                        return res.json({results});
                    } else {
                        return res.json({"status" : "error", "message" : "Ingen data funnet i brukerens jobberfaringer i listen"});
                    }
                });        
            })
        })
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
});

router.post('/slettInnleggWork', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined && req.body.cv_work_id !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid 
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                } 
                let getQuery = "DELETE FROM cv_work WHERE brukerid = ? AND cv_work_id = ?";
                let getQueryFormat = mysql.format(getQuery, [brukerid, req.body.cv_work_id]);
                connPool.query(getQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occurred while attempting to delete the post, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                
                    }
                    
                    // Returnerer påvirkede rader
                    if(results) {
                        return res.json({"status" : "success", "message" :"Innlegget ble slettet"});
                    }
                });         
            })
        })
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
});

// // Henter andre innlegg til cv for innlogget bruker //
router.post('/getCVOther', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid 
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                } 
                let getQuery = "SELECT cv_other_id, brukerid, innlegg, datoFra, datoTil FROM cv_other WHERE brukerid = ? ORDER BY datoFra ASC";
                let getQueryFormat = mysql.format(getQuery, [brukerid]);
                connPool.query(getQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occurred while fetching user other list, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                
                    }
                    
                    // Returnerer påvirkede rader
                    if(results.length > 0) {
                        return res.json({results});
                    } else {
                        return res.json({"status" : "error", "message" : "Ingen data funnet i brukerens innlegg i annet listen"});
                    }
                });          
            })
        })
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
});

router.post('/slettInnleggOther', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined && req.body.cv_other_id !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid 
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                } 
                let getQuery = "DELETE FROM cv_other WHERE brukerid = ? AND cv_other_id = ?";
                let getQueryFormat = mysql.format(getQuery, [brukerid, req.body.cv_other_id]);
                connPool.query(getQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occurred while attempting to delete the post, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                
                    }
                    
                    // Returnerer påvirkede rader
                    if(results) {
                        return res.json({"status" : "success", "message" :"Innlegget ble slettet"});
                    }
                });        
            })
        })
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
        }
});

// Redigerer innlegg i CV for utdanning
router.post('/redigerInnleggEdu', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined && req.body.cv_education_id !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid 
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                } 
                let getQuery = "UPDATE cv_education SET datoFra = ?, datoTil= ?, innlegg= ? WHERE brukerid= ? AND cv_education_id= ?";
                let getQueryFormat = mysql.format(getQuery, [(req.body.datoFra === 'Invalid date') ? null : req.body.datoFra, (req.body.datoTil === 'Invalid date') ? null : req.body.datoTil, req.body.innlegg, brukerid, req.body.cv_education_id]);
                connPool.query(getQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occurred while attempting to edit the post, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                
                    }
                    
                    // Returnerer påvirkede rader
                    if(results) {
                        return res.json({"status" : "success", "message" : "Innlegget er redigert!"});
                    } 
                });         
            })
        })
    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
    }
});

// Redigerer innlegg i CV for seminar
router.post('/redigerInnleggSem', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined && req.body.cv_seminar_id !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid 
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                } 
                let getQuery = "UPDATE cv_seminar SET datoFra = ?, datoTil= ?, innlegg= ? WHERE brukerid= ? AND cv_seminar_id= ?";
                let getQueryFormat = mysql.format(getQuery, [(req.body.datoFra === 'Invalid date') ? null : req.body.datoFra, (req.body.datoTil === 'Invalid date') ? null : req.body.datoTil, req.body.innlegg, brukerid, req.body.cv_seminar_id]);
                connPool.query(getQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occurred while attempting to edit the post, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                
                    }
                    
                    // Returnerer påvirkede rader
                    if(results) {
                        return res.json({"status" : "success", "message" : "Innlegget er redigert!"});
                    } 
                });         
            })
        })
    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
    }
});

// Redigerer innlegg i CV for jobberfaring
router.post('/redigerInnleggWork', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined && req.body.cv_work_id !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid 
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                } 
                let getQuery = "UPDATE cv_work SET datoFra = ?, datoTil= ?, innlegg= ? WHERE brukerid= ? AND cv_work_id= ?";
                let getQueryFormat = mysql.format(getQuery, [(req.body.datoFra === 'Invalid date') ? null : req.body.datoFra, (req.body.datoTil === 'Invalid date') ? null : req.body.datoTil, req.body.innlegg, brukerid, req.body.cv_work_id]);
                connPool.query(getQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occurred while attempting to edit the post, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                
                    }
                    
                    // Returnerer påvirkede rader
                    if(results) {
                        return res.json({"status" : "success", "message" : "Innlegget er redigert!"});
                    } 
                });         
            })
        })
    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
    }
});

// Redigerer innlegg i CV for annet
router.post('/redigerInnleggOther', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined && req.body.cv_other_id !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then( resAuth => {
            brukerid = resAuth.brukerid 
            mysqlpool.getConnection(function(error, connPool) {
                if(error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                } 
                let getQuery = "UPDATE cv_other SET datoFra = ?, datoTil= ?, innlegg= ? WHERE brukerid= ? AND cv_other_id= ?";
                let getQueryFormat = mysql.format(getQuery, [(req.body.datoFra === 'Invalid date') ? null : req.body.datoFra, (req.body.datoTil === 'Invalid date') ? null : req.body.datoTil, req.body.innlegg, brukerid, req.body.cv_other_id]);
                connPool.query(getQueryFormat, (error, results) => {
                    connPool.release();
                    if (error) {
                        console.log("An error occurred while attempting to edit the post, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                
                    }
                    
                    // Returnerer påvirkede rader
                    if(results) {
                        return res.json({"status" : "success", "message" : "Innlegget er redigert!"});
                    } 
                });         
            })
        })
    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
    }
});

module.exports = router;