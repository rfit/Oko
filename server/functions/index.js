
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// require both the firebase function package to define function   
// behavior and your local server config function


const admin = require('firebase-admin');

var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const settings = {timestampsInSnapshots: false};
admin.firestore().settings(settings);

const functions = require("firebase-functions");
const configureServer = require("./graphql/server");
const peopleLogin = require("./login/index");
const getPeopleData = require("./startup/index");

//initialize the server
const server = configureServer();

// create and export the api
const api = functions.region('europe-west1').https.onRequest(server);
const login = functions.region('europe-west1').https.onRequest(peopleLogin);
const startup = functions.region('europe-west1').https.onRequest(getPeopleData);

module.exports = { api, login, startup };