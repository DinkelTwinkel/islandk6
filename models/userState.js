const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

	userID: { type: Number, required: true, unique: true },
	currentState: { type: String, required: true },
	lastPostTime: { type: Number, required: true },
	streak: { type: Number, required: true },
	postedToday: { type: Boolean, required: true},

}, { timestamps: true });

const UserState = mongoose.model('user', userSchema);
module.exports = UserState;