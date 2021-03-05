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

            let checkQuery = "SELECT email FROM bruker WHERE email = ?";
            let checkQueryFormat = mysql.format(checkQuery, [req.body.epost]);

            connection.query(checkQueryFormat, (error, results) => {
                if (error) {
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }

                if(results[0] !== undefined) {
                    /*
                    TODO: Avventer korrekt DB

                    crypto.randomBytes(20, (err, buf) => {
                        if(err) {
                            return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                        }
                        
                        res.json({ "status" : "success", "message" : "ok" });
                        console.log(buf.toString("hex"));
                    }); */
                    return res.json({ "status" : "success", "message" : "ok" });
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