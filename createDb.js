var mongoose = require('libs/mongoose');
mongoose.set('debug', true);
var async = require('async');

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers
], function (err, results) {
    console.log(arguments);
    close();
    process.exit(err ? 255 : 0);
});

function open(callback) {
    mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require('models/user');

    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}


function createUsers(callback) {
    var users = [
        {username: 'Petia', password: '123'},
        {username: 'Petia', password: '345'},
        {username: 'admin', password: 'admin'}
    ];
    async.each(users, function (userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}

function close(callback){
    mongoose.disconnect(callback);
}
// function createUsers(callback) {
//     async.parallel([
//         function (callback) {
//             var vasia = new User({username: 'Vasia', password: '123'});
//             vasia.save(function (err) {
//                 callback(err, vasia);
//             });
//         },
//         function (callback) {
//             var petia = new User({username: 'Petia', password: '345'});
//             petia.save(function (err) {
//                 callback(err, petia);
//             });
//         },
//         function (callback) {
//             var admin = new User({username: 'admin', password: 'admin'});
//             admin.save(function (err) {
//                 callback(err, admin);
//             });
//         }
//     ], callback);
// }



