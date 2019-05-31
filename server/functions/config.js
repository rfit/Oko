/*
    Firebase loads form here: https://firebase.google.com/docs/functions/config-env

    Can be set like:

    firebase functions:config:set oeko.heimdal.key="THE API KEY" 

    
*/

const functions = require('firebase-functions');
require('dotenv').config();

console.log(functions.config());

const config = {
    HEIMDAL_APIKEY: process.env.HEIMDAL_PEOPLE_APIKEY || functions.config().oeko.heimdal.key
}

console.log(config, functions.config());

module.exports = config;