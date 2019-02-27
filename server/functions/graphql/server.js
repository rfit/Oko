// require all dependencies to set up server
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
// cors allows our server to accept requests from different origins
const cors = require("cors");

function configureServer() {
    // invoke express to create our server
    const app = express();
    
    //use the cors middleware
    app.use(cors());

    const typeDefs = require('./data/schema');
    const resolvers = require('./data/resolvers');
    
    const server = new ApolloServer({
        cors: true,
        typeDefs,
        resolvers,
        engine: {
          apiKey: "service:okoapp-test:9RcfHAa2lsv0CdFxEM0rzQ"
        },
        introspection: true,
        playground: true,
        /* Add this line to disable upload support! */
        /* https://www.apollographql.com/docs/apollo-server/v2/migration-file-uploads.html */
        uploads: false,
    });
    // now we take our newly instantiated ApolloServer and apply the   // previously configured express application
    server.applyMiddleware({ app });
    // finally return the application
    return app;
}
module.exports = configureServer;