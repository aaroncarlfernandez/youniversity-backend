const Degree = require('../models/Degree');
const path = require('path');
const cloudinary = require('cloudinary');
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();
const cloudinaryUpload = file => cloudinary.uploader.upload(file);
const formatBufferTo64 = file => parser.format(path.extname(file.originalname).toString(), file.buffer);

cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });

module.exports.count = () => {
	return Degree.countDocuments().then(count => { return count; });
}

module.exports.getAll = () => { 
	return Degree.find({}).sort({pointsRequired: 1}).then(result => { return result });
}

module.exports.getById = (params) => { 
	return Degree.find({_id: params.id}).then(result => { return result });
}

module.exports.degreeUpdate = (request) => { 
	if (!request.file) { 
		return Degree.findByIdAndUpdate({ _id: request.params.id }, { title: request.body.degreeTitle, pointsRequired: request.body.pointsRequired })
		.then(updatedDegree => { return (updatedDegree) ? { message: "Degree update was successful", data: updatedDegree } : { message: "Degree update failed" }; });
	} else {
		cloudinary.uploader.destroy(request.body.degreeImagePublicId, { invalidate: true, resource_type: "image" }, (destroyErr, destroyResult) => {
			if (destroyErr) console.log("Error in destroy occured: " + destroyErr);
		});
		const file64 = formatBufferTo64(request.file);
    	return cloudinaryUpload(file64.content).then(uploadResult => {
    		return Degree.findByIdAndUpdate({ _id: request.params.id }, { title: request.body.degreeTitle, pointsRequired: request.body.pointsRequired, 
    			degreeImage: uploadResult.url, degreeImagePublicId: uploadResult.public_id})
			.then(updatedDegree => { return (updatedDegree) ? { message: "Degree update was successful", data: updatedDegree } : { message: "Degree update failed" }; });
    	})
	}
}

module.exports.create = (request) => {
	if (!request.file) { 
		return { status:400, message: "Degree requires a picture" }
	} else {
		const file64 = formatBufferTo64(request.file);
		return cloudinaryUpload(file64.content).then(uploadResult => {

			var degree = new Degree();
			degree.title = request.body.title;
			degree.pointsRequired = request.body.pointsRequired;
			degree.degreeAuthorId = request.body.degreeAuthorId;
			degree.degreeImage = uploadResult.url;
			degree.degreeImagePublicId = uploadResult.public_id;

			return degree.save().then((saveResult, err) => { return (err) ? { status: 400, message: "Degree creation failed" } : { status: 200, message: "Degree created successfully" } });
		})
	}
}