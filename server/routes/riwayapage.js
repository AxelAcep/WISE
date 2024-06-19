const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../models');
const clientPath = path.join(__dirname, '../public');

router.get('/',  (req, res) => {
    res.sendFile(path.join(clientPath, 'RiwayatPageUser.html'));
});

router.get('/detail',  async(req, res) => {
    const {KodeUser} = req.query;
    console.log(KodeUser);

    const results = await db.sequelize.query(
        ` SELECT da.*, a.NamaAcara, m.Nama AS NamaMitra 
            FROM daftaracara da 
            JOIN acara a ON da.KodeAcara = a.KodeAcara 
            JOIN user_mitra m ON a.KodeMitra = m.KodeMitra 
            WHERE da.NIM = :KodeUser 
            AND da.status = 'Masuk';`,
        {
            replacements: { KodeUser: KodeUser },
            type: db.Sequelize.QueryTypes.SELECT
        }
    );
    console.log(results)
    res.json(results);
});

module.exports = router;
