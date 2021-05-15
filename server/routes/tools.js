const mysqlpool = require('../db').pool;
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
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then(function(response) {
            if(response.authenticated) {
                // Kun Administrator skal kunne se oversikten
                if(response.usertype.toString() === process.env.ACCESS_ADMINISTRATOR) {
                    mysqlpool.getConnection(function(error, connPool) {
                        if(error) {
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }
        
                        let getDataQuery = "SELECT brukerid, fnavn, enavn, niva, telefon, email FROM bruker";
                        let getDataQueryFormat = mysql.format(getDataQuery);

                        connPool.query(getDataQueryFormat, (error, results) => {
                            connPool.release();
                            if (error) {
                                console.log("En feil oppstod ved henting av all brukerdata: " + error.errno + ", " + error.sqlMessage)
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }   
                            
                            if(results[0] !== undefined) {
                                return res.json({ "status" : "success", results });
                            } else {
                                return res.json({ "status" : "info", "message" : "Ingen brukere å vise" });
                            }
                        });
                    });
                } else {
                    // Bruker har ikke tilgang, loggfører
                    console.log("En innlogget bruker uten riktige tilganger har forsøkt å se brukeroversikten, brukerens ID: " + results[0].brukerid)
                    return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
                }
            } else {
                return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
            }
        });
    } else {
        return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler fra forespørselen" });
    }
});

