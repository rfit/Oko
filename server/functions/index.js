
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// require both the firebase function package to define function   
// behavior and your local server config function

const functions = require("firebase-functions");
const configureServer = require("./graphql/server");

//initialize the server
const server = configureServer();

// create and export the api
const api = functions.https.onRequest(server);

module.exports = { api };