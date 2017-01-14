var express = require("express"),
	router = express.Router(),
	userController = require("../controllers/userController");
var app = express();
/* ------------------------------------------------------------------------------------------
* addUser
*/
	app.post("/api/user/add", userController.addUser);
/* ------------------------------------------------------------------------------------------
* deleteUser
*/
	app.post("/api/user/delete", userController.deleteUser);
/* ------------------------------------------------------------------------------------------
* get all users
*/
	app.get("/api/user", userController.getAllUsers);