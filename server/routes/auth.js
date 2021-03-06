const { connection } = require('../db');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const cryptojs = require('crypto-js');
const { registerValidation, loginValidation } = require('../validation');

const router = require('express').Router();

/*
Order
{
    "status": "",
    "fnavn": "",
    "enavn": "",
    "telefon": "",
    "email": "",
    "pwd": ""
}
*/

router.get('/register', async (req, res) => {
    res.status(404);
});

router.post('/register', async (req, res) => {
    if(req.body.status !== undefined & req.body.fnavn !== undefined & req.body.enavn !== undefined & req.body.telefon !== undefined & req.body.email !== undefined & req.body.pwd !== undefined) {
        const validation = registerValidation(req.body);
        
        if(validation.error) {
            // If the validation failed we send back an error message containing information provided by joi
            return res.status(400).json({ "status" : "error", "message" : validation.error.details[0].message });
        } else {
            try {
                // Hash the password
                const salt = await bcrypt.genSalt(10);
                const hashedPW = await bcrypt.hash(req.body.pwd, salt);

                // Check if the PIN or email already exists
                let checkQuery = "SELECT email FROM bruker WHERE email = ?";
                let checkQueryFormat = mysql.format(checkQuery, [req.body.email]);
    
                connection.query(checkQueryFormat, (error, results) => {
                    if (error) {
                        console.log("An error occurred while checking for previously existing users, details: " + error.errno + ", " + error.sqlMessage)
                        return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                    }
    
                    if(results.length > 0) {
                        return res.status(400).json({"status" : "error", "message" : "Denne brukeren eksisterer allerede"});
                    } else {

                        // Add the user
                        let insertQuery = "INSERT INTO bruker(niva, statusid, fnavn, enavn, telefon, email, pwd) VALUES(?, ?, ?, ?, ?, ?, ?)";
                        let insertQueryFormat = mysql.format(insertQuery, [3, req.body.status, req.body.fnavn, req.body.enavn, req.body.telefon, req.body.email, hashedPW]);
                
                        connection.query(insertQueryFormat, (error, results) => {
                            if (error) {
                                console.log("An error occurred while user was creating an account, details: " + error.errno + ", " + error.sqlMessage)
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }
                            // Returning the number of affected rows to indicate the insert went OK
                            if(results.affectedRows > 0) {
                                res.status(200).json({"status" : "success", "message" : "Bruker opprettet"});
                            } else {
                                res.status(400).json({"status" : "error", "message" : "En feil oppstod under oppretting av brukeren"});
                            }
                        });
                    }
                });
            } catch (error) {
                // An error occurred while registering the new user
                res.status(400).json({"status" : "error", "message" : "En feil oppstod under oppretting av brukeren"});
            }
        }

    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
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
    res.status(404);
});

router.post('/login', async (req, res) => {
    if(req.body.email !== undefined && req.body.pwd !== undefined && req.body.remember !== undefined) {
        const validation = loginValidation(req.body);
        
        if(validation.error) {
            // If the validation failed we send back an error message containing information provided by joi
            // Email validation
            if(validation.error.details[0].path[0] == "email") {
                if(validation.error.details[0].type == "string.empty") {
                    // The email field is empty
                    return res.json({ "status" : "error", "message" : "E-post er ikke fylt inn" });
                } else if(validation.error.details[0].type == "string.email") {
                    // Invalid email entered
                    return res.json({ "status" : "error", "message" : "E-post adressen er ugyldig" });
                } else if(validation.error.details[0].type == "any.required") {
                    // A required field is not present
                    return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler" });
                }
            // Password validation (Don't check if it's valid according to the password rules, just if it's filled in and of the correct type)
            } else if(validation.error.details[0].path[0] == "pwd") {
                if(validation.error.details[0].type == "string.empty") {
                    // The email field is empty
                    return res.json({ "status" : "error", "message" : "Passordet er ikke fylt inn" });
                } else if(validation.error.details[0].type == "any.required") {
                    // A required field is not present
                    return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler" });
                }
            // Remember validation
            } else if(validation.error.details[0].path[0] == "remember") {
                if(validation.error.details[0].type == "any.required") {
                    // A required field is not present
                    return res.json({ "status" : "error", "message" : "Ett eller flere felt mangler" });
                }
            }

            // An uncaught validation error, send the full message
            return res.json({ "status" : "error", "message" : validation.error.details[0].message });
        } else {
            // Check if the PIN or email already exists
            let checkQuery = "SELECT brukerid, email, pwd FROM bruker WHERE email = ?";
            let checkQueryFormat = mysql.format(checkQuery, [req.body.email]);

            connection.query(checkQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occurred while checking for matches while logging in, details: " + error.errno + ", " + error.sqlMessage)
                    return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                }

                if(results[0] !== undefined) {
                    const validatePass = bcrypt.compareSync(req.body.pwd, results[0].pwd);
                    
                    if(validatePass) {
                        // User authenticated

                        // Alter the expiry date depending on the "Remember me" option
                        let date = new Date();

                        if(req.body.remember) {
                            // Remember the user for 72 hours
                            date.setTime(date.getTime() + ((60 * 72) * 60 * 1000));
                        } else {
                            // Remember the user for 3 hours
                            date.setTime(date.getTime() + ((60 * 3) * 60 * 1000));
                        }

                        // Create and assign a token
                        const token = cryptojs.AES.encrypt(results[0].email, process.env.TOKEN_SECRET);

                        // Add the token to the database
                        let insertQuery = "INSERT INTO login_token(gjelderfor, token, utlopsdato) VALUES(?, ?, ?)";
                        let insertQueryFormat = mysql.format(insertQuery, [results[0].brukerid, token.toString(), date]);
                
                        connection.query(insertQueryFormat, (error, results) => {
                            if (error) {
                                console.log("An error occurred while adding a token to a user, details: " + error.errno + ", " + error.sqlMessage)
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }
                            // Returning the number of affected rows to indicate the insert went OK
                            if(results.affectedRows > 0) {
                                return res.json({"status" : "success", "message" : "OK", "authtoken" : token.toString()});
                            } else {
                                return res.json({ "status" : "error", "message" : "En intern feil oppstod, vennligst forsøk igjen senere" });
                            }
                        });
                    } else {
                        // Wrong password
                        res.json({ "status" : "error", "message" : "Feil brukernavn eller passord" });
                    }
                } else {
                    // Wrong email
                    return res.json({ "status" : "error", "message" : "Feil brukernavn eller passord"});
                }
            });
        }
    } else {
        res.status(400).json({"status" : "error", "message" : "Ikke tilstrekkelig data"});
    }
});


module.exports = router;