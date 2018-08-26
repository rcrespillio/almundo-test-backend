module.exports = function initApi(server, databaseService){
    server.get('/hotels/', function (req, res, next) {
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        let dbquery;
        if(Object.keys(req.query).length){
            let {name, stars} = req.query;
            dbquery = databaseService.queryHotels(name, stars);
        }else{
            dbquery = databaseService.getAllHotels()
        }
        dbquery.then( hotels => {
            res.end(JSON.stringify(hotels));
        }).catch( err =>{
            res.end(err);
        });
        return next();
    });
    
    server.get('/hotel/:hotelID', function (req, res, next) {
        let {hotelID} = req.params;
        res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        databaseService.getHotelById(hotelID).then( hotel => {
            res.end(JSON.stringify(hotel));
        }).catch( err => {
            res.end(JSON.stringify(err));
        })
        return next();
    });
}