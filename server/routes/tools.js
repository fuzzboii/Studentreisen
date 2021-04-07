const { connection } = require('../db');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { registerValidation } = require('../validation');
const { verifyAuth, sendEmail } = require('../global/CommonFunctions');

const router = require('express').Router();

// Bruker
router.post('/getAllUserData', async (req, res) => {
    if(req.body !== undefined && req.body.token !== undefined) {
        verifyAuth(req.body.token).then(function(response) {
            if(response.authenticated) {
                // Kun Administrator skal kunne se oversikten
                if(response.usertype.toString() === process.env.ACCESS_ADMINISTRATOR) {
                    let getDataQuery = "SELECT brukerid, fnavn, enavn, niva, telefon, email FROM bruker";
                    let getDataQueryFormat = mysql.format(getDataQuery);

                    connection.query(getDataQueryFormat, (error, results) => {
                        if (error) {
                            console.log("En feil oppstod ved henting av all brukerdata: " + error.errno + ", " + error.sqlMessage)
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }   
                        
                        if(results[0] !== undefined) {
                            return res.json({results});
                        } else {
                            return res.json({});
                        }
                    });
                } else {
                    // Bruker har ikke tilgang, loggfører
                    //console.log("En innlogget bruker uten riktige tilganger har forsøkt å se brukeroversikten, brukerens ID: " + results[0].brukerid)
                    return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
                }
            } else {
                return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
            }
        });
    } else {
        return res.status(403).send();
    }
});

