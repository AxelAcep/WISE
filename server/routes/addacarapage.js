const express = require('express');
const router = express.Router();
const path = require('path');
const clientPath = path.join(__dirname, '../public');
const db = require('../models');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(clientPath, 'Data', 'BannerImage'));
    },
    filename: function (req, file, cb) {
        cb(null, generateRandomFileName());
    }
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, 'DetailEventMitra.html'));
});

router.get('/detail', async (req, res) => {
    try {
        const { user } = req.query;
        console.log(user);

        const results = await db.sequelize.query(
            `SELECT * from user_mitra where KodeMitra = :KodeMitra ;`,
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

router.post('/addimage', async (req, res) => {
    (upload.single('gambar'))(req, res, function (err) {
        if (err) {
            console.error('Error uploading image:', err);
            return res.status(500).json({ error: 'Failed to upload image' });
        }
        
        const fileName = req.file.filename;const kodeunik = fileName.split('.')[0];
        console.log(fileName);
        return res.status(201).json({ message: 'Image uploaded successfully', fileName: fileName, KodeAcaraUnik: kodeunik });
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

        console.log(req.body);

        const insertQuery = `
            INSERT INTO acara (
                KodeAcara, KodeMitra, NamaAcara, Tanggal, Waktu, tag, text0, text1, text2, LinkGambar, Status
            ) VALUES (
                :KodeAcara, :KodeMitra, :NamaAcara, :Tanggal, :Waktu, '', :Paragraf1, :Paragraf2, :Paragraf3, :NamaGambar, 'Pending'
            );
        `;

        await db.sequelize.query(insertQuery, {
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
            type: db.Sequelize.QueryTypes.INSERT
        });

        res.status(201).send('Event added successfully');

    } catch (err) {
        console.error('Error adding event:', err);
        res.status(500).send('Error adding event');
    }
});

function generateRandomFileName() {
    const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Generate random huruf dari A sampai Z
    const randomDigits = Math.floor(100 + Math.random() * 900); // Generate random 3 digit angka
    return `${randomChar}-${randomDigits}.jpg`; // Formatkan nama file sesuai dengan yang diinginkan
}
module.exports = router;
