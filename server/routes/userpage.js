const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../models');
const clientPath = path.join(__dirname, '../public');

router.get('/',  (req, res) => {
    res.sendFile(path.join(clientPath, 'EventUserPage.html'));
});

router.get('/event', async (req, res) => {
    try {
        const results = await db.sequelize.query(
            `SELECT 
                acara.NamaAcara, 
                acara.LinkGambar, 
                acara.Tanggal,
                acara.Status,
                acara.KodeAcara, 
                user_mitra.Nama, 
                user_mitra.LinkProfil 
             FROM 
                acara 
             JOIN 
                user_mitra 
             ON 
                acara.kodeMitra = user_mitra.KodeMitra`,
            {
                type: db.Sequelize.QueryTypes.SELECT
            }
        );
        console.log(results)
        res.json(results);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).send('Error fetching events');
    }
});


module.exports = router;
