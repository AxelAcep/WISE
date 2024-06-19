const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../models');
const clientPath = path.join(__dirname, '../public');
const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.get('/',  (req, res) => {
    res.sendFile(path.join(clientPath, 'EventOnGoing.html'));
});

router.get('/event', async (req, res) => {
    try {
        const { KDAcara } = req.query;
        console.log(KDAcara);

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
    }catch(error){
        console.error('Error fetching events:', error);
        res.status(500).send('Error fetching events');
    }
});

router.post('/addimage', upload.single('gambar'), async (req, res) => {
    const kodeunik = req.body.KodeAcara; 

    const destination = path.join(clientPath, 'Data', 'BannerImage');
    const filename = `${kodeunik}.jpg`;

    const fs = require('fs');
    const filePath = path.join(destination, filename);

    fs.writeFile(filePath, req.file.buffer, (err) => {
        if (err) {
            console.error('Error saving image:', err);
            return res.status(500).json({ error: 'Failed to save image' });
        }

        console.log("File saved as:", filePath);
        return res.status(201).json({ message: 'Image uploaded successfully', KodeAcaraUnik: kodeunik, LinkGambarUnik: filename });
    });
});

router.post('/addEvent', upload.none(), async (req, res) => {
    try {
        const {
            KodeAcara,
            KodeMitra,
            NamaAcara,
            Tanggal,
            Waktu,
            Paragraf1,
            Paragraf2,
            Paragraf3,
            NamaGambar
        } = req.body;

        const updateQuery = `
                UPDATE acara
                SET 
                    KodeMitra = :KodeMitra,
                    NamaAcara = :NamaAcara,
                    Tanggal = :Tanggal,
                    Waktu = :Waktu,
                    tag = '',
                    text0 = :Paragraf1,
                    text1 = :Paragraf2,
                    text2 = :Paragraf3,
                    LinkGambar = :NamaGambar
                WHERE KodeAcara = :KodeAcara;
            `;
    
        await db.sequelize.query(updateQuery, {
                replacements: {
                    KodeAcara,
                    KodeMitra,
                    NamaAcara,
                    Tanggal,
                    Waktu,
                    Paragraf1,
                    Paragraf2,
                    Paragraf3,
                    NamaGambar
                },
        type: db.Sequelize.QueryTypes.UPDATE
    });

        res.status(201).send('Event added successfully');

    } catch (err) {
        console.error('Error adding event:', err);
        res.status(500).send('Error adding event');
    }
});


router.post('/acc', upload.none(), async (req, res) => {
    const { yesorno, KodeAcara } = req.body;
  
    console.log('Request Body:', yesorno); // Tambahkan ini untuk debug
    console.log('Request Body:', KodeAcara); // Tambahkan ini untuk debug
  
    const updateQuery = `
      UPDATE acara SET STATUS = :yesorno WHERE KodeAcara = :KodeAcara;
    `;
    
    try {
      await db.sequelize.query(updateQuery, {
        replacements: {
          yesorno,
          KodeAcara
        },
        type: db.Sequelize.QueryTypes.UPDATE
      });
      res.status(200).send({ message: 'Update successful' });
    } catch (error) {
      console.error('Error updating database:', error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  });


router.get('/hadir', upload.none(), async (req, res) => {
    const {KodeAcara} = req.query;
    console.log(KodeAcara);
    const results = await db.sequelize.query(
        ` SELECT daftaracara.*, user_mahasiswa.Nama 
            FROM daftaracara 
            JOIN user_mahasiswa ON daftaracara.NIM = user_mahasiswa.NIM
            WHERE KodeAcara = :KodeAcara;`,
             {
                 replacements: { KodeAcara: KodeAcara },
                 type: db.Sequelize.QueryTypes.SELECT
             }
         );
         console.log(results);
         res.json(results);

})

router.post('/addhadir', upload.none() ,async (req, res) => {
    const { NIM, KodeAcara, NIM0 } = req.body;
    console.log(req.body);

    var NIMP = [];
    NIMP = NIM;
    if (!Array.isArray(NIMP)) {
        NIMP = [NIMP];
    }

    var NIMB = [];
    NIMB = NIM0;
    if (!Array.isArray(NIMB)){
        NIMB = [NIMB];
    }

    const updatePromises = [];

    if(NIMP[0] != undefined){
        NIMP.forEach(nim => {
            //console.log(nim);
            const updatequery = db.sequelize.query(
                `UPDATE daftaracara set Status = "Masuk" WHERE NIM = :nim && KodeAcara = :KodeAcara ;`,
                    {
                        replacements: { nim, KodeAcara},
                        type: db.sequelize.QueryTypes.UPDATE
                    }
            );
            updatePromises.push(updatequery);
        })
        await Promise.all(updatePromises);
        }
        const updatePromises1 = [];

        if(NIMB[0] != undefined){
            NIMB.forEach(nim => {
                //console.log(nim);
                const updatequery = db.sequelize.query(
                    `UPDATE daftaracara set Status = "Ditolak" WHERE NIM = :nim && KodeAcara = :KodeAcara ;`,
                        {
                            replacements: { nim, KodeAcara},
                            type: db.sequelize.QueryTypes.UPDATE
                        }
                );
                updatePromises1.push(updatequery);
            })
            await Promise.all(updatePromises1);
        } 

        res.status(200).json({ message: 'Data berhasil diperbarui' });

  });


module.exports = router;