const { connection } = require('../db');
const { emailValidation } = require('../validation');
const mysql = require('mysql');
const router = require('express').Router();
const crypto = require('crypto'); 

router.get('/forgotPassword', async (req, res) => {
    res.send(404);
});

router.post('/forgotPassword', async (req, res) => {
    if(req.body.epost !== undefined) {
        const validation = emailValidation(req.body);
        
        if(validation.error) {
            // If the validation failed we send back an error message containing information provided by joi
            if(validation.error.details[0].path[0] == "epost") {
                if(validation.error.details[0].type == "string.empty") {
                    // The email field is empty
                    return res.json({ "status" : "error", "message" : "E-post er ikke fylt inn" });
                } else if(validation.error.details[0].type == "string.email") {
                    // Invalid email entered
                    return res.json({ "status" : "error", "message" : "E-post adressen er ugyldig" });
                }
            }

            // An uncaught validation error, send the full message
            return res.json({ "status" : "error", "message" : validation.error.details[0].message });
        } else {
            // Check if the email exists in the database

            let checkQuery = "SELECT brukerid, email FROM bruker WHERE email = ?";
            let checkQueryFormat = mysql.format(checkQuery, [req.body.epost]);

            connection.query(checkQueryFormat, (error, selResults) => {
                if (error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }

                if(selResults[0] !== undefined) {
                    crypto.randomBytes(20, (err, buf) => {
                        if(err) {
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }

                        let insertTokenQuery = "INSERT INTO glemtpassord_token(gjelderfor, token, utlopsdato) VALUES(?, ?, NOW() + INTERVAL 3 HOUR)";
                        let insertTokenQueryFormat = mysql.format(insertTokenQuery, [selResults[0].brukerid, buf.toString("hex")]);

                        connection.query(insertTokenQueryFormat, (error, insResults) => {
                            if (error) {
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }

                            return res.json({ "status" : "success", "message" : "ok" });
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

module.exports = router;