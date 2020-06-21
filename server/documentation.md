# API Documentation

## Storage
The API is using a MongoDB database.  
In order to run one while developing, you can use the provided `docker-compose.yaml` file for spinning up a db.

## Auth
Passwords are stored hashed and salted in the database.  
Authentication is being done using JWT's. JWT must be included in the request Authorization header as a bearer token. 

User creation: 
* Endpoint: `POST /user`  
* Request body: `{ email, password, role }`
* Response body: `{ email }`

Login: 
* Endpoint: `POST /login`
* Request body: `{ email, password }`
* Response body: `{ token }`  

GraphQL Endpoint: `/gql`
