const config = require('../config.js');
const db = require('../db.js');

const models = db(config.mongo_url);
const NodeModel = models["node"];
const NodeDataModel = models["nodedata"];
const NodeInfoModel = models["nodeinfo"];

const nodes_db = require('./nodes-db.json');

NodeInfoModel.remove(function(err){
    if (!err) {
        for (var i in nodes_db) {
            console.log(i);
            var n = new NodeInfoModel({
                     id: i,
                     name : nodes_db[i].name
            });
            n.save(err => {
                if(err)
                    console.log("db error" + err);
                else
                    console.log("node inserted!")
            });
        }
    }
    else
        console.log ("unable to drop existing nodes");
});
