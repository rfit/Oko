
const admin = require('firebase-admin');
const config = require('./config');
require('dotenv').config();

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const functions = require("firebase-functions");
const configureServer = require("./graphql/server");
const getPeopleData = require("./startup/index");

//initialize the server
const server = configureServer();

// create and export the api
const api = functions.region('europe-west1').https.onRequest(server);
const startup = functions.region('europe-west1').https.onRequest(getPeopleData);

module.exports = { api, startup };