router.post('/newUser', async (req, res) => {
    if(req.body.bruker !== undefined && req.body.token !== undefined) {
        const validation = registerValidation({email: req.body.bruker.email, fnavn: req.body.bruker.fnavn, enavn: req.body.bruker.enavn, password: "", password2: ""});
        
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
        }

        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then(function(response) {
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

                                mysqlpool.getConnection(function(error, connPool) {
                                    if(error) {
                                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                    }
                                    // Sjekker om e-posten allerede eksisterer
                                    let checkQuery = "SELECT email FROM bruker WHERE email = ?";
                                    let checkQueryFormat = mysql.format(checkQuery, [req.body.bruker.email]);
                        
                                    connPool.query(checkQueryFormat, (error, results) => {
                                        if (error) {
                                            connPool.release();
                                            console.log("En feil oppstod ved henting av e-post under registrering, detaljer: " + error.errno + ", " + error.sqlMessage)
                                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                        }
                        
                                        if(results.length > 0) {
                                            connPool.release();
                                            return res.json({ "status" : "error", "message" : "E-posten eksisterer allerede" });
                                        } else {

                                            // Oppretter en e-post med info til brukeren
                                            const subject = "Ny bruker - Studentreisen";
                                            const body = 'Hei ' + req.body.bruker.fnavn + '!\n\nDu har mottatt denne eposten fordi en administrator har opprettet en bruker for deg.\n\n' +
                                                        'Ditt midlertidige passord: ' + pass + '\n\n' + 
                                                        'Du kan logge inn her: ' + process.env.EMAIL_DOMAIN + '/login. Du vil bli bedt om å oppgi et nytt passord ved innlogging.\n\n' + 
                                                        'Mvh\nStudentreisen';
            
                                            sendEmail(req.body.bruker.email, subject, body);

                                            // Legg til brukeren
                                            let insertQuery = "INSERT INTO bruker(niva, fnavn, enavn, email, pwd, pwd_temp) VALUES(?, ?, ?, ?, ?, 1)";
                                            let insertQueryFormat = mysql.format(insertQuery, [req.body.bruker.niva, req.body.bruker.fnavn, req.body.bruker.enavn, req.body.bruker.email.toLowerCase(), hashedPW]);
                                    
                                            connPool.query(insertQueryFormat, (error, results) => {
                                                connPool.release();
                                                if (error) {
                                                    console.log("En feil oppstod under registrering av ny bruker, detaljer: " + error.errno + ", " + error.sqlMessage)
                                                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                                }
                                                
                                                if(results.affectedRows > 0) {
                                                    // Bruker opprettet
                                                    return res.json({ "status" : "success" });
                                                } else {
                                                    return res.json({ "status" : "error", "message" : "Feil oppstod ved oppretting av bruker, vennligst forsøk igjen senere" });
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        });
                    } catch(e) {
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    }
                } else {
                    return res.json({ "status" : "error", "message" : "Ingen tilgang" });
                }
            } else {
                return res.json({ "status" : "error", "message" : "Ingen tilgang" });
            }
        })

    } else {
        return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler fra forespørselen" });
    }
});


router.post('/updateUser', async (req, res) => {
    if(req.body.nyBruker !== undefined && req.body.gammelBruker !== undefined && req.body.token !== undefined) {
        const validation = registerValidation({email: req.body.nyBruker.email, fnavn: req.body.nyBruker.fnavn, enavn: req.body.nyBruker.enavn, password: "", password2: ""});
        
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
        }

        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then(function(response) {
            if(response.authenticated) {
                // Kun Administrator skal kunne manuelt endre en bruker
                if(response.usertype.toString() === process.env.ACCESS_ADMINISTRATOR) {
                    try {
                        mysqlpool.getConnection(function(error, connPool) {
                            if(error) {
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }
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
                            connPool.query(updateQueryFormat, (error, results) => {
                                connPool.release();
                                if (error) {
                                    console.log("En feil oppstod under endring av eksisterende bruker, detaljer: " + error.errno + ", " + error.sqlMessage)
                                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                }
                                
                                if(results.affectedRows > 0) {
                                    // Bruker endret
                                    return res.json({ "status" : "success", "message" : "Bruker oppdatert" });
                                } else {
                                    return res.json({ "status" : "error", "message" : "Feil oppstod ved oppdatering av bruker" });
                                }
                            });
                        });
                    } catch(e) {
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    }
                } else {
                    return res.json({ "status" : "error", "message" : "Ingen tilgang" });
                }
            } else {
                return res.json({ "status" : "error", "message" : "Ingen tilgang" });
            }
        })

    } else {
        return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler fra forespørselen" });
    }
});


router.post('/deleteUser', async (req, res) => {
    if(req.body.bruker !== undefined && req.body.token !== undefined) {
        if(req.body.bruker.niva !== undefined && req.body.bruker.niva.toString() !== process.env.ACCESS_ADMINISTRATOR) {
            verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then(function(response) {
                if(response.authenticated) {
                    // Kun Administrator skal kunne slette en bruker
                    if(response.usertype.toString() === process.env.ACCESS_ADMINISTRATOR) {
                        try {
                            mysqlpool.getConnection(function(error, connPool) {
                                if(error) {
                                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                }
                                // Sletter alle koblinger som er "tillatt" å slette
                                let deleteLoginQuery = "DELETE FROM login_token WHERE gjelderfor = ?";
                                let deleteLoginQueryFormat = mysql.format(deleteLoginQuery, [req.body.bruker.brukerid]);
                            
                                // Sletter kobling
                                connPool.query(deleteLoginQueryFormat, (error, results) => {
                                    if (error) {
                                        connPool.release();
                                        console.log("En feil oppstod under sletting av alle koblinger til en eksisterende bruker, detaljer: " + error.errno + ", " + error.sqlMessage)
                                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                    }

                                    // Sletter alle koblinger som er "tillatt" å slette
                                    let deleteGPQuery = "DELETE FROM glemtpassord_token WHERE gjelderfor = ?";
                                    let deleteGPQueryFormat = mysql.format(deleteGPQuery, [req.body.bruker.brukerid]);
                                
                                    // Sletter kobling
                                    connPool.query(deleteGPQueryFormat, (error, results) => {
                                        if (error) {
                                            connPool.release();
                                            console.log("En feil oppstod under sletting av alle koblinger til en eksisterende bruker, detaljer: " + error.errno + ", " + error.sqlMessage)
                                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                        }
                                    
                                        let deleteQuery = "DELETE FROM bruker WHERE brukerid = ? AND fnavn = ? AND enavn = ? AND email = ?";
                                        let deleteQueryFormat = mysql.format(deleteQuery, [req.body.bruker.brukerid, req.body.bruker.fnavn, req.body.bruker.enavn, req.body.bruker.email.toLowerCase()]);
                                    
                                        // Sletter brukeren
                                        connPool.query(deleteQueryFormat, (error, results) => {
                                            connPool.release();
                                            if (error) {
                                                if(error.errno === 1451) {
                                                    // Contraint feiler (Har koblinger utover login_token eller lignende), brukeren kan ikke slettes
                                                    return res.json({ "status" : "error", "message" : "Denne brukeren kan ikke slettes" });
                                                }
                                                console.log("En feil oppstod under sletting av eksisterende bruker, detaljer: " + error.errno + ", " + error.sqlMessage)
                                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                            }
                                            
                                            if(results.affectedRows > 0) {
                                                // Bruker slettet
                                                return res.json({ "status" : "success", "message" : "Bruker slettet" });
                                            } else {
                                                return res.json({ "status" : "error", "message" : "Feil oppstod ved sletting av bruker" });
                                            }
                                        });
                                    });
                                });
                            });
                        } catch(e) {
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }
                    } else {
                        return res.json({ "status" : "error", "message" : "Ingen tilgang" });
                    }
                } else {
                    return res.json({ "status" : "error", "message" : "Ingen tilgang" });
                }
            })
        } else {
            return res.json({ "status" : "error", "message" : "Du kan ikke slette en Administrator" });
        }
    } else {
        return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler fra forespørselen" });
    }
});

// Kurs
router.post('/getAllCourseData', async (req, res) => {
    if(req.body !== undefined && req.body.token !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then(function(response) {
            if(response.authenticated) {
                // Kun Administrator skal kunne se oversikten
                if(response.usertype.toString() === process.env.ACCESS_ADMINISTRATOR) {
                    mysqlpool.getConnection(function(error, connPool) {
                        if(error) {
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }
                        let getDataQuery = "SELECT emnekode, navn, beskrivelse, språk, semester, studiepoeng, lenke FROM kurs";
                        let getDataQueryFormat = mysql.format(getDataQuery);

                        connPool.query(getDataQueryFormat, (error, results) => {
                            connPool.release();
                            if (error) {
                                console.log("En feil oppstod ved henting av all kursdata: " + error.errno + ", " + error.sqlMessage)
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }   
                            
                            if(results[0] !== undefined) {
                                return res.json({ "status" : "success", results });
                            } else {
                                return res.json({ "status" : "info", "message" : "Ingen kurs å vise" });
                            }
                        });
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
        return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler fra forespørselen" });
    }
});

// Seminar
router.post('/getAllSeminarData', async (req, res) => {
    if(req.body !== undefined && req.body.token !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then(function(response) {
            if(response.authenticated) {
                mysqlpool.getConnection(function(error, connPool) {
                    if(error) {
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    }
                    // Kun Emneansvarlig / Administratorere skal kunne se hele oversikten, undervisere skal kunne se egne seminar
                    if(response.usertype.toString() === process.env.ACCESS_COORDINATOR || response.usertype.toString() === process.env.ACCESS_ADMINISTRATOR) {
                        let getDataQuery = "SELECT seminarid, navn, CONCAT(fnavn, ' ', enavn) as arrangornavn, adresse, oppstart, varighet, beskrivelse, tilgjengelighet FROM seminar, bruker WHERE arrangor = brukerid ORDER BY oppstart DESC";
                        let getDataQueryFormat = mysql.format(getDataQuery);

                        connPool.query(getDataQueryFormat, (error, results) => {
                            connPool.release();
                            if (error) {
                                console.log("En feil oppstod ved henting av all seminardata: " + error.errno + ", " + error.sqlMessage)
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }   
                            
                            if(results[0] !== undefined) {
                                return res.json({ "status" : "success", results });
                            } else {
                                return res.json({ "status" : "info", "message" : "Ingen seminar å vise" });
                            }
                        });
                    } else if(response.usertype.toString() === process.env.ACCESS_LECTURER) {
                        // Hent alle seminar for underviseren
                        let getDataQuery = "SELECT seminarid, navn, CONCAT(fnavn, ' ', enavn) as arrangornavn, adresse, oppstart, varighet, beskrivelse, tilgjengelighet FROM seminar, bruker WHERE arrangor = brukerid and arrangor = ? ORDER BY oppstart DESC";
                        let getDataQueryFormat = mysql.format(getDataQuery, [response.brukerid]);

                        connPool.query(getDataQueryFormat, (error, results) => {
                            connPool.release();
                            if (error) {
                                console.log("En feil oppstod ved henting av all seminardata: " + error.errno + ", " + error.sqlMessage)
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }
                            
                            if(results[0] !== undefined) {
                                return res.json({ "status" : "success", results });
                            } else {
                                return res.json({ "status" : "info", "message" : "Du har ingen seminarer å vise" });
                            }
                        });
                    } else {
                        // Bruker har ikke tilgang, loggfører
                        console.log("En innlogget bruker uten riktige tilganger har forsøkt å se seminaroversikten, brukerens ID: " + results[0].brukerid)
                        return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
                    }
                });
            } else {
                return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
            }
        });
    } else {
        return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler fra forespørselen" });
    }
});


router.post('/deleteSeminar', async (req, res) => {
    if(req.body.seminarid !== undefined && req.body.token !== undefined && req.body.sluttdato !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then(function(response) {
            if(response.authenticated) {
                mysqlpool.getConnection(function(error, connPool) {
                    if(error) {
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    }
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
                                connPool.query(deletePaameldingQueryFormat, (error, r) => {
                                    if (error) {
                                        connPool.release();
                                        console.log("En feil oppstod under sletting av påmeldinger til et eksisterende seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                    }
        
                                    // Sletter invitasjoner til seminaret
                                    let deleteInvitasjonQuery = "DELETE FROM invitasjon WHERE seminarid = ?";
                                    let deleteInvitasjonQueryFormat = mysql.format(deleteInvitasjonQuery, [req.body.seminarid]);
                                
                                    // Sletter kobling
                                    connPool.query(deleteInvitasjonQueryFormat, (error, r) => {
                                        if (error) {
                                            connPool.release();
                                            console.log("En feil oppstod under sletting av invitasjoner til et eksisterende seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                        }
        
                                        let deleteQuery = "DELETE FROM seminar WHERE seminarid = ?";
                                        let deleteQueryFormat = mysql.format(deleteQuery, [req.body.seminarid]);
        
                                        // Slett seminaret
                                        connPool.query(deleteQueryFormat, (error, results) => {
                                            if (error) {
                                                connPool.release();
                                                console.log("En feil oppstod under sletting av eksisterende seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                            }
                                            
                                            if(results.affectedRows > 0) {
                                                // Seminar slettet
                                                if(req.body.bilde !== undefined) {
                                                    // Seminaret hadde et bilde, sletter denne fra databasen og fra uploaded
                                                    let deleteQuery = "DELETE FROM bilde WHERE plassering = ?";
                                                    let deleteQueryFormat = mysql.format(deleteQuery, [req.body.bilde]);
        
                                                    // Slett bildet til seminaret
                                                    connPool.query(deleteQueryFormat, (error, results) => {
                                                        connPool.release();
                                                        if (error) {
                                                            console.log("En feil oppstod under sletting av bilde til seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                                        }
                                            
                                                        if(results.affectedRows > 0) {
                                                            // Fjernet fra database, sletter fil
        
                                                            const rootFolder = path.join(__dirname, '../../');
                                                            fs.unlink(rootFolder + '/public/uploaded/' + req.body.bilde, (err) => {
                                                                if(err) {
                                                                    console.log("Kunne ikke slette opplastet bilde ved sletting av seminar: " + err);
                                                                }
                                                            });
        
                                                            return res.json({ "status" : "success", "message" : "Seminar slettet" });
                                                        } else {
                                                            return res.json({ "status" : "info", "message" : "Seminar slettet, bilde til seminar ikke slettet, vennligst informer systemadministrator" });
                                                        }
                                                    });
                                                } else {
                                                    return res.json({ "status" : "success", "message" : "Seminar slettet" });
                                                }
                                            } else {
                                                return res.json({ "status" : "error", "message" : "Feil oppstod ved sletting av seminar" });
                                            }
                                        });
                                    });
                                });
                            } catch(e) {
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }
                        } else {
                            // Sluttdato ikke nådd
                            return res.json({ "status" : "error", "message" : "Du kan ikke slette et seminar fremover i tid" });
                        }
                    } else {
                        // Om brukeren ikke er administrator, sjekk om brukeren er eier av seminaret
                        let getDataQuery = "SELECT seminarid FROM seminar WHERE arrangor = ? and seminarid = ?";
                        let getDataQueryFormat = mysql.format(getDataQuery, [response.brukerid, req.body.seminarid]);

                        connPool.query(getDataQueryFormat, (error, results) => {
                            if (error) {
                                connPool.release();
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
                                        connPool.query(deletePaameldingQueryFormat, (error, r) => {
                                            if (error) {
                                                connPool.release();
                                                console.log("En feil oppstod under sletting av påmeldinger til et eksisterende seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                            }

                                            // Sletter invitasjoner til seminaret
                                            let deleteInvitasjonQuery = "DELETE FROM invitasjon WHERE seminarid = ?";
                                            let deleteInvitasjonQueryFormat = mysql.format(deleteInvitasjonQuery, [req.body.seminarid]);
                                        
                                            // Sletter kobling
                                            connPool.query(deleteInvitasjonQueryFormat, (error, r) => {
                                                if (error) {
                                                    connPool.release();
                                                    console.log("En feil oppstod under sletting av invitasjoner til et eksisterende seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                                }

                                                let deleteQuery = "DELETE FROM seminar WHERE seminarid = ?";
                                                let deleteQueryFormat = mysql.format(deleteQuery, [req.body.seminarid]);

                                                // Slett seminaret
                                                connPool.query(deleteQueryFormat, (error, results) => {
                                                    connPool.release();
                                                    if (error) {
                                                        console.log("En feil oppstod under sletting av eksisterende seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                                    }
                                                    
                                                    if(results.affectedRows > 0) {
                                                        // Seminar slettet
                                                        return res.json({ "status" : "success", "message" : "Seminar slettet" });
                                                    } else {
                                                        return res.json({ "status" : "error", "message" : "Feil oppstod ved sletting av seminar" });
                                                    }
                                                });
                                            });
                                        });
                                    } catch(e) {
                                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                    }
                                } else {
                                    // Sluttdato ikke nådd
                                    return res.json({ "status" : "error", "message" : "Du kan ikke slette et seminar fremover i tid" });
                                }
                            } else {
                                return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
                            }
                        });
                    }
                });
            } else {
                return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
            }
        })
    } else {
        return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler fra forespørselen" });
    }
});

router.post('/publicizeSeminar', async (req, res) => {
    if(req.body.seminarid !== undefined && req.body.token !== undefined && req.body.tilgjengelighet !== undefined) {
        verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then(function(response) {
            if(response.authenticated) {
                mysqlpool.getConnection(function(error, connPool) {
                    if(error) {
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    }
                    // Kun Administrator og emneansvarlig skal kunne oppdatere tilgjengeligheten til hvilket som helst seminar
                    if(response.usertype.toString() === process.env.ACCESS_COORDINATOR || response.usertype.toString() === process.env.ACCESS_ADMINISTRATOR) {
                        // Oppdater tilgjengeligheten

                        let updateQuery = "UPDATE seminar SET tilgjengelighet = ? WHERE seminarid = ?";
                        let updateQueryFormat = mysql.format(updateQuery, [req.body.tilgjengelighet, req.body.seminarid]);

                        connPool.query(updateQueryFormat, (error, results) => {
                            connPool.release();
                            if (error) {
                                console.log("En feil oppstod under publisering av eksisterende seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }
                            
                            if(results.affectedRows > 0) {
                                // Seminar oppdatert
                                if(req.body.tilgjengelighet == 1) {
                                    return res.json({ "status" : "success", "message" : "Seminaret er nå offentlig" });
                                } else {
                                    return res.json({ "status" : "success", "message" : "Seminaret er nå kun per invitasjon" });
                                }
                            } else {
                                return res.json({ "status" : "error", "message" : "Kunne ikke oppdatere seminar, vennligst forsøk igjen" });
                            }
                        });
                    } else {
                        // Om brukeren ikke er administrator, sjekk om brukeren er eier av seminaret
                        let getDataQuery = "SELECT seminarid FROM seminar WHERE arrangor = ? and seminarid = ?";
                        let getDataQueryFormat = mysql.format(getDataQuery, [response.brukerid, req.body.seminarid]);

                        connPool.query(getDataQueryFormat, (error, results) => {
                            if (error) {
                                connPool.release();
                                console.log("En feil oppstod ved henting av seminar for en innlogget underviser: " + error.errno + ", " + error.sqlMessage)
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }
                            
                            if(results[0] !== undefined) {
                                // Oppdater tilgjengeligheten
            
                                let updateQuery = "UPDATE seminar SET tilgjengelighet = ? WHERE seminarid = ?";
                                let updateQueryFormat = mysql.format(updateQuery, [req.body.tilgjengelighet, req.body.seminarid]);
            
                                connPool.query(updateQueryFormat, (error, results) => {
                                    connPool.release();
                                    if (error) {
                                        console.log("En feil oppstod under publisering av eksisterende seminar, detaljer: " + error.errno + ", " + error.sqlMessage)
                                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                    }
                                    
                                    if(results.affectedRows > 0) {
                                        // Seminar oppdatert
                                        if(req.body.tilgjengelighet === 1) {
                                            return res.json({ "status" : "success", "message" : "Seminaret er nå offentlig" });
                                        } else {
                                            return res.json({ "status" : "success", "message" : "Seminaret er nå kun per invitasjon" });
                                        }
                                    } else {
                                        return res.json({ "status" : "error", "message" : "Kunne ikke oppdatere seminar, vennligst forsøk igjen" });
                                    }
                                });
                            } else {
                                return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
                            }
                        });
                    }
                });
            } else {
                return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
            }
        })
    } else {
        return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler fra forespørselen" });
    }
});

router.post('/sendNotif', async (req, res) => {
    if(req.body.brukerid !== undefined && req.body.token !== undefined && req.body.msg !== undefined) {
        if(req.body.msg.length <= 255) {
            verifyAuth(req.body.token, req.socket.remoteAddress.substring(7)).then(function(response) {
                if(response.authenticated) {
                    mysqlpool.getConnection(function(error, connPool) {
                        if(error) {
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }
                        // Kun Administrator skal kunne opprette en ny kunngjøring
                        if(response.usertype.toString() === process.env.ACCESS_ADMINISTRATOR) {
                            // Oppretter nye kunngjøringen
    
                            let updateQuery = "INSERT INTO kunngjoring(av, til, tekst, dato) VALUES(?, ?, ?, NOW())";
                            let updateQueryFormat = mysql.format(updateQuery, [response.brukerid, req.body.brukerid, req.body.msg]);
    
                            connPool.query(updateQueryFormat, (error, results) => {
                                connPool.release();
                                if (error) {
                                    console.log("En feil oppstod under oppretting av kunngjøring til bruker, detaljer: " + error.errno + ", " + error.sqlMessage)
                                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                                }
                                
                                if(results.affectedRows > 0) {
                                    // Kunngjøring opprettet
                                    return res.json({ "status" : "success", "message" : "Kunngjøring opprettet" });
                                } else {
                                    return res.json({ "status" : "error", "message" : "Kunne ikke opprette kunngjøring, vennligst forsøk igjen" });
                                }
                            });
                        } else {
                            // Bruker har ikke tilgang, loggfører
                            console.log("En innlogget bruker uten riktige tilganger har forsøkt å opprette en kunngjøring, brukerens ID: " + response.brukerid)
                            return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
                        }
                    });
                } else {
                    return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
                }
            })
        } else {
            return res.json({ "status" : "error", "message" : "Kunngjøringen kan ikke være over 255 tegn" });
        }
    } else {
        return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler fra forespørselen" });
    }
});

module.exports = router;