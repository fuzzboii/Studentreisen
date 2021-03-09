const { connection } = require('../db');
const mysql = require('mysql');
const cryptojs = require('crypto-js');
const { emailValidation, hexValidation } = require('../validation');

const router = require('express').Router();

router.get('/auth', async (req, res) => {
    res.send(404);
});

router.post('/auth', async (req, res) => {
    if(req.body.token !== undefined) {
        const decryptedToken = cryptojs.AES.decrypt(req.body.token, process.env.TOKEN_SECRET);

        const validation = emailValidation({epost : decryptedToken.toString(cryptojs.enc.Utf8)});
        
        if(validation.error) {
            // Validation error for the decrypted email, assume the token is invalid
            return res.json({ "verified" : "false"});
        } else {
            // Check if the token is still valid
            let checkQuery = "SELECT gjelderfor FROM login_token WHERE gjelderfor in (SELECT brukerid as gjelderfor FROM bruker WHERE email = ?) AND token = ? AND utlopsdato > NOW();";
            let checkQueryFormat = mysql.format(checkQuery, [decryptedToken.toString(cryptojs.enc.Utf8), req.body.token]);

            connection.query(checkQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occurred while checking for matches while authenticating, details: " + error.errno + ", " + error.sqlMessage)
                    return res.json({ "verified" : "false"});
                }
                if(results[0] !== undefined) {
                    // Token was found and is not currently expired
                    return res.json({ "verified" : "true"});
                } else {
                    // Token was not found
                    return res.json({ "verified" : "false"});
                }
            });


        }
    } else {
        return res.json({ "verified" : "false"});
    }
});

router.get('/token', async (req, res) => {
    res.send(404);
});

router.post('/token', async (req, res) => {
    if(req.body.token !== undefined) {
        const validation = hexValidation({token : req.body.token});
        
        if(validation.error) {
            // Validation error for the token
            return res.json({ "verified" : "false"});
        } else {
            // Check if the token is still valid
            let checkQuery = "SELECT gjelderfor FROM glemtpassord_token WHERE token = ? AND utlopsdato > NOW()";
            let checkQueryFormat = mysql.format(checkQuery, [req.body.token]);

            connection.query(checkQueryFormat, (error, results) => {
                if (error) {
                    console.log("An error occurred while checking for matches while verifying a token, details: " + error.errno + ", " + error.sqlMessage)
                    return res.json({ "verified" : "false"});
                }
                if(results[0] !== undefined) {
                    // Token was found and is not currently expired
                    return res.json({ "verified" : "true"});
                } else {
                    // Token was not found
                    return res.json({ "verified" : "false"});
                }
            });


        }
    } else {
        return res.json({ "verified" : "false"});
    }
});


module.exports = router;