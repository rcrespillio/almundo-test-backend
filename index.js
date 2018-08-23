let restify = require('restify');
let PouchDB = require('pouchdb');
let testData = require('./data/data.json');
const server = restify.createServer({
  name: 'almundo-be',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

let db = new PouchDB('hotels');


server.get('/initialize/', function (req, res, next) {
    db.destroy().then(function () {
        db = new PouchDB('hotels'); 
        
        testData = testData.map(td =>{
            td._id = td.id;
            delete td.id;
            return td;
        })
        db.bulkDocs(testData).then( ()=>{
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify({status: 'successfully_initialized'}));
        }).catch(() => {
            res.writeHead(500, {
                'Content-Type': 'application/json; charset=utf-8'
            });
            res.end(JSON.stringify({status: 'error_initializing'}));
        })
        return next();
    });    
});
server.get('/hotels/', function (req, res, next) {
    res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8'
    });
    db.allDocs({
        include_docs: true,
        attachments: true
    }).then( docRes => {
        let hotels = docRes.rows.map(row => {
            let hotel = row.doc;
            hotel.id = row.id;
            delete hotel._id;
            delete hotel._rev;
            return hotel;
        });
        res.end(JSON.stringify(hotels));
    }).catch( (err)=>{
        res.end(JSON.stringify({err}));
    });
    return next();
});

server.get('/hotels/:hotelID', function (req, res, next) {
    let {hotelID} = req.params;
    res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8'
    });
    res.end(JSON.stringify(hotelID));/*
    db.allDocs({
        include_docs: true,
        attachments: true
    }).then( docRes => {
        let hotels = docRes.rows.map(row => {
            let hotel = row.doc;
            hotel.id = row.id;
            delete hotel._id;
            delete hotel._rev;
            return hotel;
        });
        res.end(JSON.stringify(hotels));
    }).catch( (err)=>{
        res.end(JSON.stringify({err}));
    });*/
    return next();
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});