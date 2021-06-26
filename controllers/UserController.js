const User = require('../models/User');
const bcrypt = require('bcrypt');
const path = require('path');
const cloudinary = require('cloudinary');
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();
const cloudinaryUpload = file => cloudinary.uploader.upload(file);
const formatBufferTo64 = file => parser.format(path.extname(file.originalname).toString(), file.buffer);
const auth = require('../middlewares/auth');

cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });

module.exports.emailExists = (params) => {
	return User.find({ email: params.email }).then(result => {
		return result.length > 0 ? true : false;
	});
}

module.exports.register = (params) => {
	let user = new User({
		firstName: params.firstName,
		lastName: params.lastName,
		email: params.email,
		mobileNumber: params.mobileNumber,
		password: bcrypt.hashSync(params.password, 10)
	});

	return user.save().then((user,err) => {
		return (err) ? false : true;
	 })
}

module.exports.login = (params) => {
	return User.findOne({ email: params.email }).then((user) => {
		if (user === null) { return false; } 

		const isPasswordMatched = bcrypt.compareSync(params.password, user.password);

		if (isPasswordMatched) {
			return { accessToken: auth.createAccessToken(user.toObject())}
		} else {
			return false
		}
	});
}

module.exports.get = (params) => {
	return User.findById(params.userId).then(user => {
		user.password = undefined
		return user;
	})
}

module.exports.count = () => {
	return User.countDocuments().then(count => { return count; });
}

module.exports.update = (request) => { 
	if (!request.file) { 
		return User.findByIdAndUpdate({ _id: request.params.id },
			{ firstName: request.body.firstName,
				lastName: request.body.lastName, 
				mobileNumber: request.body.mobileNumber }, {new : true})
		.then(result => { return (result) ? { status: 200, message: "Profile update was successful" } : { status: 400, message: "Profile update failed" }});
	} else {
		cloudinary.uploader.destroy(request.body.profilePicPublicId, { invalidate: true, resource_type: "image" }, (destroyErr, destroyResult) => {
			if (destroyErr) console.log("Error in destroy occured: " + destroyErr);
		});
		const file64 = formatBufferTo64(request.file);
    	return cloudinaryUpload(file64.content).then(uploadResult => {
    		return User.findByIdAndUpdate({ _id: request.params.id }, { 
				firstName: request.body.firstName,
				lastName: request.body.lastName, 
				mobileNumber: request.body.mobileNumber, 
				profilePic: uploadResult.url, 
				profilePicPublicId: uploadResult.public_id}, 
				{new : true})
			.then(result => { return (result) ? { message: "Profile update was successful", data: result } : { message: "Profile update failed" }; });
    	})
	}
}

module.exports.delete = (params) => {
	return User.findByIdAndRemove({ _id: params.id })
	.then(result => { 
		if (result) {
			cloudinary.uploader.destroy(result.profilePicPublicId, { invalidate: true, resource_type: "image" }, (destroyErr) => {
				if (destroyErr) console.log("Error in destroy occured: " + destroyErr);
			});
			return { status: 200, message: "User deleted successfully"}
		} else {
			return { status: 400, message: "User deletion failed"}
		}
	});
}