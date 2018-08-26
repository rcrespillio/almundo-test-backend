let PouchDB = require('pouchdb');
let testData = require('./data/data.json');
PouchDB.plugin(require('pouchdb-find'));

const dbPath = 'db/hotels';
module.exports = class DatabaseService {
    constructor(){
        let db = new PouchDB(dbPath);
        db.createIndex({
            index: {fields: ['name']}
        });
        this.db = db;
    }

    initialize(){
        return this.db.destroy().then(() => {
            this.db = new PouchDB(dbPath); 
            testData = testData.map(td =>{
                td._id = td.id;
                delete td.id;
                return td;
            })
            this.db.bulkDocs(testData).then( ()=>{
                console.log('db mock data initialized');
            }).catch(() => {
                console.log('error while initializing mock data');
            });
        });
    }

    getAllHotels(){
        return db.allDocs({ include_docs: true }).then( docRes => {
            return docRes.rows.filter(row=> row.doc && row.doc.language != "query").map(row => {
                let hotel = row.doc;
                hotel.id = row.id;
                delete hotel._id;
                delete hotel._rev;
                return hotel;
            });
        })
    }

    queryHotels(name, stars){
        let selector = {};
        if(name){
            selector.name = {$regex: RegExp(`.*${name}.*`, "i")};
        }
        if(stars){
            let inputStars = stars.replace(/,/g,'|')
            if(inputStars){
                selector.stars = { $regex: RegExp(`${inputStars}`)};
            }
        }
        return this.db.find({selector}).then( docRes => {
            return docRes.docs.map(row => {
                let hotel = row;
                hotel.id = row.id;
                delete hotel._id;
                delete hotel._rev;
                return hotel;
            });
        });
    }

    getHotelById(hotelID){
        return this.db.get(hotelID).then( row => {
            let hotel = row;
            hotel.id = row.id;
            delete hotel._id;
            delete hotel._rev;
            return hotel;
        })
    }


}