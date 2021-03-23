const { connection } = require('../db');
const mysql = require('mysql');
const { registerValidation } = require('../validation');
const { verifyAuth } = require('../global/CommonFunctions');

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
            console.log(validation.error);
            return res.json({success: false});
        }

        verifyAuth(req.body.token).then(function(response) {
            if(response.authenticated) {
                console.log(response.usertype);
                return res.json({success: true});
            } else {
                return res.json({success: false});
            }
        })

    } else {
        return res.status(403).send();
    }
});

module.exports = router;