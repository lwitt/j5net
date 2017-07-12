const Mongoose = require('mongoose');
const colors = require('colors');
const config = require('../config.js');


Mongoose.connect(config.mongo_url, { keepAlive : 120, server:{auto_reconnect:true, econnectTries: Number.MAX_VALUE}});

var db = Mongoose.connection;

db.on('error', function(error) {
      // console.log(error);
      console.log(("["+new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + '] - [database ' + config.mongo_url + '] disconnected!').red);
      Mongoose.disconnect();
});

db.on('open', function() {
      console.log(("["+new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + '] - [database ' + config.mongo_url + '] connected!').blue);
});

db.on('reconnected', function() {
      console.log(("["+new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + '] - [database ' + config.mongo_url + '] reconnected!').orange);
});

db.on('disconnected', function() {
      setTimeout(
            function() {
                  Mongoose.connect(config.mongo_url, { server:{auto_reconnect:true, econnectTries: Number.MAX_VALUE}})
            },
            10000);
      }
);

module.exports ={
      Mongoose,
      models: {
            node              : require('./schemas/node'),
            nodedata          : require('./schemas/nodedata'),
            nodeinfo          : require('./schemas/nodeinfo'),
            user              : require('./schemas/user'),
      }
};
