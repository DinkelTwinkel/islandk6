const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userStatSchema = new Schema({

	userID: { type: String, required: true, unique: true },
	lastMessageSent: ({ type: String, default: 'n/a' }),
	totalMessages: ({ type: Number, default: 0 }),
	vcTime: ({ type: Number, default: 0 }),
	totalKimoPost: ({ type: Number, default: 0 }),
	messagesBottled: ({ type: Number, default: 0 }),
	refsShared: ({ type: Number, default: 0 }),

}, { timestamps: true });

const UserStats = mongoose.model('userStat', userStatSchema);
module.exports = UserStats;