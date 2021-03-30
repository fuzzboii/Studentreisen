const { connection } = require('../db');
const mysql = require('mysql');

const router = require('express').Router();

router.get('/getFagfelt', async (req, res) => {
    try{
        connection.query('SELECT * FROM fagfelt', (error, results) => {
            res.send(results);
        });

    }catch(err) {
        res.json({message:err});
    }
});

router.get('/getBruker', async (req, res) => {
    // Hent id fra... Hvor? //
    const brukerid = 1;
    try{
        connection.query("SELECT fnavn, enavn, telefon, email FROM bruker WHERE brukerid=" + brukerid, (error, results) => {
            res.send(results);
        });

    }catch(err) {
        res.json({message:err});
    }
});

router.get('/getInteresse', async (req, res) => {
    // Hent id fra... Hvor? //
    const brukerid = 1;
    try{
        connection.query("SELECT brukerid, ", (error, results) => {
            res.send.apply(results);
        });
    }catch(err) {
        res.json({message:err});
    }
})

module.exports = router;