const { connection } = require('../db');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const { verifyAuth } = require('../global/CommonFunctions');
const router = require('express').Router();
const { emailValidation, passwordValidation } = require('../validation');  

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

// Henter profilbildet til innlogget bruker om det finnes
router.post('/getProfilbilde', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid
            let getQuery = "SELECT plassering FROM profilbilde WHERE brukerid = ?"
            let getQueryFormat = mysql.format(getQuery, [brukerid])
            connection.query(getQueryFormat, (error, results) => {
                if (error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" })
                }

                if (results.length > 0) {
                    return res.json({results})
                } else {
                    return res.json({"status" : "error", "message" : "Kunne ikke finne et profilbilde"})
                }
            })
        })
    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
    }
})

// Henter personalia til innlogget bruker //
router.post('/getBruker', async (req, res) => {
    let brukerid = undefined;
    if (req.body.token !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid 
            let getQuery = "SELECT fnavn, enavn, telefon, email, brukerid FROM bruker WHERE brukerid = ?";
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
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"})
    }
})

// Oppdater brukerens epost
router.post('/updateEmail', async (req, res) => {
    // Valider epost som en gyldig adresse
    const validation = emailValidation({epost : req.body.epost})
    if (validation.error) {
        if (validation.error.details[0].type == "string.email") {
            return res.json({"status" : "error", "message" : "E-post adressen er ugyldig"})
        }
        return res.json({ "status" : "error", "message" : validation.error.details[0].message })
    }

    let brukerid = undefined
    if (req.body.token !== undefined && req.body.epost !== undefined) {
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid
            let updateQuery = "UPDATE bruker SET email= ? WHERE brukerid= ?"
            let updateQueryFormat = mysql.format(updateQuery, [req.body.epost.toLowerCase(), brukerid])
            connection.query(updateQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occured while updating the users email, details: " + error.errno + ", " + error.sqlMessage)
                    // Duplikat av innføring
                    if (error.errno == 1062) {
                        return res.json({"status" : "error", "message" : "Epost allerede i bruk"})
                    } else {
                        return res.json({"status" : "error", "message" : "En feil oppstod"})
                    }
                }

                if(results.affectedRows > 0) {
                    return res.json({"status" : "success", "message" : "Epost oppdatert" })

                } else {
                    return res.json({"status" : "error", "message" : "En feil oppstod under oppdatering av brukerens email"})
                }
            })
        })
    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"})
    }
})

// Oppdater brukerens passord
router.post('/updatePassord', async (req, res) => {
    // Kontroller at passordet følger retningslinjer
    const validation = passwordValidation({password : req.body.pwd, password2 : req.body.pwd})
    if (validation.error) {
        // Om valideringen feiler sender vi tilbake en feilmelding utifra informasjonen utgitt av Joi
        if(validation.error.details[0].type == "string.empty") {
            // Ett av feltene er ikke fylt inn
            return res.json({ "status" : "error", "message" : "Et av feltene er ikke fylt inn" });
        } else if(validation.error.details[0].type == "any.required") {
            // Ett av feltene er ikke tilstede i forespørselen
            return res.json({ "status" : "error", "message" : "Et eller flere felt mangler" });
        } else if(validation.error.details[0].type == "passwordComplexity.tooShort") {
            // Ett av feltene er ikke tilstede i forespørselen
            return res.json({ "status" : "error", "message" : "Passordet må være minimum 8 tegn langt med 1 liten bokstav, 1 stor bokstav og 1 tall" });
        } else if(validation.error.details[0].type == "passwordComplexity.tooLong") {
            // Ett av feltene er ikke tilstede i forespørselen
            return res.json({ "status" : "error", "message" : "Passordet kan ikke være over 250 tegn" });
        } else if(validation.error.details[0].type == "passwordComplexity.uppercase") {
            // Ett av feltene er ikke tilstede i forespørselen
            return res.json({ "status" : "error", "message" : "Passordet må være minimum 8 tegn langt med 1 liten bokstav, 1 stor bokstav og 1 tall" });
        } else if(validation.error.details[0].type == "passwordComplexity.numeric") {
            // Ett av feltene er ikke tilstede i forespørselen
            return res.json({ "status" : "error", "message" : "Passordet må være minimum 8 tegn langt med 1 liten bokstav, 1 stor bokstav og 1 tall" });
        } 

        // Et ukjent validerings-problem oppstod, sender fulle meldingen til bruker
        return res.json({ "status" : "error", "message" : pwdValidation.error.details[0].message });
    }
    
    let brukerid = undefined
    if (req.body.token !== undefined && req.body.pwd) {
        // Salt og hash passord
        const salt = await bcrypt.genSalt(10)
        const hashedPwd = await bcrypt.hash(req.body.pwd, salt)
        verifyAuth(req.body.token).then( resAuth => {
            brukerid = resAuth.brukerid
            let updateQuery = "UPDATE bruker SET pwd = ? WHERE brukerid = ?"
            let updateQueryFormat = mysql.format(updateQuery, [hashedPwd, brukerid])
            connection.query(updateQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occured while updating the users password, details: " + error.errno + ", " + error.sqlMessage)
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere"})
                }

                if(results.affectedRows > 0) {
                    return res.json({"status" : "success", "message" : "Passord endret"})
                } else {
                    return res.json({"status" : "error", "message" : "En feil oppstod under oppdatering av brukerens passord"})
                }
            })
        })
    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"})
    }
})

module.exports = router;