const { connection } = require('../db');
const mysql = require('mysql');

const router = require('express').Router();

router.post('/getAllUserData', async (req, res) => {
    if(req.body !== undefined && req.body.token !== undefined) {
        // Sjekker om authtoken fremdeles er gyldig
        let checkQuery = "SELECT gjelderfor FROM login_token WHERE token = ? AND utlopsdato > NOW()";
        let checkQueryFormat = mysql.format(checkQuery, [req.body.token]);

        connection.query(checkQueryFormat, (error, results) => {
            if (error) {
                console.log("En feil oppstod ved henting av token fra login_token: " + error.errno + ", " + error.sqlMessage)
                return res.json({ "status" : "error", "message" : "Ingen tilgang, om feilen fortsetter, forsøk å logg ut og inn igjen" });
            }

            if(results[0] !== undefined) {
                let getDataQuery = "SELECT brukerid, fnavn, enavn, telefon, email FROM bruker";
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
                return res.status(403).send();
            }
        });
    } else {
        return res.status(403).send();
    }
});

module.exports = router;