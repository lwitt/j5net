const config = require('../../config.js');
var User = require('../../db/').models.user;

var credentials = {'username': config.defaultUser, 'password': config.defaultPassword};

User.findOne({'username': new RegExp('^' + credentials.username + '$', 'i')}, function(err, user){
		if(err) throw err;
		if(user){
			console.log("user already exists");
			process.exit();
		}else{
			User.create(credentials, function(err, newUser){
				console.log("user created");
				process.exit();
			});
		}
});
