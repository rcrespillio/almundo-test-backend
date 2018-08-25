let restify = require('restify');
let PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
let testData = require('./data/data.json');
const server = restify.createServer({
  name: 'almundo-be',
  version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

let db = new PouchDB('./db/hotels');
db.createIndex({
    index: {fields: ['name']}
});

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
    db.allDocs({ include_docs: true }).then( docRes => {
        let hotels = docRes.rows.filter(row=> row.doc && row.doc.language != "query").map(row => {
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
    db.get(hotelID).then( row => {
        let hotel = row;
        hotel.id = row.id;
        delete hotel._id;
        delete hotel._rev;
        res.end(JSON.stringify(hotel));
    }).catch( err => {
        res.end(JSON.stringify({err}));
    })
    return next();
});

server.get('/hotels/search/:hotelName', function (req, res, next) {
    let {hotelName} = req.params;
    res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8'
    });
    db.find({
        selector: {
            name: {$regex: `.*${hotelName}.*`}
        }
    }).then( docRes => {
        let hotels = docRes.docs.map(row => {
            let hotel = row;
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

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});