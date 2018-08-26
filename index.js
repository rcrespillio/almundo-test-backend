let initApi = require('./api.endpoints');
let DatabaseServiceClass = require('./database.service');
let ServerClass = require('./server');

let server = new ServerClass();
let databaseService = new DatabaseServiceClass();

databaseService.initialize().then( ()=>{
    initApi(server, databaseService);
    server.listen();
});