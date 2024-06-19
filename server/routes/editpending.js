const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../models');
const clientPath = path.join(__dirname, '../public');
const multer = require('multer');

router.get('/',  (req, res) => {
    res.sendFile(path.join(clientPath, 'EventOnGoingPending.html'));
});

module.exports = router;