require('dotenv').config();

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const mongoUser = process.env.MONGO_USER || 'mongo'
const mongoPass = process.env.MONGO_PASSWORD || 'mongo'
const mongoHost = process.env.MONGO_HOST || 'localhost'

const connectionUrl = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:27017/oko`
mongoose.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('open', () => console.log(`Connected to mongo at mongodb://${process.env.MONGO_HOST || 'mongo'}:27017/oko`))
mongoose.connection.on('error', e => console.log(`Failed connecting to mongo: ${e}`))

const config = {
    HEIMDAL_APIKEY: process.env.HEIMDAL_PEOPLE_APIKEY,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    GMAIL_USER: process.env.GMAIL_USER,
    API_PORT: process.env.API_PORT || 8080,
    JWT_SECRET: process.env.JWT_SECRET || 'secret'
}

module.exports = config;
