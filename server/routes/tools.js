const { connection } = require('../db');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const { registerValidation } = require('../validation');
const { verifyAuth, sendEmail } = require('../global/CommonFunctions');

const router = require('express').Router();

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
                        }
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
                                        let insertQuery = "INSERT INTO bruker(niva, fnavn, enavn, email, pwd) VALUES(?, ?, ?, ?, ?)";
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
        console.log(req.body.nyBruker);

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

module.exports = router;