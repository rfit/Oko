# Øko App
This is the code for the Roskilde Festival ØKO App.

## Server 
Server code is located in `server/`, and is hosted on firebase.

Graphiql can be found at: https://us-central1-okoapp-staging.cloudfunctions.net/api/graphql

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
