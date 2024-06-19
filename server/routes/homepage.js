const express = require('express');
const router = express.Router();
const path = require('path');
const { authenticateUser } = require('../controller/HomeControl');
const clientPath = path.join(__dirname, '../public');

router.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, 'HomePage.html'));
});

router.post('/', async (req, res) => {
    const { idinput1, idinput2 } = req.body;

    try {
        const result = await authenticateUser(idinput1, idinput2);
        res.json(result);
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
