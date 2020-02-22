// require all dependencies to set up server
const express = require("express");
const admin = require('firebase-admin');
const { ApolloServer } = require("apollo-server-express");

// cors allows our server to accept requests from different origins
const cors = require("cors");

function tradeTokenForUser(token) {
	return admin.auth().verifyIdToken(token)
		.then(function(decodedToken) {
			return decodedToken;
		}).catch(function(error) {
			console.log('Token not valid!', error);
			return 'Not a valid token';
			// Handle error
		});
}

function configureServer() {
	// invoke express to create our server
	const app = express();
	
	//use the cors middleware
	app.use(cors());

	const typeDefs = require('./data/typedefs');
	const resolvers = require('./data/resolvers');
		
	const server = new ApolloServer({
		cors: true,
		typeDefs,
		resolvers,
		engine: {
			apiKey: process.env.ENGINE_API_KEY
		},
		introspection: true,
		playground: true,
		/* Add this line to disable upload support! */
		/* https://www.apollographql.com/docs/apollo-server/v2/migration-file-uploads.html */
		uploads: false,
		// Add current user / auth to context
		context: async ({ req }) => {
			let authToken = null;
			let currentUser = null;
		
			try {
				authToken = req.headers['authorization'].replace('Bearer ', '');
				if (authToken) {
					currentUser = await tradeTokenForUser(authToken);
				}
			} catch (e) {
				console.log(`Unable to authenticate using auth token: ${authToken}`, e);
			}
		
			return {
				authToken,
				currentUser,
			};
		}
	});

	// now we take our newly instantiated ApolloServer and apply the
	// previously configured express application
	server.applyMiddleware({ app, path: '/' });

	// finally return the application
	return app;
}

module.exports = configureServer;