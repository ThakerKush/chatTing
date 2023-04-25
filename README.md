## ChatTing

### A Group Chat backend.

### Required Environment variables
```
USERNAME=postgres       -> PostgresSQL database username    
PASSWORD=postgres       -> PostgresSQL database password  
DATABASE=chatTingggg    -> PostgresSQL database Name  
HOST=127.0.0.1          -> PostgresSQL database Host  
DIALECT=postgres        -> Dialect Postgres for Sequeilze  
PORT=5433               -> PostgresSQL port  
RHOST=localhost         -> Redis Host  
RPORT=6379              -> Redis Port  
SECRET=somePrivateKey   -> Secrete key for signing and decoding JWT's for auth  
```
### How to run the project

Run npm install on:

- chatTing
- chatTing/chatService
- chatTing/syncingService  

This will install all the dependencies.

Before Running any files make sure you run the migrations, by running node migrate up --step 4, this will setup the database.
Go to chatService/src and run the server.ts file, this runs the REST API and to backup messages run the message syncing service by going to syncingService and running the index.ts file.

For more information on this project read [this detailed article](https://thakerkush.com/projects/chat-ting/)
