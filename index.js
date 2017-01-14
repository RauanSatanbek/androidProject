var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var mongoose = require("mongoose");
var app = express();
app.use(cors());
app.use(bodyParser());
app.set('port', (process.env.PORT || 5000));
/* ------------------------------------------------------------------------------------------
* Подключаем все коллекций -
*/
	var Room = require("./app/models/room");
	var User = require("./app/models/user");
	var Chat = require("./app/models/chat");
/* ------------------------------------------------------------------------------------------
* test
*/
	app.get("/", function(req, res) {
		var date = new Date();
		var dateFormat = date.getDate() + "." + date.getMonth() + "." + date.getFullYear() + " " + (6 + date.getHours()) + ":" + date.getMinutes() + ":" + date.getSeconds() ;
		res.end(dateFormat + " Hello");
	}); 
/* ------------------------------------------------------------------------------------------
* add message
*/
	app.post("/api/chat/add", function(req, res, next) {

		var date = new Date();
		var dateFormat = date.getDate() + "." + date.getMonth() + "." + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() ;
		var chat = new Chat({
			message: req.body.message,
			room: req.body.roomId,
			userId: req.body.userId,
			userName: req.body.userName,
			date: dateFormat
		});

		chat.save(function(err, affected) {
			if(err) res.send(err);
			else {
				res.send(affected);
			}
		});
	});
/* ------------------------------------------------------------------------------------------
* get message
*/
	// .populate([{path: 'user', select: 'name _id'}])
	app.get("/api/chat/:id", function(req, res) {
		Chat.find({room: req.params.id})
			.populate([{path: 'room', select: 'name _id'}])
			.exec(function(err, result) {
				if(err) res.send(err);
				else {
					res.send(result);
				}
			});
	});
/* ------------------------------------------------------------------------------------------
* delete message
*/
	app.delete("/api/chat/:id", function(req, res) {
		Chat.remove({room: req.params.id}, function(err, affected) {
			if(err) {
				res.send(err);
			} else {
				res.send(affected);
			}
		});
	});
/* ------------------------------------------------------------------------------------------
* add User
*/
	app.post("/api/user/add", function(req, res) {
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
	});
/* ------------------------------------------------------------------------------------------
* delete User
*/
	app.post("/api/user/delete", function(req, res, next) {
		User.remove({_id: req.body.userId}, function(err, affected) {
			if(err) {
				res.send(err);
			} else {
				res.send("OK");
			}
		});
	});
/* ------------------------------------------------------------------------------------------
* delete all User
*/
	app.post("/api/user/deleteAll", function(req, res, next) {
		User.remove({}, function(err, affected) {
			if(err) {
				res.send(err);
			} else {
				res.send("OK");
			}
		});
	})
/* ------------------------------------------------------------------------------------------
* get all users
*/
	app.get("/api/user", function(req, res) {
		User.find({}, function(err, result) {
			res.send(result);
		});
	});
/* ------------------------------------------------------------------------------------------
* add room 
*/
	app.post("/api/room/add", function(req, res) {
		var name = req.body.name,
			mafia = parseInt(req.body.mafia),
			doctor = parseInt(req.body.doctor),
			citizen = parseInt(req.body.citizen),
			sheriff = parseInt(req.body.sheriff),
			creator = req.body.creator,
			number = mafia + doctor + citizen + sheriff;
		var room = new Room({
			name: name,
			mafia: mafia,
			doctor: doctor,
			citizen: citizen, 
			sheriff: sheriff,
			number: number,
			count: 1,
			creator: creator,
			users: []
		});

		room.save(function(err, affected) {
			if(err) {
				res.send(err + " ----");
			} else {
				// getAllRooms(res);
				res.send(affected);
			}
		});
	});
/* ------------------------------------------------------------------------------------------
* add a user to a room  
*/
	app.post("/api/room/addUser", function(req, res, next) {
		Room.update({_id: req.body.roomId}, {$push: {users: req.body.userId}, count: (parseInt(req.body.count ) + 1)})
			.exec(function(err, affected) {
				if(err) res.send(err);
				else res.send(affected);
			});
	});
/* ------------------------------------------------------------------------------------------
* delete a user from a room 
*/
	app.post("/api/room/daleteUser", function(req, res, next) {
		Room.update({_id: req.body.roomId}, {$pull: {users: req.body.userId}, count: (parseInt(req.body.count ) - 1)})
			.exec(function(err, affected) {
				if(err) res.send(err);
				else res.send(affected);
			});
	});
/* ------------------------------------------------------------------------------------------
* get all room
*/
	app.get("/api/room", function(req, res) {
		getAllRooms(res);
	});
/* ------------------------------------------------------------------------------------------
* get room
*/
	app.get("/api/room/:id", function(req, res) {
		Room.find({_id: req.params.id})
			.populate([{path: 'users', select: 'name _id'}])
			.populate([{path: 'creator', select: 'name _id'}])
			.exec(function(err, result) {
				if(err) {
					res.statusCode = 500;
					res.send(err);
				} else {
					res.send(result[0]);
				}
			});
	});
/* ------------------------------------------------------------------------------------------
* delete room
*/
	app.post("/api/room/:id", function(req, res) {
		var userId = req.body.userId;
		Room.findOne({_id: req.params.id}, function(err, result) {
			if(err) {
				res.send(err);
			} else {
				if(result.creator == userId) {
					res.send("creator");
					Room.remove({_id: req.params.id}, function(err, affected) {
						if(err) {
							res.send(err);
						} else {
							res.send("OK");
						}
					});
				} else {
					Room.update({_id: req.params.id}, {$pull: {users: req.body.userId}, count: (parseInt(req.body.count) - 1)})
						.exec(function(err, affected) {
							if(err) res.send(err);
							else res.send(affected);
						});
				}
			}
		});
		
	});
/* ------------------------------------------------------------------------------------------
* delete all rooms
*/
	app.delete("/api/room", function(req, res) {
		Room.remove({}, function(err, affected) {
			if(err) {
				res.send(err);
			} else {
				res.send(affected);
			}
		});
	});
/* ------------------------------------------------------------------------------------------
* Возвращяем все румы
*/	
	function getAllRooms(res) {
		Room.find({})
			.populate([{path: 'users', select: 'name _id'}])
			.populate([{path: 'creator', select: 'name _id'}])
			.exec(function(err, result) {
				if(err) {
					res.statusCode = 500;
					res.send(err);
				} else {
					res.send(result);
				}
			});
	}
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

