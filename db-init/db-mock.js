const config = require('../config.js');
const db = require('../db.js');

const models = db(config.mongo_url);
const NodeModel = models["node"];
const NodeDataModel = models["nodedata"];
const NodeInfoModel = models["nodeinfo"];

const nodes_db = require('./nodes-db.json');

var compt = 0;

setInterval(function() {
        for (var i in nodes_db) {

            var data = JSON.stringify({   t   : 20+(Math.round(Math.random()*1000)/100),
                       bat : 3,
                       seq : compt });

            var n = new NodeDataModel({
                     id: i,
                     data : data,
                     time : new Date()
            });

            n.save(err => {
                if(err)
                    console.log("db error" + err);
                else
                    console.log("data inserted!")
            });

            NodeModel.findOne({id : i}, function (err, res){
                if (!err) {
                    // existing node
                    if (res) {
                        res.lastUpdate = new Date();
                        res.lastData = data;
                        res.save(function(err) {
                            if (err)
                                console.log(err);
                            else {
                                console.log("data updated!");
                            }
                        });
                    }
                }
            });
        }
        compt++;
}, 60000);
