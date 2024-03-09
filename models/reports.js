const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({

	postID: { type: String, required: true, unique: false },
	reporterID: { type: String, required: true, unique: false },

}, { timestamps: true });

const Report = mongoose.model('report', reportSchema);
module.exports = Report;