var express = require('express');

var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
    var broker = req.app.get('mqtt_broker');

    var dest_base = req.app.get("mqtt_shared_base");
    dest = dest_base+"car_position/";

    // console.log(req.body);
    if (req.body.lat != null && req.body.lng != null && req.body.alt != null && req.body.speed != null && req.body.nbsat != null) {
        broker.publish(dest+"latitude",""+req.body.lat,{qos:2, retain:true});
        broker.publish(dest+"longitude",""+req.body.lng,{qos:2, retain:true});
        broker.publish(dest+"altitude",""+req.body.alt,{qos:2, retain:true});
        broker.publish(dest+"speed",""+req.body.speed,{qos:2, retain:true});
        // broker.publish(dest+"distance",""+req.body.dist,{qos:2, retain:true});
        broker.publish(dest+"nbsat",""+req.body.nbsat,{qos:2, retain:true});
        broker.publish(dest+"lastUpdate",Date.now().toString());
        console.log("car position published on "+dest);
    }
    else {
        console.log("invalid car position post");
    }

    res.send('ok');
});

module.exports = router;
