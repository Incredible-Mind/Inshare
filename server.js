const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

const connectDB = require('./config/db');
const { static } = require('express');
connectDB();

// Cors Options
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.split(',')
};
app.use(cors(corsOptions));

//Template Engine
app.use(express.static('public'))
app.use(express.json());
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    res.render('home');
});
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));


app.listen(PORT, () => {
    console.log(`Listening On Port ${PORT}`);
});