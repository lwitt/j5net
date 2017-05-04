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

    if (req.body.lat != null) broker.publish(dest+"latitude",""+req.body.lat,{qos:2});
    if (req.body.lng != null) broker.publish(dest+"longitude",""+req.body.lng,{qos:2});
    if (req.body.alt != null) broker.publish(dest+"altitude",""+req.body.alt,{qos:2});
    if (req.body.speed != null) broker.publish(dest+"speed",""+req.body.speed,{qos:2});
    if (req.body.dist != null) broker.publish(dest+"distance",""+req.body.dist,{qos:2});
    if (req.body.nbsat != null) broker.publish(dest+"nbsat",""+req.body.nbsat,{qos:2});

    res.send('ok');
});

module.exports = router;
