const mongodb = require('mongodb');
const mongoclient = mongodb.MongoClient;

let _db;

const Mongoconnect = (cb) => {
    mongoclient.connect('mongodb+srv://virensingh1111991:Viru011191@e-commerce.uufl0.mongodb.net/ToeToToeDev')
    .then((resp) => {
        _db = resp.db();
        cb();
    })
    .catch((err) => {
        console.log(err,"err")
        throw err
    })
}

const getDB = () => {
    if(_db){
        return _db;
    }
    throw 'not found DB'
}

exports.Mongoconnect = Mongoconnect
exports.getDB = getDB