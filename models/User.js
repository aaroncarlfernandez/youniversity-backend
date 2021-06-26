const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	firstName: {
		type: String,
		required: [true, 'First name is required']
	},
	lastName: {
		type: String,
		required: [true, 'Last name is required']
	},
	email: {
		type: String,
		required: [true, 'Email is required']
	},
	mobileNumber: {
		type: String,
		required: [true, 'Mobile number is required']
	},
	password: {
		type: String,
		required: [true, 'Password is required']
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	profilePic: {
		type: String
	},
	profilePicPublicId: {
		type: String
	},
	pointsCredited: {
		type: Number,
		default: 0
	},
	enrollments: [{
		courseId: {
			type: String
		},
		enrolledOn: {
			type: Date, 
			default: Date.now
		},
		status: {
			type: String,
			default: 'Enrolled' // Canceled or Completed
		}
	}]	
});

module.exports = mongoose.model('User', userSchema);