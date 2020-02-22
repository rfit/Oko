/*
    Firebase loads form here: https://firebase.google.com/docs/functions/config-env

    Can be set like:

    firebase functions:config:set oeko.heimdal.key="THE API KEY"
    firebase functions:config:set oeko.gmail.password="THE API KEY"
*/

const functions = require('firebase-functions');
require('dotenv').config();

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const connectionUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:27017/oko`
mongoose.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('open', () => console.log(`Connected to mongo at mongodb://${process.env.MONGO_HOST}:27017/oko`))
mongoose.connection.on('error', e => console.log(`Failed connecting to mongo: ${e}`))

const config = {
    HEIMDAL_APIKEY: process.env.HEIMDAL_PEOPLE_APIKEY || functions.config().oeko.heimdalapikey,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD || functions.config().oeko.gmail.password,
    GMAIL_USER: process.env.GMAIL_USER || functions.config().oeko.gmail.user
}

module.exports = config;