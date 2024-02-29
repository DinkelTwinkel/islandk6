const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marketFareSchema = new Schema({

	userId: { type: String, required: true, unique: true },
	passExpireTime: { type: Number, default: 0 },
	smuggleExpiryTime: { type: Number, default: 0 },
	originalGroup: { type: Number, required: true },

}, { timestamps: true });

const Fare = mongoose.model('marketFare', marketFareSchema);
module.exports = Fare;