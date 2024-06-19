const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const dotenv = require('dotenv').config(); 
const clientPath = path.join(__dirname, '/public');

const homeRoute = require('./routes/homepage');
const userRoute = require('./routes/userpage');
const userprofileRoute = require('./routes/userprofilepage');
const useracaraRoute = require('./routes/useracara');

const mitraRoute = require('./routes/mitrapage');
const mitraprofileRoute = require('./routes/mitraprofilepage');
const addacararoute = require('./routes/addacarapage')
const editacararoute = require('./routes/editacara')
const editpending = require('./routes/editpending');
const userhistoryRoute = require('./routes/riwayapage');

const adminacaraRoute = require('./routes/adminpage');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public/"))

app.use('/', homeRoute);
app.use('/user', userRoute)
app.use('/userprofile', userprofileRoute);
app.use('/useracara', useracaraRoute)
app.use('/riwayat', userhistoryRoute)

app.use('/mitra', mitraRoute);
app.use('/mitraprofile', mitraprofileRoute);
app.use('/addacarapage', addacararoute);
app.use('/editacarapage', editacararoute);
app.use('/editpending', editpending);

app.use('/admin', adminacaraRoute)

app.listen(4001, async () => {
    console.log("Server berjalan pada port:", process.env.PORT );
});    
