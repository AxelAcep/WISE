const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv').config(); 

const app = express();

const homeRoute = require('./routes/homepage');
const userRoute = require('./routes/userpage');
const userprofileRoute = require('./routes/userprofilepage');
const useracaraRoute = require('./routes/useracara');
const mitraRoute = require('./routes/mitrapage');
const mitraprofileRoute = require('./routes/mitraprofilepage');
const addacararoute = require('./routes/addacarapage');
const editacararoute = require('./routes/editacara');
const editpending = require('./routes/editpending');
const userhistoryRoute = require('./routes/riwayapage');
const adminacaraRoute = require('./routes/adminpage');

// Middleware
app.use(cors());
app.use(express.json());

// Middleware untuk melayani berkas statis dari direktori 'public'
app.use('/JS', express.static(path.join(__dirname, 'public/JS')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/asset', express.static(path.join(__dirname, 'public/asset')));
app.use('/Data', express.static(path.join(__dirname, 'public/Data')));

// Routes
app.use('/', homeRoute);
app.use('/user', userRoute);
app.use('/userprofile', userprofileRoute);
app.use('/useracara', useracaraRoute);
app.use('/riwayat', userhistoryRoute);
app.use('/mitra', mitraRoute);
app.use('/mitraprofile', mitraprofileRoute);
app.use('/addacarapage', addacararoute);
app.use('/editacarapage', editacararoute);
app.use('/editpending', editpending);
app.use('/admin', adminacaraRoute);

// Start server
const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log("Server berjalan pada port:", port);
});

module.exports = app;
