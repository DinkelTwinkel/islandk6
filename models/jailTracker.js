const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jailSchema = new Schema({

	userId: { type: String, required: true, unique: true },
	roles: { type: Array, required: true },
	timeToFree: { type: Number, default: 0 },
	feetMentionTracker: { type: Number, default: 0 },
	numberOfTimesJailed: { type: Number, default: 0 },
	totalTimeServed: { type: Number, default: 0 },

}, { timestamps: true });

const Jail = mongoose.model('jail', jailSchema);
module.exports = Jail;