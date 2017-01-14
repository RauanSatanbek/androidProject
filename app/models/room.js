var mongoose = require("../libs/mongoose.js");
var Schema = mongoose.Schema;
var schema = new Schema({
	name: String,
	mafia: Number,
	doctor: Number,
	citizen: Number,
	sheriff: Number,
	number: Number,
	count: Number,
	creator: {type: Schema.Types.ObjectId, ref: 'User'},
	users: [{type: Schema.Types.ObjectId, ref: 'User'}]
});
module.exports = mongoose.model("Room", schema);