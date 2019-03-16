// Firebase Setup
const admin = require('firebase-admin');
// Modules imports
const express = require('express');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const config = require('../heimdalKey');

// Instagram OAuth 2 setup
const credentials = {
    client: {
      id: config.people.clientId,
      secret: config.people.clientSecret
    },
    auth: {
      tokenHost: 'https://sso.roskilde-festival.dk/account/login',
      tokenPath: 'https://sso.roskilde-festival.dk'
    }
  };

const oauth2 = require('simple-oauth2').create(credentials);  

// Path to the OAuth handlers.
const OAUTH_REDIRECT_PATH = 'http://localhost:3000/auth/heimdal/callback';
const OAUTH_CALLBACK_PATH = '/auth/heimdal/callback';



/**
 * Creates a Firebase account with the given user profile and returns a custom auth token allowing
 * signing-in this account.
 * Also saves the accessToken to the datastore at /instagramAccessToken/$uid
 *
 * @returns {Promise<string>} The Firebase custom auth token in a promise.
 */
function createFirebaseAccount(peopleID, displayName, photoURL, accessToken) {
    // The UID we'll assign to the user.
    const uid = `people:${peopleID}`;
  
    // Save the access token to the Firebase Realtime Database.
    const databaseTask = admin.database().ref(`/HeimdalAccessToken/${uid}`)
        .set(accessToken);
  
    // Create or update the user account.
    const userCreationTask = admin.auth().updateUser(uid, {
      displayName: displayName,
      photoURL: photoURL
    }).catch(error => {
      // If user does not exists we create it.
      if (error.code === 'auth/user-not-found') {
        return admin.auth().createUser({
          uid: uid,
          displayName: displayName,
          photoURL: photoURL
        });
      }
      throw error;
    });
  
    // Wait for all async task to complete then generate and return a custom auth token.
    return Promise.all([userCreationTask, databaseTask]).then(() => {
      // Create a Firebase custom auth token.
      const token = admin.auth().createCustomToken(uid);
      console.log('Created Custom token for UID "', uid, '" Token:', token);
      return token;
    });
  }


module.exports = (request, response) => {

    return createFirebaseAccount(12345, 'Sllan Kimmer JEnsen', 'https://www.dagens.dk/files/styles/article_top_fullwidth_1x/public/media/2016/31/kat_15.jpg?itok=Jca_3xTm', '324nebriubgosu').then((data)=> {
        return response.send('Created user!' + data);
    })

}
