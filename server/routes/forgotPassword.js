const { connection } = require('../db');
const { emailValidation, passwordValidation } = require('../validation');
const mysql = require('mysql');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); 
const { sendEmail } = require('../global/CommonFunctions');

router.get('/forgotPassword', async (req, res) => {
    res.send(404);
});

router.post('/forgotPassword', async (req, res) => {
    if(req.body.epost !== undefined) {
        const validation = emailValidation(req.body);
        
        if(validation.error) {
            // Om valideringen feiler sender vi tilbake en feilmelding utifra informasjonen utgitt av Joi
            if(validation.error.details[0].path[0] == "epost") {
                if(validation.error.details[0].type == "string.empty") {
                    // E-post feltet er tomt
                    return res.json({ "status" : "error", "message" : "E-post er ikke fylt inn" });
                } else if(validation.error.details[0].type == "string.email") {
                    // E-posten oppgitt er ugyldig
                    return res.json({ "status" : "error", "message" : "E-post adressen er ugyldig" });
                } else if(validation.error.details[0].type == "any.required") {
                    // E-post feltet er ikke tilstede i forespørselen
                    return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler" });
                }
            }

            // Et ukjent validerings-problem oppstod, sender fulle meldingen til bruker
            return res.json({ "status" : "error", "message" : validation.error.details[0].message });
        } else {
            // Sjekk om e-posten eksisterer i databasen
            let checkQuery = "SELECT brukerid, email FROM bruker WHERE email = ?";
            let checkQueryFormat = mysql.format(checkQuery, [req.body.epost]);

            connection.query(checkQueryFormat, (error, selResults) => {
                if (error) {
                    console.log("En feil oppstod ved henting av brukerinfo, detaljer: " + error.errno + ", " + error.sqlMessage)
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }

                if(selResults[0] !== undefined) {
                    // En e-post ble funnet, genererer en Hex kode som brukes til å identifisere bruker ved tilbakestilling
                    crypto.randomBytes(20, (err, buf) => {
                        if(err) {
                            console.log("En feil oppstod ved generering glemtpassord_token, detaljer: " + err)
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }

                        let insertTokenQuery = "INSERT INTO glemtpassord_token(gjelderfor, token, utlopsdato) VALUES(?, ?, NOW() + INTERVAL 3 HOUR)";
                        let insertTokenQueryFormat = mysql.format(insertTokenQuery, [selResults[0].brukerid, buf.toString("hex")]);

                        connection.query(insertTokenQueryFormat, (error, insResults) => {
                            if (error) {
                                console.log("En feil oppstod ved oppretting av glemtpassord_token, detaljer: " + error.errno + ", " + error.sqlMessage)
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }
                            const subject = 'Glemt passord - Studentreisen';
                            const body =  'Hei!\n\nDu har mottatt denne eposten fordi du har bedt om å tilbakestille passordet ditt hos Studentreisen, om du ikke har bedt om dette kan du trygt ignorere denne eposten.\n\n' +
                                    'Vennligst trykk på lenken under for å fortsette med å endre passordet ditt.\n' + 
                                    process.env.DOMAIN + '/reset/' + buf.toString("hex") + "\n\n" + 
                                    'Mvh\nStudentreisen';
                           
                            sendEmail(selResults[0].email, subject, body).then(function(response) {
                                return res.json({ "status" : "success", "message" : "ok" });
                            });
                        });
                        
                    });
                } else {
                    // Eposten eksisterer ikke, men viser fremdeles nøytral melding om at alt annet har gått
                    return res.json({ "status" : "success", "message" : "ok" });
                }
            });
        }
    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
    }
});


router.get('/resetPassword', async (req, res) => {
    res.send(404);
});

router.post('/resetPassword', async (req, res) => {
    if(req.body.password !== undefined && req.body.password2 !== undefined && req.body.token !== undefined) {
        const validation = passwordValidation({password: req.body.password, password2: req.body.password2});
        
        if(validation.error) {
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
            return res.json({ "status" : "error", "message" : validation.error.details[0].message });
        } else {
            // Passord OK, hasher og henter brukerid
            const salt = await bcrypt.genSalt(10);
            const hashedPW = await bcrypt.hash(req.body.password, salt);

            let checkQuery = "SELECT gjelderfor FROM glemtpassord_token WHERE token = ? AND utlopsdato > NOW()";
            let checkQueryFormat = mysql.format(checkQuery, [req.body.token]);

            connection.query(checkQueryFormat, (error, results) => {
                if (error) {
                    console.log("En feil oppstod ved henting av token fra glemtpassord_token: " + error.errno + ", " + error.sqlMessage)
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }

                if(results[0] !== undefined) {
                    // Fant token, fremdeles gyldig, oppdaterer databasen
                    let insertQuery = "UPDATE bruker SET pwd = ?, pwd_temp = 0 WHERE brukerid = ?";
                    let insertQueryFormat = mysql.format(insertQuery, [hashedPW, results[0].gjelderfor]);

                    connection.query(insertQueryFormat, (error, updResults) => {
                        if (error) {
                            console.log("En feil oppstod ved oppdatering av passord for bruker: " + error.errno + ", " + error.sqlMessage)
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }
                        
                        if(updResults.affectedRows > 0) {
                            // Passord oppdatert, fjerner glemtpassord_token
                            let deleteQuery = "DELETE FROM glemtpassord_token WHERE token = ?";
                            let deleteQueryFormat = mysql.format(deleteQuery, [req.body.token]);

                            connection.query(deleteQueryFormat, (error, delGPResults) => {
                                if (error) {
                                    console.log("En feil oppstod ved sletting av glemt passord tokens for en bruker: " + error.errno + ", " + error.sqlMessage)
                                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                }
                                
                                if(delGPResults.affectedRows > 0) {
                                    // Slettet token fra glemtpassord_token, tømmer alle aktive login tokens 
                                    let deleteLoginQuery = "DELETE FROM login_token WHERE gjelderfor = ?";
                                    let deleteLoginQueryFormat = mysql.format(deleteLoginQuery, [results[0].gjelderfor]);

                                    connection.query(deleteLoginQueryFormat, (error, delLResults) => {
                                        if (error) {
                                            console.log("En feil oppstod ved sletting av login tokens for en bruker: " + error.errno + ", " + error.sqlMessage)
                                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                        }
                                        
                                        if(delLResults.affectedRows > 0) {
                                            return res.json({ "status" : "success", "message" : "OK" });
                                        } else {
                                            // Ingen aktive login tokens funnet, sender fremdeles OK til bruker
                                            return res.json({ "status" : "success", "message" : "OK" });
                                        }
                                    });
                                } else {
                                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                }
                            });

                        } else {
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }
                    });

                } else {
                    // Fant ikke token
                    return res.json({ "status" : "error", "message" : "Ugyldig forespørsel, du kan be om ny e-post på innloggings-siden" });
                }
            });
        }
    } else {
        return res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
    }
});

module.exports = router;