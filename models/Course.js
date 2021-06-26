const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
	title: {
		type: String,
		required: [true, 'Course title is required']
	},
	description: {
		type: String,
		required: [true, 'Description is required']
	},
	authorId: {
		type: String,
		required: true
	},
	price: {
		type: String,
		required: [true, 'Price is required']
	},
	isActive: {
		type: Boolean,
		default: true
	},
	createdOn: {
		type: Date, 
		default: Date.now
	},
	courseImage: {
		type: String
	},
	courseImagePublicId: {
		type: String
	},
	enrollees: [{
		userId: {
			type: String,
			required: [true, 'User ID is required']
		},
		enrolledOn: {
			type: Date, 
			default: Date.now
		},
		status: {
			type: String,
			default: 'Enrolled' // Canceled or Completed
		},
		rating: {
			type: Number
		},
	}]	
});

courseSchema.index({title: "text", description: "text"}); /* Creates a text index*/


module.exports = mongoose.model('Course', courseSchema);