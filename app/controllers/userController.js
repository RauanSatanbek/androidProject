var User = require("../models/user.js");

/* ------------------------------------------------------------------------------------------
* add User
*/
	module.exports.addUser = function(req, res) {
		var name = req.body.name;
		var user = new User({
			name: name
		});
		user.save(function(err, affected) {
			if(err) {
				res.send(affected);
			} else {
				res.send(affected);
			}
		});
	};
/* ------------------------------------------------------------------------------------------
* delete User
*/
	module.exports.deleteUser = function(req, res, next) {
		User.remove({_id: req.body.id}, function(err, affected) {
			if(err) {
				res.send(err);
			} else {
				res.send("OK");
			}
		});
	};
/* ------------------------------------------------------------------------------------------
* get all users
*/
	module.exports.getAllUsers = function(req, res) {
		User.find({}, function(err, result) {
			res.send(result);
		});
	};