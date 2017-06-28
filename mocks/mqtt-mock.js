const config = require('../config.js');
const mqtt = require('../mqtt')(config.mqtt_broker,"mqtt_mock");

const nodes_db = require('../db/init/nodes-db.json');

var compt = 0;

var mock = function() {
      for (var i in nodes_db) {
            var data = JSON.stringify(
                  {
                        t   : 20+(Math.round(Math.random()*1000)/100),
                        bat : 2 + (Math.round(Math.random()*100)/100),
                        seq : compt%255
                  }
            );

            var topic = config.mqtt_node_base+i;
            mqtt.publish(topic,data);
            console.log(topic + " : " + data);
      }
      compt++;
};

setInterval(mock,60000);
mock();
