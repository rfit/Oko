# API Documentation

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
