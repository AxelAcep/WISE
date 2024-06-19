const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../models');
const clientPath = path.join(__dirname, '../public');

router.get('/',  (req, res) => {
    res.sendFile(path.join(clientPath, 'ProfileUserPage.html'));
});

router.get('/detail',  async(req, res) => {
    try {
        const { user } = req.query;
        console.log(user);

        const results = await db.sequelize.query(
            "SELECT * FROM user_mahasiswa WHERE NIM = :NIM",
            {
                replacements: { NIM: user },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );
        console.log(results);
        res.json(results);

    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).send('Error fetching events');
    }
});

module.exports = router;
