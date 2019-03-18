# Øko App
This is the code for the Roskilde Festival ØKO App.

## Server 
Server code is located in `server/`, and is hosted on firebase.

Graphiql can be found at: https://us-central1-okoapp-staging.cloudfunctions.net/api/graphql

Firestore data structure:

**users** (firebaseId)
- email (e.g. mikael.soerensen@roskilde-festival.dk)
- name (e.g. Mikael Sørensen)
- peopleId (e.g. 123456)
- role (e.g. Admin/Editor)

**teams** (firebaseId)
- name (e.g. Økoboden)
- peopleTeamId (e.g. 1234)
- measurement (e.g. Null, KG, KR)

**invoices** (firebaseId)
- createdDate
- invoiceDate
- invoiceId (e.g. 213535)
- teamId (firebaseID)
- userId (firebaseID)
- eco (e.g. 80)
- nonEco (e.g. 10)
- excluded (e.g. 10)
- total (e.g. 100)

**roles** (userId_teamId)
- userId (firebaseId)
- teamId (firebaseId)


## Client
Client code is located in `client/`.

Can be found at: https://okoapp-staging.firebaseapp.com/

# Team

- Allan Kimmer Jensen
- Mikael Sørensen
