const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postTimeSchema = new Schema({

	userID: { type: String, required: true, unique: true },
	totalPostingTime: { type: Number, default: 0 },
	averagePostTime: { type: Number, default: 0 },
	postNumber: { type: Number, default: 0 },

}, { timestamps: true });

const PostTime = mongoose.model('postTime', postTimeSchema);
module.exports = PostTime;