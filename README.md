# Oko

Welcome to Oko! This project is used for Roskilde Festival. It's helping tracking the amount of organic food and brevages for merchants and the entire festival.

The project its split in two, a client and a server. The server is an API and you can develop any new client to work with it, as it's not tied to the backend in anyway other that the data contract.

The API is powered by GraphQL, and you can get some insights by looking at the schema.

Read more about the labeling here: [The Organic Cuisine Label](https://www.oekologisk-spisemaerke.dk/horeca-en)

## Server 
Server code is located in `server/`, and is hosted on firebase.

Graphiql can be found at: https://europe-west1-okoapp-staging.cloudfunctions.net/api/graphql

Firestore data structure:

**users** 
- id (peopleId)
- email (e.g. mikael.soerensen@roskilde-festival.dk)
- name (e.g. Mikael Sørensen)
- peopleId (e.g. 123456)
- role (e.g. Admin/Editor)
- teams [12,42,12,..] (id som array)

**teams** 
- id (peopleId)
- name (e.g. Økoboden)
- peopleId (e.g. 1234)
- measurement (e.g. Null, KG, KR)

**invoices** 
- id (firebaseId)
- createdDate
- invoiceDate
- invoiceId (e.g. 213535)
- teamId (peopleID)
- userId (peopleID)
- userName (e.g. Mikael)
- eco (e.g. 80)
- nonEco (e.g. 10)
- excluded (e.g. 10)
- total (e.g. 100)


## Client
Client code is located in `client/`.

Can be found at: https://okoapp-staging.firebaseapp.com/

# Team

- Allan Kimmer Jensen
- Mikael Sørensen
