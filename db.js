const mongoose = require('mongoose');
const colors = require('colors');


var models = {}

module.exports = (mongo_url) => {

    mongoose.connect(mongo_url, { server:{auto_reconnect:true, econnectTries: Number.MAX_VALUE}});

    var db = mongoose.connection;

    db.on('error', function(error) {
        // console.log(error);
        console.log((new Date().toLocaleTimeString() + ' - [database ' + mongo_url + '] disconnected!').red);
        mongoose.disconnect();
    });

    db.on('open', function() {
        console.log((new Date().toLocaleTimeString() + ' - [database ' + mongo_url + '] connected!').blue);
    });

    db.on('reconnected', function() {
        console.log((new Date().toLocaleTimeString() + ' - [database ' + mongo_url + '] reconnected!').orange);
    });

    db.on('disconnected', function() {
        setTimeout(
            function() {
                mongoose.connect(mongo_url, { server:{auto_reconnect:true, econnectTries: Number.MAX_VALUE}})
            },
            10000);
    });

    var nodeDataSchema = mongoose.Schema({
        id : {
            type:       Number,
            required :  true
        },
        data : {
            type:       String,
            required :  true
        },
        time : {
            type:       Date,
            required :  true,
            default:    Date.now
        }
    });

    var NodeData = mongoose.model('NodeData', nodeDataSchema);

    var nodeSchema = mongoose.Schema({
        id : {
            type:       Number,
            required :  true,
            unique :    true,
            index : true
        },
        lastData : {
            type:       String,
        },
        lastUpdate : {
            type:       Date,
            required :  true,
            default:    Date.now
        },
        firstSeen : {
            type:       Date,
            required :  true,
            default:    Date.now
        }
    });

    var Node = mongoose.model('Node', nodeSchema);

    var nodeInfoSchema = mongoose.Schema({
        id : {
            type:       Number,
            required :  true,
            unique :    true,
            index : true
        },
        name : {
            type:       String,
            required :  true,
        }
    });

    var NodeInfo = mongoose.model('NodeInfo', nodeInfoSchema);

    models.nodedata = NodeData;
    models.node = Node;
    models.nodeinfo = NodeInfo;

    return models;
}
