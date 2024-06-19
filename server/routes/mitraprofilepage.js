const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../models');
const clientPath = path.join(__dirname, '../public');

router.get('/',  (req, res) => {
    res.sendFile(path.join(clientPath, 'MitraProgfil.html'));
});

router.get('/detail',  async(req, res) => {
    try {
        const { user } = req.query;
        console.log(user);

        const results = await db.sequelize.query(
            `SELECT um.*, 
                (SELECT COUNT(*) FROM acara a WHERE a.status = 'Pending' AND a.KodeMitra = um.KodeMitra) AS acarapending,
                (SELECT COUNT(*) FROM acara a WHERE a.status = 'Berjalan' AND a.KodeMitra = um.KodeMitra) AS acaraberjalan,
                (SELECT COUNT(*) FROM acara a WHERE a.KodeMitra = um.KodeMitra) AS totalacara
            FROM 
                user_mitra um
            WHERE 
                um.KodeMitra = :KodeMitra ;`,
            {
                replacements: { KodeMitra: user },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );
        res.json(results);

    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).send('Error fetching events');
    }
});

module.exports = router;