router.post('/newUser', async (req, res) => {
    if(req.body.bruker !== undefined && req.body.token !== undefined) {
        const validation = registerValidation({email: req.body.bruker.email, fnavn: req.body.bruker.fnavn, enavn: req.body.bruker.enavn, password: "", password2: ""});
        
        if(validation.error) {
            return res.json({success: false});
        }

        verifyAuth(req.body.token).then(function(response) {
            if(response.authenticated) {
                // Kun Administrator skal kunne manuelt opprette en bruker
                if(response.usertype.toString() === process.env.ACCESS_ADMINISTRATOR) {
                    try {
                        // Genererer en string som midlertidig passord
                        const pass = Math.random().toString(16).substr(2, 10);

                        // Salter og hasher passordet
                        bcrypt.genSalt(10).then(function(genSalt) {
                            bcrypt.hash(pass, genSalt).then(function(genPass) {
                                const hashedPW = genPass;

                                // Sjekker om e-posten allerede eksisterer
                                let checkQuery = "SELECT email FROM bruker WHERE email = ?";
                                let checkQueryFormat = mysql.format(checkQuery, [req.body.bruker.email]);
                    
                                connection.query(checkQueryFormat, (error, results) => {
                                    if (error) {
                                        console.log("En feil oppstod ved henting av e-post under registrering, detaljer: " + error.errno + ", " + error.sqlMessage)
                                        return res.json({success: false});
                                    }
                    
                                    if(results.length > 0) {
                                        return res.json({success: false});
                                    } else {

                                        // Oppretter en e-post med info til brukeren
                                        const subject = "Ny bruker - Studentreisen";
                                        const body = 'Hei ' + req.body.bruker.fnavn + '!\n\nDu har mottatt denne eposten fordi en administrator har opprettet en bruker for deg.\n\n' +
                                                    'Ditt midlertidige passord: ' + pass + '\n\n' + 
                                                    'Du kan logge inn her: http://localhost:3000/login. Du vil bli bedt om å oppgi et nytt passord ved innlogging.\n\n' + 
                                                    'Mvh\nStudentreisen';
        
                                        sendEmail(req.body.bruker.email, subject, body);

                                        // Legg til brukeren
                                        let insertQuery = "INSERT INTO bruker(niva, fnavn, enavn, email, pwd, pwd_temp) VALUES(?, ?, ?, ?, ?, 1)";
                                        let insertQueryFormat = mysql.format(insertQuery, [req.body.bruker.niva, req.body.bruker.fnavn, req.body.bruker.enavn, req.body.bruker.email.toLowerCase(), hashedPW]);
                                
                                        connection.query(insertQueryFormat, (error, results) => {
                                            if (error) {
                                                console.log("En feil oppstod under registrering av ny bruker, detaljer: " + error.errno + ", " + error.sqlMessage)
                                                return res.json({success: false});
                                            }
                                            
                                            if(results.affectedRows > 0) {
                                                // Bruker opprettet
                                                return res.json({success: true});
                                            } else {
                                                return res.json({success: false});
                                            }
                                        });
                                    }
                                });
                            });
                        });
                    } catch(e) {
                        return res.json({success: false});
                    }
                } else {
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


router.post('/updateUser', async (req, res) => {
    if(req.body.nyBruker !== undefined && req.body.gammelBruker !== undefined && req.body.token !== undefined) {
        const validation = registerValidation({email: req.body.nyBruker.email, fnavn: req.body.nyBruker.fnavn, enavn: req.body.nyBruker.enavn, password: "", password2: ""});
        
        if(validation.error) {
            return res.json({success: false});
        }

        verifyAuth(req.body.token).then(function(response) {
            if(response.authenticated) {
                // Kun Administrator skal kunne manuelt endre en bruker
                if(response.usertype.toString() === process.env.ACCESS_ADMINISTRATOR) {
                    try {
                        // Om telefonnummer ikke er lagt inn, endre spørringen
                        let updateQuery;
                        let updateQueryFormat;
                        if(req.body.nyBruker.telefon !== undefined && req.body.nyBruker.telefon !== "") {
                            updateQuery = "UPDATE bruker SET niva = ?, fnavn = ?, enavn = ?, email = ?, telefon = ? WHERE brukerid = ?";
                            updateQueryFormat = mysql.format(updateQuery, [req.body.nyBruker.niva, req.body.nyBruker.fnavn, req.body.nyBruker.enavn, req.body.nyBruker.email.toLowerCase(), req.body.nyBruker.telefon, req.body.nyBruker.brukerid]);
                        } else {
                            updateQuery = "UPDATE bruker SET niva = ?, fnavn = ?, enavn = ?, email = ?, telefon = NULL WHERE brukerid = ?";
                            updateQueryFormat = mysql.format(updateQuery, [req.body.nyBruker.niva, req.body.nyBruker.fnavn, req.body.nyBruker.enavn, req.body.nyBruker.email.toLowerCase(), req.body.nyBruker.brukerid]);
                        }

                        // Endre brukeren
                        connection.query(updateQueryFormat, (error, results) => {
                            if (error) {
                                console.log("En feil oppstod under endring av eksisterende bruker, detaljer: " + error.errno + ", " + error.sqlMessage)
                                return res.json({success: false});
                            }
                            
                            if(results.affectedRows > 0) {
                                // Bruker endret
                                return res.json({success: true});
                            } else {
                                return res.json({success: false});
                            }
                        });
                    } catch(e) {
                        return res.json({success: false});
                    }
                } else {
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


router.post('/deleteUser', async (req, res) => {
    if(req.body.bruker !== undefined && req.body.token !== undefined) {
        if(req.body.bruker.niva !== undefined && req.body.bruker.niva.toString() !== process.env.ACCESS_ADMINISTRATOR) {
            verifyAuth(req.body.token).then(function(response) {
                if(response.authenticated) {
                    // Kun Administrator skal kunne slette en bruker
                    if(response.usertype.toString() === process.env.ACCESS_ADMINISTRATOR) {
                        try {
                            // Sletter alle koblinger som er "tillatt" å slette
                            let deleteLoginQuery = "DELETE FROM login_token WHERE gjelderfor = ?";
                            let deleteLoginQueryFormat = mysql.format(deleteLoginQuery, [req.body.bruker.brukerid]);
                        
                            // Sletter kobling
                            connection.query(deleteLoginQueryFormat, (error, results) => {
                                if (error) {
                                    console.log("En feil oppstod under sletting av alle koblinger til en eksisterende bruker, detaljer: " + error.errno + ", " + error.sqlMessage)
                                    return res.json({success: false});
                                }

                                // Sletter alle koblinger som er "tillatt" å slette
                                let deleteGPQuery = "DELETE FROM glemtpassord_token WHERE gjelderfor = ?";
                                let deleteGPQueryFormat = mysql.format(deleteGPQuery, [req.body.bruker.brukerid]);
                            
                                // Sletter kobling
                                connection.query(deleteGPQueryFormat, (error, results) => {
                                    if (error) {
                                        console.log("En feil oppstod under sletting av alle koblinger til en eksisterende bruker, detaljer: " + error.errno + ", " + error.sqlMessage)
                                        return res.json({success: false});
                                    }
                                
                                    let deleteQuery = "DELETE FROM bruker WHERE brukerid = ? AND fnavn = ? AND enavn = ? AND email = ?";
                                    let deleteQueryFormat = mysql.format(deleteQuery, [req.body.bruker.brukerid, req.body.bruker.fnavn, req.body.bruker.enavn, req.body.bruker.email.toLowerCase()]);
                                
                                    // Endre brukeren
                                    connection.query(deleteQueryFormat, (error, results) => {
                                        if (error) {
                                            console.log("En feil oppstod under sletting av eksisterende bruker, detaljer: " + error.errno + ", " + error.sqlMessage)
                                            return res.json({success: false});
                                        }
                                        
                                        if(results.affectedRows > 0) {
                                            // Bruker slettet
                                            return res.json({success: true});
                                        } else {
                                            return res.json({success: false});
                                        }
                                    });
                                });
                            });
                        } catch(e) {
                            return res.json({success: false});
                        }
                    } else {
                        return res.json({success: false});
                    }
                } else {
                    return res.json({success: false});
                }
            })
        } else {
            return res.status(403).send();
        }
    } else {
        return res.status(403).send();
    }
});

// Kurs
router.post('/getAllCourseData', async (req, res) => {
    if(req.body !== undefined && req.body.token !== undefined) {
        verifyAuth(req.body.token).then(function(response) {
            if(response.authenticated) {
                // Kun Administrator skal kunne se oversikten
                if(response.usertype.toString() === process.env.ACCESS_ADMINISTRATOR) {
                    let getDataQuery = "SELECT emnekode, navn, beskrivelse, språk, semester, studiepoeng, lenke FROM kurs";
                    let getDataQueryFormat = mysql.format(getDataQuery);

                    connection.query(getDataQueryFormat, (error, results) => {
                        if (error) {
                            console.log("En feil oppstod ved henting av all kursdata: " + error.errno + ", " + error.sqlMessage)
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }   
                        
                        if(results[0] !== undefined) {
                            return res.json({results});
                        } else {
                            return res.json({});
                        }
                    });
                } else {
                    // Bruker har ikke tilgang, loggfører
                    console.log("En innlogget bruker uten riktige tilganger har forsøkt å se kursoversikten, brukerens ID: " + results[0].brukerid)
                    return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
                }
            } else {
                return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
            }
        });
    } else {
        return res.status(403).send();
    }
});

// Seminar
router.post('/getAllSeminarData', async (req, res) => {
    if(req.body !== undefined && req.body.token !== undefined) {
        verifyAuth(req.body.token).then(function(response) {
            if(response.authenticated) {
                // Kun Emneansvarlig / Administratorere skal kunne se hele oversikten, undervisere skal kunne se egne seminar
                if(response.usertype.toString() === process.env.ACCESS_COORDINATOR || response.usertype.toString() === process.env.ACCESS_ADMINISTRATOR) {
                    let getDataQuery = "SELECT seminarid, navn, CONCAT(fnavn, ' ', enavn) as arrangornavn, adresse, oppstart, varighet, beskrivelse, tilgjengelighet FROM seminar, bruker WHERE arrangor = brukerid ORDER BY oppstart DESC";
                    let getDataQueryFormat = mysql.format(getDataQuery);

                    connection.query(getDataQueryFormat, (error, results) => {
                        if (error) {
                            console.log("En feil oppstod ved henting av all seminardata: " + error.errno + ", " + error.sqlMessage)
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }   
                        
                        if(results[0] !== undefined) {
                            return res.json({results});
                        } else {
                            return res.json({});
                        }
                    });
                } else if(response.usertype.toString() === process.env.ACCESS_LECTURER) {
                    // Hent alle seminar for underviseren
                    let getDataQuery = "SELECT seminarid, navn, CONCAT(fnavn, ' ', enavn) as arrangornavn, adresse, oppstart, varighet, beskrivelse, tilgjengelighet FROM seminar, bruker WHERE arrangor = brukerid and arrangor = ? ORDER BY oppstart DESC";
                    let getDataQueryFormat = mysql.format(getDataQuery, [response.brukerid]);

                    connection.query(getDataQueryFormat, (error, results) => {
                        if (error) {
                            console.log("En feil oppstod ved henting av all seminardata: " + error.errno + ", " + error.sqlMessage)
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }
                        
                        if(results[0] !== undefined) {
                            return res.json({results});
                        }
                    });
                } else {
                    // Bruker har ikke tilgang, loggfører
                    console.log("En innlogget bruker uten riktige tilganger har forsøkt å se seminaroversikten, brukerens ID: " + results[0].brukerid)
                    return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
                }
            } else {
                return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
            }
        });
    } else {
        return res.status(403).send();
    }
});


router.post('/deleteSeminar', async (req, res) => {
    if(req.body.seminarid !== undefined && req.body.token !== undefined && req.body.sluttdato !== undefined) {
        verifyAuth(req.body.token).then(function(response) {
            if(response.authenticated) {
                // Kun Administrator og emneansvarlig skal kunne slette hvilket som helst seminar
                if(response.usertype.toString() === process.env.ACCESS_COORDINATOR || response.usertype.toString() === process.env.ACCESS_ADMINISTRATOR) {
                    // Sjekk om sluttdatoen allerede er nådd
                    const sluttdato = new Date(req.body.sluttdato);
                    const naa = new Date();

                    if(sluttdato <= naa) {
                        // Sluttdatoen er nådd, kan slette
                        try {
                            // Sletter påmeldinger til seminaret
                            let deletePaameldingQuery = "DELETE FROM pamelding WHERE seminarid = ?";
                            let deletePaameldingQueryFormat = mysql.format(deletePaameldingQuery, [req.body.seminarid]);
                        
                            // Sletter kobling
                            connection.query(deletePaameldingQueryFormat, (error, r) => {
                                if (error) {
                                    console.log("En feil oppstod under sletting av påmeldinger til et eksisterende seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                    return res.json({success: false});
                                }
    
                                // Sletter invitasjoner til seminaret
                                let deleteInvitasjonQuery = "DELETE FROM invitasjon WHERE seminarid = ?";
                                let deleteInvitasjonQueryFormat = mysql.format(deleteInvitasjonQuery, [req.body.seminarid]);
                            
                                // Sletter kobling
                                connection.query(deleteInvitasjonQueryFormat, (error, r) => {
                                    if (error) {
                                        console.log("En feil oppstod under sletting av invitasjoner til et eksisterende seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                        return res.json({success: false});
                                    }
    
                                    let deleteQuery = "DELETE FROM seminar WHERE seminarid = ?";
                                    let deleteQueryFormat = mysql.format(deleteQuery, [req.body.seminarid]);
    
                                    // Slett seminaret
                                    connection.query(deleteQueryFormat, (error, results) => {
                                        if (error) {
                                            console.log("En feil oppstod under sletting av eksisterende seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                            return res.json({success: false});
                                        }
                                        
                                        if(results.affectedRows > 0) {
                                            // Seminar slettet
                                            if(req.body.bilde !== undefined) {
                                                // Seminaret hadde et bilde, sletter denne fra databasen og fra uploaded
                                                let deleteQuery = "DELETE FROM bilde WHERE plassering = ?";
                                                let deleteQueryFormat = mysql.format(deleteQuery, [req.body.bilde]);
    
                                                // Slett seminaret
                                                connection.query(deleteQueryFormat, (error, results) => {
                                                    if (error) {
                                                        console.log("En feil oppstod under sletting av bilde til seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                                        return res.json({success: false});
                                                    }
                                        
                                                    if(results.affectedRows > 0) {
                                                        // Fjernet fra database, sletter fil
    
                                                        const rootFolder = path.join(__dirname, '../../');
                                                        fs.unlink(rootFolder + '/public/uploaded/' + req.body.bilde, (err) => {
                                                            if(err) {
                                                                console.log("Kunne ikke slette opplastet bilde ved sletting av seminar: " + err);
                                                            }
                                                        });
    
                                                        return res.json({success: true});
                                                    } else {
                                                        return res.json({success: false});
                                                    }
                                                });
                                            } else {
                                                return res.json({success: true});
                                            }
                                        } else {
                                            return res.json({success: false});
                                        }
                                    });
                                });
                            });
                        } catch(e) {
                            return res.json({success: false});
                        }
                    } else {
                        // Sluttdato ikke nådd
                        return res.json({success: false});
                    }
                } else {
                    // Om brukeren ikke er administrator, sjekk om brukeren er eier av seminaret
                    let getDataQuery = "SELECT seminarid FROM seminar WHERE arrangor = ? and seminarid = ?";
                    let getDataQueryFormat = mysql.format(getDataQuery, [response.brukerid, req.body.seminarid]);

                    connection.query(getDataQueryFormat, (error, results) => {
                        if (error) {
                            console.log("En feil oppstod ved henting av seminar for en innlogget underviser: " + error.errno + ", " + error.sqlMessage)
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }
                        
                        if(results[0] !== undefined) {
                            // Sjekk om sluttdatoen allerede er nådd
                            const sluttdato = new Date(req.body.sluttdato);
                            const naa = new Date();

                            if(sluttdato <= naa) {
                                // Sluttdatoen er nådd, kan slette
                                try {
                                    // Sletter påmeldinger til seminaret
                                    let deletePaameldingQuery = "DELETE FROM pamelding WHERE seminarid = ?";
                                    let deletePaameldingQueryFormat = mysql.format(deletePaameldingQuery, [req.body.seminarid]);
                                
                                    // Sletter kobling
                                    connection.query(deletePaameldingQueryFormat, (error, r) => {
                                        if (error) {
                                            console.log("En feil oppstod under sletting av påmeldinger til et eksisterende seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                            return res.json({success: false});
                                        }

                                        // Sletter invitasjoner til seminaret
                                        let deleteInvitasjonQuery = "DELETE FROM invitasjon WHERE seminarid = ?";
                                        let deleteInvitasjonQueryFormat = mysql.format(deleteInvitasjonQuery, [req.body.seminarid]);
                                    
                                        // Sletter kobling
                                        connection.query(deleteInvitasjonQueryFormat, (error, r) => {
                                            if (error) {
                                                console.log("En feil oppstod under sletting av invitasjoner til et eksisterende seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                                return res.json({success: false});
                                            }

                                            let deleteQuery = "DELETE FROM seminar WHERE seminarid = ?";
                                            let deleteQueryFormat = mysql.format(deleteQuery, [req.body.seminarid]);

                                            // Slett seminaret
                                            connection.query(deleteQueryFormat, (error, results) => {
                                                if (error) {
                                                    console.log("En feil oppstod under sletting av eksisterende seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                                    return res.json({success: false});
                                                }
                                                
                                                if(results.affectedRows > 0) {
                                                    // Seminar slettet
                                                    return res.json({success: true});
                                                } else {
                                                    return res.json({success: false});
                                                }
                                            });
                                        });
                                    });
                                } catch(e) {
                                    return res.json({success: false});
                                }
                            }
                        }
                    });
                }
            } else {
                return res.json({success: false});
            }
        })
    } else {
        return res.status(403).send();
    }
});

router.post('/publicizeSeminar', async (req, res) => {
    if(req.body.seminarid !== undefined && req.body.token !== undefined && req.body.tilgjengelighet !== undefined) {
        verifyAuth(req.body.token).then(function(response) {
            if(response.authenticated) {
                // Kun Administrator og emneansvarlig skal kunne oppdatere tilgjengeligheten til hvilket som helst seminar
                if(response.usertype.toString() === process.env.ACCESS_COORDINATOR || response.usertype.toString() === process.env.ACCESS_ADMINISTRATOR) {
                    // Oppdater tilgjengeligheten

                    let updateQuery = "UPDATE seminar SET tilgjengelighet = ? WHERE seminarid = ?";
                    let updateQueryFormat = mysql.format(updateQuery, [req.body.tilgjengelighet, req.body.seminarid]);

                    connection.query(updateQueryFormat, (error, results) => {
                        if (error) {
                            console.log("En feil oppstod under publisering av eksisterende seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                            return res.json({success: false});
                        }
                        
                        if(results.affectedRows > 0) {
                            // Seminar oppdatert
                            return res.json({success: true});
                        } else {
                            return res.json({success: false});
                        }
                    });
                } else {
                    // Om brukeren ikke er administrator, sjekk om brukeren er eier av seminaret
                    let getDataQuery = "SELECT seminarid FROM seminar WHERE arrangor = ? and seminarid = ?";
                    let getDataQueryFormat = mysql.format(getDataQuery, [response.brukerid, req.body.seminarid]);

                    connection.query(getDataQueryFormat, (error, results) => {
                        if (error) {
                            console.log("En feil oppstod ved henting av seminar for en innlogget underviser: " + error.errno + ", " + error.sqlMessage)
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }
                        
                        if(results[0] !== undefined) {
                            // Oppdater tilgjengeligheten
        
                            let updateQuery = "UPDATE seminar SET tilgjengelighet = ? WHERE seminarid = ?";
                            let updateQueryFormat = mysql.format(updateQuery, [req.body.tilgjengelighet, req.body.seminarid]);
        
                            connection.query(updateQueryFormat, (error, results) => {
                                if (error) {
                                    console.log("En feil oppstod under publisering av eksisterende seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                    return res.json({success: false});
                                }
                                
                                if(results.affectedRows > 0) {
                                    // Seminar oppdatert
                                    return res.json({success: true});
                                } else {
                                    return res.json({success: false});
                                }
                            });
                        }
                    });
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