var mongoose = require("../libs/mongoose.js");
var Schema = mongoose.Schema;
var schema = new Schema({
	message: String,
	room: {type: Schema.Types.ObjectId, ref: 'Room'},
	userId: String,
	userName: String,
	date: String
});

module.exports = mongoose.model("Chat", schema);