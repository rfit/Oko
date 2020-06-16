// require all dependencies to set up server

const express = require("express");
const { ApolloServer, AuthenticationError } = require("apollo-server-express");
const { User } = require('./data/schema');

// cors allows our server to accept requests from different origins
const cors = require("cors");
const passport = require('passport');
const { login } = require('./auth');
const { authenticate } = require('./auth');

function getUserByToken (token) {
	return new Promise(resolve => { throw Error('Eyyy') })
}

function configureServer() {
	// invoke express to create our server
	const app = express();
	app.get('/profile', async (req, res) => {
		const eyy = await authenticate(req, res)
		res.send(eyy)
	})

	app.get('/login',
		function(req, res) {
			res.send(login(12345));
		}
	);

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
		context: async ({ req, res }) => {
			let authToken = null;
			let currentUser = null;

			try {
				authToken = req.headers.authorization.replace('Bearer ', '');
				if (authToken) {
					currentUser = await getUserByToken(authToken);
				}
			} catch (e) {
				console.log(`Unable to authenticate using auth token: ${authToken}`, e);
				throw new AuthenticationError('Invalid JWT');
			}

			return {
				authToken,
				currentUser,
			};
		}
	});

	// now we take our newly instantiated ApolloServer and apply the
	// previously configured express application
	server.applyMiddleware({ app, path: '/api' });

	// finally return the application
	return app;
}

module.exports = configureServer;
