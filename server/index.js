
const config = require('./config');
require('dotenv').config();


const configureServer = require("./graphql/server");
// const getPeopleData = require("./startup/index");

//initialize the server
const server = configureServer();
server.listen(config.API_PORT, () => console.log(`API listening on http://localhost:${config.API_PORT}`));
