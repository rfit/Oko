# Oko
[![CircleCI](https://circleci.com/gh/rfit/Oko.svg?style=svg)](https://circleci.com/gh/rfit/Oko) [![codecov](https://codecov.io/gh/rfit/Oko/branch/master/graph/badge.svg)](https://codecov.io/gh/rfit/Oko)

Welcome to Oko! This project is used for Roskilde Festival. It's helping tracking the amount of organic food and brevages for merchants and the entire festival.

It replaces the [Organic Accounting Sheet](https://www.oekologisk-spisemaerke.dk/media/1104/organic-accounting-sheet.xls). A excel sheet, with an app that work on most devices - it also makes it possible to keep an overview of all the merchants on the festival, so we can reach out to ones below the threshold. 

Read more about the labeling here: [The Organic Cuisine Label](https://www.oekologisk-spisemaerke.dk/horeca-en)

## Code
The project its split in two, a client and a server. The server is an API and you can develop any new client to work with it, as it's not tied to the backend in anyway other than the data contract.

The API is powered by GraphQL, and you can get some insights by looking at the schema.

### Getting started

To get the project running you need a few things. But these are documented under each part of the app, so take a look under both the server and the client folder.

- #### [Server](server/README.md)
- #### [Client](client/README.md) 

### Quick links

#### Prod
- Client: https://okoapp-production.firebaseapp.com/
- API: https://europe-west1-okoapp-production.cloudfunctions.net/api

#### Staging
- Client: https://okoapp-staging.firebaseapp.com/
- API: https://europe-west1-okoapp-staging.cloudfunctions.net/api

# Team
- [Allan Kimmer Jensen](https://github.com/Saturate)
- [Mikael Sørensen](https://github.com/skoleb)
