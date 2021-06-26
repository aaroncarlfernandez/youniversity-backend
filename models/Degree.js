const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const degreeSchema = new Schema({
	title: {
		type: String,
		required: [true, 'Degree title is required']
	},
	pointsRequired: {
		type: Number,
		required: [true, 'Points is required']
	},
	degreeAuthorId: {
		type: String
	},
	degreeImage: {
		type: String
	},
	degreeImagePublicId: {
		type: String
	},	
});

module.exports = mongoose.model('Degree', degreeSchema);