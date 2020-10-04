require('dotenv').config();
const router = require('express').Router();
const mongoose = require('mongoose');


const connectDB = () => {
    // Database Connection
    mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log('Database Connected.');
    }).catch(err => {
        console.log('Connection Failed.');
    })
}
module.exports = connectDB;