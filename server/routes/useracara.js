const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../models');
const clientPath = path.join(__dirname, '../public');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/',  (req, res) => {
    res.sendFile(path.join(clientPath, 'DetailEventUser.html'));
});


router.get('/event', async (req, res) => {
    try {

        const { KDAcara } = req.query;
        console.log( KDAcara );

        const results = await db.sequelize.query(
            ` SELECT a.*, um.Nama, um.LinkProfil
                From
             acara a JOIN user_mitra um 
                ON a.KodeMitra = um.KodeMitra
             where KodeAcara = :KDAcara ;
                `,
            {
                replacements: { KDAcara: KDAcara },
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


router.post('/daftar', upload.none() ,async(req, res) => {
    try {
        const { KodeAcara, KodeUser, LinkDetail, Status } = req.body;
        console.log(req.body);
        console.log(KodeAcara);
        
        const checkQuery = await db.sequelize.query(
            `SELECT * FROM daftaracara WHERE KodeAcara = :KodeAcara AND NIM = :KodeUser;`,
            {
                replacements: { KodeAcara, KodeUser },
                type: db.Sequelize.QueryTypes.SELECT
            }
        );
        
        console.log(checkQuery);

        if (checkQuery.length === 0) {
            const insertQuery =  `INSERT INTO daftaracara values (:KodeUser, :KodeAcara, :LinkDetail, "Ditolak");`;
            await db.sequelize.query(insertQuery, {
                replacements: {
                    KodeUser, KodeAcara, LinkDetail
                },
                type: db.Sequelize.QueryTypes.UPDATE
            });
            
            res.status(200).json({ message: 'Berhasil' });
        } else {
            res.status(400).json({ message: 'Daftar Gagal / Sudah Terdaftar' });
        }
        //const checkQuery = 'SELECT * FROM daftaracara WHERE KodeAcara = $1 AND KodeUser = $2';
        //const checkResult = await pool.query(checkQuery, [KodeAcara, KodeUser]);
 /* 
        if (checkResult.rows.length > 0) {
            console.log("Data Sama")
            //return res.status(400).json({ message: 'Daftar Gagal / Sudah Terdaftar' });
        }

      const insertQuery = `
            INSERT INTO daftaracara (NIM, KodeUser, LinkDetail, Status)
            VALUES ($2, $1, $3, $4)
            RETURNING *
        `;
        const insertResult = await pool.query(insertQuery, [KodeAcara, KodeUser, LinkDetail, Status]);
        res.status(201).json({ message: 'Daftar Berhasil', data: insertResult.rows[0] });

   */ } catch{

    }
})    


module.exports = router;
