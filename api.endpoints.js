module.exports = function (server, databaseService){

    server.addGetEndpoint('/hotels/', function (req, res, next) {
        let dbquery;
        if(Object.keys(req.query).length){
            let {name, stars} = req.query;
            dbquery = databaseService.queryHotels(name, stars);
        }else{
            dbquery = databaseService.getAllHotels()
        }
        dbquery.then( hotels => {
            writeHead(res, 200);
            res.end(JSON.stringify(hotels));
        }).catch( err =>{
            writeHead(res, 500);
            res.end(JSON.stringify(err));
        });
        return next();
    });
    
    server.addGetEndpoint('/hotel/:hotelID', function (req, res, next) {
        let {hotelID} = req.params;
        databaseService.getHotelById(hotelID).then( hotel => {
            writeHead(res, 200);
            res.end(JSON.stringify(hotel));
        }).catch( err => {
            writeHead(res, 500);
            res.end(JSON.stringify(err));
        })
        return next();
    });

    server.addPostEndpoint('/hotel/', function (req, res, next) {
        let { name, stars, price, image, amenities } = req.body;
        let hotel = { name, stars, price, image, amenities };
        let id = `${Math.floor(100000 + Math.random() * 900000)}`;
        hotel.id = hotel._id = id;
        databaseService.putHotel(hotel).then( ()=>{
            writeHead(res, 200);
            res.end(JSON.stringify(hotel));
        }).catch( err => {
            writeHead(res, 500);
            res.end(JSON.stringify(err));
        })
        return next();
    });
}

function writeHead(res, httpcode){
    res.writeHead(httpcode, {
        'Content-Type': 'application/json; charset=utf-8'
    });
}