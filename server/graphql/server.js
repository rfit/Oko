// require all dependencies to set up server

const express = require("express");
const bodyParser = require('body-parser');
const { ApolloServer, AuthenticationError } = require("apollo-server-express");
const { User } = require('./data/schema');

// cors allows our server to accept requests from different origins
const cors = require("cors");
const { login } = require('./auth');
const { authenticate } = require('./auth');

function configureServer() {
	// invoke express to create our server
	const app = express();

	//use the cors middleware
	app.use(cors());
	app.use(bodyParser.json());

	app.post('/login', (req, res) => {
		const { email, password } = req.body

		login(email, password)
			.then(token => res.json({ token }))
			.catch(() => res.status(401).send())
	});

	app.post('/user', async (req, res) => {
		const { email, password, role } = req.body

		const newUser = await new User({ email, password, role }).save()
		if (!newUser) res.status(500)

		res.json({ email: newUser.email })
	})

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
			const jwtAuth = await authenticate(req, res);
			if (!jwtAuth) throw new AuthenticationError('Invalid JWT');

			const currentUser = await User.findOne({ email: jwtAuth.email }).lean()
			if (!currentUser) throw new AuthenticationError('User does not exist');

			return { currentUser };
		}
	});

	// now we take our newly instantiated ApolloServer and apply the
	// previously configured express application
	server.applyMiddleware({ app, path: '/' });

	// finally return the application
	return app;
}

module.exports = configureServer;
