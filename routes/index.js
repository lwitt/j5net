var express = require('express');
var router = express.Router();
var passport 	= require('passport');

var User = require('../db/models/user');

router.get('/', function(req, res, next) {
	if(req.isAuthenticated()){
		res.redirect('/app');
	}
	else{
		res.render('index', {
			success: req.flash('success')[0],
			errors: req.flash('error'),
                  title : "j5net"
		});
	}
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/app',
	failureRedirect: '/',
	failureFlash: true
}));

router.get('/logout', function(req, res, next) {
	req.logout();
	req.session = null;
	res.redirect('/');
});

router.post('/upload', function(req, res, next) {
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
        broker.publish(dest+"last_update",Date.now().toString(),{qos:2, retain:true});
        console.log((new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + ' - car position published on '+dest).orange);
    }
    else {
        console.log("invalid car position post");
    }

    res.send('ok');
});


module.exports = router;
