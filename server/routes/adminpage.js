const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../models');
const clientPath = path.join(__dirname, '../public');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/',  (req, res) => {
    res.sendFile(path.join(clientPath, 'EventAcaraAdmin.html'));
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
                user_mitra.Nama 
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

router.post('/acc', upload.none(), async (req, res) => {
    try {
        const { yesorno, KodeAcara } = req.body;
        let statusterima;
        
        if (yesorno === "true") {
            statusterima = "Berjalan";
        } else {
            statusterima = "Ditolak";
        }

        console.log(statusterima);
        
        const updateQuery = `
            UPDATE acara SET STATUS = :statusterima WHERE KodeAcara = :KodeAcara;
        `;
        
        await db.sequelize.query(updateQuery, {
            replacements: {
                statusterima,
                KodeAcara
            },
            type: db.Sequelize.QueryTypes.UPDATE 
        }); 

        res.status(200).send('Status updated successfully');
    } catch(err) {
        console.error('Error updating event status:', err);
        res.status(500).send('Error updating event status');
    }
});

router.get('/usermahasiswa', async (req, res) => {
    const results = await db.sequelize.query(
        `SELECT *
         FROM 
        user_mahasiswa `,
        {
            type: db.Sequelize.QueryTypes.SELECT
        }
    );
    console.log(results)
    res.json(results);
});

router.post('/hapusmahasiswa', upload.none() ,async (req, res) => {
    const { NIM } = req.body;
    console.log(req.body); 

    var NIMP = [];
    NIMP = NIM;
    if (!Array.isArray(NIMP)) {
        NIMP = [NIMP];
    }

    const updatePromises = [];

    if (NIMP[0] !== undefined) {
    const updatePromises = [];

    NIMP.forEach(nim => {
        // Hapus data dari tabel daftaracara
        const deleteDaftaracara = db.sequelize.query(
            `DELETE FROM daftaracara WHERE NIM = :NIM`,
            {
                replacements: { NIM: nim },
                type: db.sequelize.QueryTypes.DELETE
            }
        );
        updatePromises.push(deleteDaftaracara);

        // Hapus data dari tabel user_mahasiswa
        const deleteUserMahasiswa = db.sequelize.query(
            `DELETE FROM user_mahasiswa WHERE NIM = :NIM`,
            {
                replacements: { NIM: nim },
                type: db.sequelize.QueryTypes.DELETE
            }
        
        );        updatePromises.push(deleteUserMahasiswa);

    })
    await Promise.all(updatePromises);
        res.status(400).json({ message: 'Data berhasil diperbarui' });
} 
} 
)

router.get('/usermitra', async (req, res) => {
    const results = await db.sequelize.query(
        `SELECT *
         FROM 
        user_mitra`,
        {
            type: db.Sequelize.QueryTypes.SELECT
        }
    );
    console.log(results)
    res.json(results);
});

router.post('/hapusmitra', upload.none(), async (req, res) => {
    const { KodeMitra } = req.body;
    console.log(req.body);

    // Memastikan KodeMitra dapat diiterasi
    let KodeMitraArray = [];
    if (!Array.isArray(KodeMitra)) {
        KodeMitraArray = [KodeMitra];
    } else {
        KodeMitraArray = KodeMitra;
    }

    const updatePromises = [];

    // Melakukan penghapusan untuk setiap KodeMitra yang diberikan
    if (KodeMitraArray.length > 0) {
        KodeMitraArray.forEach(KodeMitra => {
            // Hapus data dari tabel daftaracara
            const deleteDaftaracara = db.sequelize.query(
                `delete da from daftaracara da JOIN acara a ON da.KodeAcara = a.KodeAcara where a.kodemitra = :KodeMitra;`,
                {
                    replacements: { KodeMitra: KodeMitra },
                    type: db.sequelize.QueryTypes.DELETE
                }
            );
            updatePromises.push(deleteDaftaracara);

            // Hapus data dari tabel Acara
            const deleteAcara = db.sequelize.query(
                `DELETE FROM acara WHERE KodeMitra = :KodeMitra`,
                {
                    replacements: { KodeMitra: KodeMitra },
                    type: db.sequelize.QueryTypes.DELETE
                }
            );
            updatePromises.push(deleteAcara);

            // Hapus data dari tabel user_mahasiswa
            const deleteUserMahasiswa = db.sequelize.query(
                `DELETE FROM user_mitra WHERE KodeMitra = :KodeMitra`,
                {
                    replacements: { KodeMitra: KodeMitra },
                    type: db.sequelize.QueryTypes.DELETE
                }
            );
            updatePromises.push(deleteUserMahasiswa);
        });

        try {
            // Menunggu semua query DELETE selesai
            await Promise.all(updatePromises);
            res.status(200).json({ message: 'Data berhasil diperbarui' });
        } catch (error) {
            console.error('Error deleting data:', error);
            res.status(500).json({ message: 'Terjadi kesalahan saat menghapus data' });
        }
    } else {
        // Jika tidak ada KodeMitra yang diberikan
        res.status(400).json({ message: 'Harap berikan KodeMitra yang valid' });
    }
});

router.post('/addmahasiswa', upload.none(), async (req, res) => {
    const { NIM, Nama, password } = req.body;
    console.log(req.body);

    const updateQuery = `
        INSERT INTO user_mahasiswa (NIM, Nama, password) VALUES (:NIM, :Nama, :password);
    `;

    try {
        await db.sequelize.query(updateQuery, {
            replacements: {
                NIM,
                Nama,
                password
            }
        });
        res.status(202).json({ message: 'Mahasiswa berhasil ditambahkan' });
    } catch (error) {
        console.error('Error adding mahasiswa:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan mahasiswa' });
    }
});

router.post('/addmitra', upload.none(), async (req, res) => {
    const { KodeMitra, Nama, password, status } = req.body;
    console.log(req.body);

    const insertQuery = `
        INSERT INTO user_mitra (KodeMitra, Nama, password, Status) VALUES (:KodeMitra, :Nama, :password, :status);
    `;

    try {
        await db.sequelize.query(insertQuery, {
            replacements: {
                KodeMitra,
                Nama,
                password,
                status
            }
        });
        res.status(201).json({ message: 'Mitra berhasil ditambahkan' });
    } catch (error) {
        console.error('Error adding mitra:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan mitra' });
    }
});



module.exports = router;
