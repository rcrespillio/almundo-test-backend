let restify = require('restify');

module.exports = class Server {
    constructor(){
        const server = restify.createServer({
            name: 'almundo-be',
            version: '1.0.0'
        });
        server.use(restify.plugins.acceptParser(server.acceptable));
        server.use(restify.plugins.queryParser());
        server.use(restify.plugins.bodyParser());
        this.server = server;
        this.server.use(
            function crossOrigin(req,res,next){
              res.header("Access-Control-Allow-Origin", "*");
              res.header("Access-Control-Allow-Headers", "X-Requested-With");
              return next();
            }
          );
    }

    listen(){
        this.server.listen(8080, () => {      
            console.log('%s listening at %s', this.server.name, this.server.url);
        });
    }

    addGetEndpoint(url, fn){
        this.server.get(url, fn);
    }

    addPostEndpoint(url, fn){
        this.server.post(url, fn);
    }
}