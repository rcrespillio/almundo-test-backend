let restify = require('restify');
let initApi = require('./api');
let DatabaseServiceClass = require('./database.service');

const server = restify.createServer({
  name: 'almundo-be',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

let databaseService = new DatabaseServiceClass();

databaseService.initialize().then( ()=>{
    initApi(server, databaseService);
    server.listen(8080, function () {      
        console.log('%s listening at %s', server.name, server.url);
    });    
});