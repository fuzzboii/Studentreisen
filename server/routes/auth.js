const { connection } = require('../db');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const cryptojs = require('crypto-js');

const { registerValidation, loginValidation, passwordValidation } = require('../validation');
const { verifyAuth } = require('../global/CommonFunctions');

const router = require('express').Router();

/*
Order
{
    "email": "",
    "fnavn": "",
    "enavn": "",
    "pwd": ""
}
*/

router.get('/register', async (req, res) => {
    res.status(404).send();
});

router.post('/register', async (req, res) => {
    if(req.body.email !== undefined && req.body.fnavn !== undefined && req.body.enavn !== undefined && req.body.password !== undefined && req.body.password2 !== undefined) {
        const validation = registerValidation(req.body);
        
        if(validation.error) {
            // Om validering feilet sender vi tilbake en feilmelding med informasjon gitt ut av Joi
            
            // E-post validering
            if(validation.error.details[0].path[0] == "email") {
                if(validation.error.details[0].type == "string.empty") {
                    // E-post feltet er tomt
                    return res.json({ "status" : "error", "message" : "E-post er ikke fylt inn" });
                } else if(validation.error.details[0].type == "string.email") {
                    // E-posten er ikke en gyldig e-post
                    return res.json({ "status" : "error", "message" : "E-post adressen er ugyldig" });
                } else if(validation.error.details[0].type == "any.required") {
                    // E-post feltet er ikke tilstede i forespørselen
                    return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler" });
                }

            // Fornavn validering
            } else if(validation.error.details[0].path[0] == "fnavn") {
                if(validation.error.details[0].type == "string.empty") {
                    // Passord-feltet er tomt
                    return res.json({ "status" : "error", "message" : "Fornavn er ikke fylt inn" });
                } else if(validation.error.details[0].type == "any.required") {
                    // Passord-feltet er ikke tilstede i forespørselen
                    return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler" });
                }

            // Etternavn validering
            } else if(validation.error.details[0].path[0] == "enavn") {
                if(validation.error.details[0].type == "string.empty") {
                    // Passord-feltet er tomt
                    return res.json({ "status" : "error", "message" : "Etternavn er ikke fylt inn" });
                } else if(validation.error.details[0].type == "any.required") {
                    // Passord-feltet er ikke tilstede i forespørselen
                    return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler" });
                }
            }

            // Et ukjent validerings-problem oppstod, sender fulle meldingen til bruker
            return res.json({ "status" : "error", "message" : validation.error.details[0].message });
        } else {
            const pwdValidation = passwordValidation({password: req.body.password, password2: req.body.password2});
            if(pwdValidation.error) {
                // Om valideringen feiler sender vi tilbake en feilmelding utifra informasjonen utgitt av Joi
                if(pwdValidation.error.details[0].type == "string.empty") {
                    // Ett av feltene er ikke fylt inn
                    return res.json({ "status" : "error", "message" : "Et av feltene er ikke fylt inn" });
                } else if(pwdValidation.error.details[0].type == "any.required") {
                    // Ett av feltene er ikke tilstede i forespørselen
                    return res.json({ "status" : "error", "message" : "Et eller flere felt mangler" });
                } else if(pwdValidation.error.details[0].type == "passwordComplexity.tooShort") {
                    // Ett av feltene er ikke tilstede i forespørselen
                    return res.json({ "status" : "error", "message" : "Passordet må være minimum 8 tegn langt med 1 liten bokstav, 1 stor bokstav og 1 tall" });
                } else if(pwdValidation.error.details[0].type == "passwordComplexity.tooLong") {
                    // Ett av feltene er ikke tilstede i forespørselen
                    return res.json({ "status" : "error", "message" : "Passordet kan ikke være over 250 tegn" });
                } else if(pwdValidation.error.details[0].type == "passwordComplexity.uppercase") {
                    // Ett av feltene er ikke tilstede i forespørselen
                    return res.json({ "status" : "error", "message" : "Passordet må være minimum 8 tegn langt med 1 liten bokstav, 1 stor bokstav og 1 tall" });
                } else if(pwdValidation.error.details[0].type == "passwordComplexity.numeric") {
                    // Ett av feltene er ikke tilstede i forespørselen
                    return res.json({ "status" : "error", "message" : "Passordet må være minimum 8 tegn langt med 1 liten bokstav, 1 stor bokstav og 1 tall" });
                } 

                // Et ukjent validerings-problem oppstod, sender fulle meldingen til bruker
                return res.json({ "status" : "error", "message" : pwdValidation.error.details[0].message });
            }
            
            try {
                // Salter og hasher passordet
                const salt = await bcrypt.genSalt(10);
                const hashedPW = await bcrypt.hash(req.body.password, salt);

                // Sjekker om e-posten allerede eksisterer
                let checkQuery = "SELECT email FROM bruker WHERE email = ?";
                let checkQueryFormat = mysql.format(checkQuery, [req.body.email]);
    
                connection.query(checkQueryFormat, (error, results) => {
                    if (error) {
                        console.log("En feil oppstod ved henting av e-post under registrering, detaljer: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    }
    
                    if(results.length > 0) {
                        return res.json({"status" : "error", "message" : "En bruker med denne e-posten eksisterer allerede"});
                    } else {

                        // Legg til brukeren
                        let insertQuery = "INSERT INTO bruker(niva, fnavn, enavn, email, pwd) VALUES(?, ?, ?, ?, ?)";
                        let insertQueryFormat = mysql.format(insertQuery, [process.env.ACCESS_STUDENT, req.body.fnavn, req.body.enavn, req.body.email.toLowerCase(), hashedPW]);
                
                        connection.query(insertQueryFormat, (error, results) => {
                            if (error) {
                                console.log("En feil oppstod under registrering av ny bruker, detaljer: " + error.errno + ", " + error.sqlMessage)
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }
                            
                            if(results.affectedRows > 0) {
                                // Bruker opprettet

                                // Endrer utløpsdatoen utifra "Husk meg"-feltet
                                let date = new Date();
                                date.setTime(date.getTime() + ((60 * 3) * 60 * 1000));

                                // Opprett en token utifra e-posten til brukeren
                                const token = cryptojs.AES.encrypt(req.body.email.toLowerCase(), process.env.TOKEN_SECRET);

                                // Legg til nye token i databasen med utløpsdato ovenfor
                                let insertQuery = "INSERT INTO login_token(gjelderfor, token, utlopsdato) VALUES(?, ?, ?)";
                                let insertQueryFormat = mysql.format(insertQuery, [results.insertId, token.toString(), date]);
                        
                                connection.query(insertQueryFormat, (error, results) => {
                                    if (error) {
                                        console.log("En feil oppstod under oppretting av login_token for en ny bruker, detaljer: " + error.errno + ", " + error.sqlMessage)
                                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                    }

                                    if(results.affectedRows > 0) {
                                        return res.json({"status" : "success", "message" : "OK", "authtoken" : token.toString()});
                                    } else {
                                        return res.json({"status" : "success", "message" : "OK"});
                                    }
                                });
                            } else {
                                return res.json({"status" : "error", "message" : "En feil oppstod under oppretting av brukeren, vennligst forsøk igjen senere"});
                            }
                        });
                    }
                });
            } catch (error) {
                // En feil oppstod under registreringen
                return res.json({"status" : "error", "message" : "En feil oppstod under oppretting av brukeren, vennligst forsøk igjen senere"});
            }
        }

    } else {
        return res.json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
    }
});


/*
Order
{
    "email": "",
    "pwd": ""
}
*/

router.get('/login', async (req, res) => {
    res.status(404).send();;
});

router.post('/login', async (req, res) => {
    if(req.body.email !== undefined && req.body.pwd !== undefined && req.body.remember !== undefined) {
        const validation = loginValidation(req.body);
        
        if(validation.error) {
            // Om validering feilet sender vi tilbake en feilmelding med informasjon gitt ut av Joi
            
            // E-post validering
            if(validation.error.details[0].path[0] == "email") {
                if(validation.error.details[0].type == "string.empty") {
                    // E-post feltet er tomt
                    return res.json({ "status" : "error", "message" : "E-post er ikke fylt inn" });
                } else if(validation.error.details[0].type == "string.email") {
                    // E-posten er ikke en gyldig e-post
                    return res.json({ "status" : "error", "message" : "E-post adressen er ugyldig" });
                } else if(validation.error.details[0].type == "any.required") {
                    // E-post feltet er ikke tilstede i forespørselen
                    return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler" });
                }

            // Passord-validering, sjekker ikke om det er tilstrekkelig i følge reglene, dette gjøres ved registrering
            } else if(validation.error.details[0].path[0] == "pwd") {
                if(validation.error.details[0].type == "string.empty") {
                    // Passord-feltet er tomt
                    return res.json({ "status" : "error", "message" : "Passordet er ikke fylt inn" });
                } else if(validation.error.details[0].type == "any.required") {
                    // Passord-feltet er ikke tilstede i forespørselen
                    return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler" });
                }

            // "Husk meg" validering
            } else if(validation.error.details[0].path[0] == "remember") {
                if(validation.error.details[0].type == "any.required") {
                    // "Husk meg" feltet er ikke tilstede i forespørselen
                    return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler" });
                }
            }

            // Et ukjent validerings-problem oppstod, sender fulle meldingen til bruker
            return res.json({ "status" : "error", "message" : validation.error.details[0].message });
        } else {
            // Henter brukerinfo utifra oppgitt e-post
            let checkQuery = "SELECT brukerid, email, pwd, pwd_temp FROM bruker WHERE email = ?";
            let checkQueryFormat = mysql.format(checkQuery, [req.body.email]);

            connection.query(checkQueryFormat, (error, fetchedUser) => {
                if (error) {
                    console.log("En feil oppstod under sjekking av brukerinfo ved innlogging, detaljer: " + error.errno + ", " + error.sqlMessage)
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }

                if(fetchedUser[0] !== undefined) {
                    const validatePass = bcrypt.compareSync(req.body.pwd, fetchedUser[0].pwd);
                    
                    if(validatePass) {
                        // Bruker autentisert

                        // Endrer utløpsdatoen utifra "Husk meg"-feltet
                        let date = new Date();

                        if(req.body.remember) {
                            // Husk brukeren i 72 timer
                            date.setTime(date.getTime() + ((60 * 72) * 60 * 1000));
                        } else {
                            // Husk brukeren i 3 timer
                            date.setTime(date.getTime() + ((60 * 3) * 60 * 1000));
                        }

                        // Opprett en token utifra e-posten til brukeren
                        const token = cryptojs.AES.encrypt(fetchedUser[0].email, process.env.TOKEN_SECRET);

                        // Legg til nye token i databasen med utløpsdato ovenfor
                        let insertQuery = "INSERT INTO login_token(gjelderfor, token, utlopsdato) VALUES(?, ?, ?)";
                        let insertQueryFormat = mysql.format(insertQuery, [fetchedUser[0].brukerid, token.toString(), date]);
                
                        connection.query(insertQueryFormat, (error, results) => {
                            if (error) {
                                console.log("En feil oppstod under oppretting av login_token for en bruker, detaljer: " + error.errno + ", " + error.sqlMessage)
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }

                            if(results.affectedRows > 0) {
                                return res.json({"status" : "success", "message" : "OK", "authtoken" : token.toString(), "pwd_temp" : fetchedUser[0].pwd_temp});
                            } else {
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }
                        });
                    } else {
                        // Feil passord
                        res.json({ "status" : "error", "message" : "Feil brukernavn eller passord" });
                    }
                } else {
                    // Feil e-post
                    return res.json({ "status" : "error", "message" : "Feil brukernavn eller passord"});
                }
            });
        }
    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
    }
});


router.post('/updatePassword', async (req, res) => {
    // Kontroller at passordet følger retningslinjer
    const validation = passwordValidation({password : req.body.pwd, password2 : req.body.pwd2})

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
    } else {
        if(req.body.token !== undefined) {
            // Salt og hash passord
            const salt = await bcrypt.genSalt(10)
            const hashedPwd = await bcrypt.hash(req.body.pwd, salt)
    
            verifyAuth(req.body.token).then( resAuth => {
                let updateQuery = "UPDATE bruker SET pwd = ?, pwd_temp = 0 WHERE brukerid = ?"
                let updateQueryFormat = mysql.format(updateQuery, [hashedPwd, resAuth.brukerid])
                connection.query(updateQueryFormat, (error, results) => {
                    if (error) {
                        console.log("En feil oppstod ved oppdatering av midlertidig passord for en bruker, detaljer: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere"})
                    }
    
                    if(results.affectedRows > 0) {
                        return res.json({"status" : "success"})
                    } else {
                        return res.json({"status" : "error", "message" : "En feil oppstod under oppdatering av brukerens passord"})
                    }
                })
            })
        } else {
            res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"})
        }
    }
})

module.exports = router;