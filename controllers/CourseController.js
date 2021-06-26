const User = require('../models/User');
const Course = require('../models/Course');
const ObjectId = require('mongoose').Types.ObjectId;
const path = require('path');
const cloudinary = require('cloudinary');
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();
const cloudinaryUpload = file => cloudinary.uploader.upload(file);
const formatBufferTo64 = file => parser.format(path.extname(file.originalname).toString(), file.buffer);

cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });

module.exports.count = () => {
	return Course.countDocuments().then(count => { return count; });
}

module.exports.courseExists = (params) => {
	return Course.find({ title: params.title }).then(result => {
		return result.length > 0 ? true : false;
	});
}

module.exports.getAll = () => {
	return Course.aggregate([
		{ "$addFields": { "authorObjId": { "$toObjectId": "$authorId" }}},
		{
			$lookup: {
				from: 'users',
		      	localField: 'authorObjId',
		      	foreignField: '_id',
		      	as: 'user' 
		    }
		},
		{ $unwind:"$user" },
		{   
	        $project:{
	            _id : 1,
	            title : 1,
	            description : 1,
	            price : 1,
	            isActive : 1,
	            courseImage : 1,
	            authorId : 1,
	            authorPic : "$user.profilePic",
	            authorfirstName : "$user.firstName",
	            authorlastName : "$user.lastName",
				rating: { $avg: "$enrollees.rating" },
				ratingCount : { $size: "$enrollees.rating"}
	        } 
	    }, 
	    {$sort: {title: 1} }
		], (err,result) => { return (err) ? { status: 400, message: "Course fetch failed" } : result; });
}

module.exports.getActive = () => {
	return Course.aggregate([
		{ $match: { isActive: true } },
		{ "$addFields": { "authorObjId": { "$toObjectId": "$authorId" }}},
		{
			$lookup: {
				from: 'users',
		      	localField: 'authorObjId',
		      	foreignField: '_id',
		      	as: 'user' 
		    }
		},
		{   $unwind:"$user" },
		{   
	        $project:{
	            _id : 1,
	            title : 1,
	            description : 1,
	            price : 1,
	            isActive : 1,
	            courseImage : 1,
	            authorId : 1,
	            authorPic : "$user.profilePic",
	            authorfirstName : "$user.firstName",
	            authorlastName : "$user.lastName",
				rating: { $avg: "$enrollees.rating" },
				ratingCount : { $size: "$enrollees.rating"}
	        } 
	    }, 
	    {$sort: {title: 1} }
		], (err,result) => { return (err) ? { status: 400, message: "Course fetch failed" } : result; });
}

module.exports.getById = (params) => { 
	return Course.aggregate([
		{ $match: { _id : ObjectId(params.id) } },
		{ "$addFields": { "authorObjId": { "$toObjectId": "$authorId" }}},
		{
			$lookup: {
				from: 'users',
				localField: 'authorObjId',
				foreignField: '_id',
				as: 'user' 
			}
		},
		{   $unwind:"$user" },
		{   
			$project:{
				_id : 1,
				title : 1,
				description : 1,
				price : 1,
				isActive : 1,
				courseImage : 1,
				courseImagePublicId : 1,
				authorPic : "$user.profilePic",
				authorfirstName : "$user.firstName",
				authorlastName : "$user.lastName",
				rating: { $avg: "$enrollees.rating" },
				ratingCount : { $size: "$enrollees.rating"}
			} 
		}, 
		{$sort: {title: 1} }
		], (err,result) => { return (err) ? { status: 400, message: "Course fetch failed" } : result; });
}

module.exports.getByIdRoleStatus = (params) => { 
	if (params.role=="admin") {

		switch(params.status) {
			case "active":
				return Course.aggregate([
					{ $match: { isActive: true, authorId : params.id } },
					{ "$addFields": { "authorObjId": { "$toObjectId": "$authorId" }}},
					{
						$lookup: {
							from: 'users',
					      	localField: 'authorObjId',
					      	foreignField: '_id',
					      	as: 'user' 
					    }
					},
					{   $unwind:"$user" },
					{   
				        $project:{
				            _id : 1,
				            title : 1,
				            description : 1,
				            price : 1,
				            isActive : 1,
				            courseImage : 1,
				            authorId : 1,
				            authorPic : "$user.profilePic",
				            authorfirstName : "$user.firstName",
				            authorlastName : "$user.lastName"
				        } 
				    }, 
				    {$sort: {title: 1} }
					], (err, result) => { return (err) ? { status: 400, message: "Course fetch failed" } : result; });
				break;

			case "inactive":
				return Course.aggregate([
					{ $match: { isActive: false, authorId : params.id } },
					{ "$addFields": { "authorObjId": { "$toObjectId": "$authorId" }}},
					{
						$lookup: {
							from: 'users',
					      	localField: 'authorObjId',
					      	foreignField: '_id',
					      	as: 'user' 
					    }
					},
					{   $unwind:"$user" },
					{   
				        $project:{
				            _id : 1,
				            title : 1,
				            description : 1,
				            price : 1,
				            isActive : 1,
				            courseImage : 1,
				            authorId : 1,
				            authorPic : "$user.profilePic",
				            authorfirstName : "$user.firstName",
				            authorlastName : "$user.lastName"
				        } 
				    }, 
				    {$sort: {title: 1} }
					], (err, result) => { return (err) ? { status: 400, message: "Course fetch failed" } : result; });
				break;

			case "all":
				return Course.aggregate([
					{ $match: { authorId : params.id } },
					{ "$addFields": { "authorObjId": { "$toObjectId": "$authorId" }}},
					{
						$lookup: {
							from: 'users',
					      	localField: 'authorObjId',
					      	foreignField: '_id',
					      	as: 'user' 
					    }
					},
					{   $unwind:"$user" },
					{   
				        $project:{
				            _id : 1,
				            title : 1,
				            description : 1,
				            price : 1,
				            isActive : 1,
				            courseImage : 1,
				            authorId : 1,
				            authorPic : "$user.profilePic",
				            authorfirstName : "$user.firstName",
				            authorlastName : "$user.lastName"
				        } 
				    }, 
				    {$sort: {title: 1} }
					], (err,result) => { return (err) ? { status: 400, message: "Course fetch failed"} : result; });
				break;
		}

	} else {
		if (params.status!="All") {

			return Course.aggregate([
				{ $match: { 'enrollees.userId' : { $exists: true, $in: [params.id] }}},
				{ "$addFields": { "authorObjId": { "$toObjectId": "$authorId" }}},
				{
					$lookup: {
						from: 'users', 
				      	localField: 'authorObjId',
				      	foreignField: '_id',
				      	as: 'user'
				    }
				},
				{ $unwind:"$user" },
				{ $unwind: '$enrollees' },
	            { $match: {"$and": [{'enrollees.status': {$eq: params.status }}, {'enrollees.userId': {$eq: params.id}}]}},
				{   
			        $project:{
			            _id : 1,
			            title : 1,
			            description : 1,
			            price : 1,
			            isActive : 1,
			            courseImage : 1,
			            enrollmentStatus : '$enrollees.status',
						enrollmentRating : '$enrollees.rating',
			            authorId : 1,
			            authorPic : "$user.profilePic",
			            authorfirstName : "$user.firstName",
			            authorlastName : "$user.lastName"
			        } 
			    }, 
			    {$sort: {'enrollees.enrolledOn': 1} }
				], (err, result) => { return (err) ? { status: 400, message: "Course fetch by user failed"} : result; });

		} else {
			return Course.aggregate([
				{ $match: { 'enrollees.userId' : { $exists: true, $in: [params.id] }}},
				{ "$addFields": { "authorObjId": { "$toObjectId": "$authorId" }}},
				{
					$lookup: {
						from: 'users', 
				      	localField: 'authorObjId',
				      	foreignField: '_id',
				      	as: 'user'
				    }
				},
				{ $unwind:"$user" },
				{   
			        $project:{
			            _id : 1,
			            title : 1,
			            description : 1,
			            price : 1,
			            isActive : 1,
			            courseImage : 1,
			            enrollmentStatus : '$enrollees.status',
						enrollmentRating : '$enrollees.rating',
			            authorId : 1,
			            authorPic : "$user.profilePic",
			            authorfirstName : "$user.firstName",
			            authorlastName : "$user.lastName"
			        } 
			    }, 
			    {$sort: {'enrollees.enrolledOn': 1} }
				], (err, result) => { return (err) ? { status: 400, message: "Course fetch by user failed"} : result; });
		}
	}
}

module.exports.search= (params) => {
	return Course.aggregate([
		{ $match: { $text: { $search: params.body.searchString }, isActive: true } },
		{ "$addFields": { "authorObjId": { "$toObjectId": "$authorId" }}},
		{
			$lookup: {
				from: 'users', 
		      	localField: 'authorObjId',
		      	foreignField: '_id',
		      	as: 'user' 
		    }
		},
		{   $unwind:"$user" },
		{   
	        $project:{
	            _id : 1,
	            title : 1,
	            description : 1,
	            price : 1,
	            isActive : 1,
	            courseImage : 1,
	            authorId : 1,
	            authorPic : "$user.profilePic",
	            authorfirstName : "$user.firstName",
	            authorlastName : "$user.lastName",
				rating: { $avg: "$enrollees.rating" },
				ratingCount : { $size: "$enrollees.rating"}
	        } 
	    }
		], (err,result) => { return (err) ? { status: 400, message: "Course search failed"} : result; });
}

module.exports.getEnrollees = (params) => { 
	return Course.aggregate([
		{ $match: { _id : ObjectId(params.id) } },
		{ $unwind: '$enrollees' },
		{ "$addFields": { "enrolleeObjId": { "$toObjectId": "$enrollees.userId" }}},
		{
			$lookup: {
				from: 'users',
				localField: 'enrolleeObjId',
				foreignField: '_id',
				as: 'user' 
			}
		},
		{ $unwind:"$user" },
		{   
			$project:{
				enrolleePic   : "$user.profilePic",
				enrolleeFirstName : "$user.firstName",
				enrolleeLastName : "$user.lastName"
			} 
        }
	], (err,result) => { return (err) ? { status: 400, message: "Enrollees fetch failed"} : result; });
}

module.exports.create = (params) => {
	if (!params.file) { 
		return { status:400, message: "Course creation requires a picture" }
	} else {
		const file64 = formatBufferTo64(params.file);
		return cloudinaryUpload(file64.content).then(uploadResult => {
			var course = new Course();
			course.title = params.body.title;
			course.description = params.body.description;
			course.price = params.body.price;
			course.authorId = params.body.authorId;
			course.courseImage = uploadResult.url;
			course.courseImagePublicId = uploadResult.public_id;

			return course.save().then((saveResult, err) => { return (err) ? { status: 400, message: "Course creation failed" } : { status: 200, message: "Course created successfully" } });
		})
	}
}

module.exports.enroll = (params) => {
	return Course.updateOne({ _id: params.body.id, 'enrollees.userId': {$ne: params.body.userId}},
		{ $push: { enrollees: { userId: params.body.userId, enrolledOn: Date.now()}}})
	.then(result => { 
		if (result.nModified > 0) { 
			return User.updateOne({ _id: params.body.userId, 'enrollments.courseId': {$ne: params.body.id}},
			{ $push: { enrollments: { courseId: params.body.id, enrolledOn: Date.now() }}})
			.then(result => { return (result.nModified > 0) ? { status: 200, message: "Course enrolled successfully" } : { status: 400, message: "Something went wrong. Please try again" }; });
		} else {
			return { status: 400, message: "You have already taken this course" };
		}
	})
}

module.exports.enrolleeUpdate = (params) => {
	if (params.field=='status') {
		let incValue = 0;
		(params.arg=="Completed") ? incValue = 5 : incValue = 0; 
	
		return Course.findOneAndUpdate({ _id: params.courseid, 'enrollees.userId': params.enrolleeid }, { $set: { "enrollees.$.status": params.arg }})
		.then(updatedCourse => { 
			if (updatedCourse) {
				return User.findOneAndUpdate({ _id: params.enrolleeid, 'enrollments.courseId': params.courseid }, { $set: { "enrollments.$.status": params.arg }, $inc: { pointsCredited: incValue }})
				.then(updatedUser => { return (updatedUser) ? { status: 200, message: "Course status updated successfully", data: updatedCourse } : { status: 500, message: "Course status update failed" }; });
			} else {
				return { status: 400, message: "Something wrong happened" };
			}
		});
	} else if (params.field=='rating') {
		return Course.findOneAndUpdate({ _id: params.courseid, 'enrollees.userId': params.enrolleeid }, { $set: { "enrollees.$.rating": params.arg }})
		.then(updatedCourse => {  return (updatedCourse) ? { status: 200, message: "Course rating updated successfully", data: updatedCourse } : { status: 500, message: "Course rating update failed" };});
	} else {
		return {status: 400, message: "Bad Request" };
	}
}

module.exports.courseUpdate = (request) => { 
	if (!request.file) { 
		return Course.findByIdAndUpdate({ _id: request.params.id }, { title: request.body.title, description: request.body.description, price: request.body.price })
		.then(updatedCourse => { return (updatedCourse) ? { message: "Course update was successful", data: updatedCourse } : { message: "Course update failed" }; });
	} else {
		cloudinary.uploader.destroy(request.body.courseImagePublicId, { invalidate: true, resource_type: "image" }, (destroyErr, destroyResult) => {
			if (destroyErr) console.log("Error in destroy occured: " + destroyErr);
		});
		const file64 = formatBufferTo64(request.file);
    	return cloudinaryUpload(file64.content).then(uploadResult => {
    		return Course.findByIdAndUpdate({ _id: request.params.id }, { title: request.body.title, description: request.body.description, price: request.body.price,
    			courseImage: uploadResult.url, courseImagePublicId: uploadResult.public_id})
    		.then(updatedCourse => { return (updatedCourse) ? { message: "Course update was successful", data: updatedCourse } : { message: "Course update failed" }; });
    	})
	}
}

module.exports.deactivate = (params) => {
	return Course.findByIdAndUpdate({ _id: params.id }, { isActive: false})
	.then(updatedCourse => { return (updatedCourse) ? { status: 200, message: "Course deactivated successfully", data: updatedCourse } : { status: 400, message: "Course deactivation failed" }; });
}

module.exports.activate = (params) => {
	return Course.findByIdAndUpdate({ _id: params.id }, { isActive: true})
	.then(updatedCourse => { return (updatedCourse) ? { status: 200, message: "Course activated successfully", data: updatedCourse } : {  status: 400, message: "Course activation failed" }; });
}

module.exports.delete = (params) => {
	return Course.find({_id: params.id}).then(result => {
		cloudinary.uploader.destroy(result[0].courseImagePublicId, { invalidate: true, resource_type: "image" }, (destroyErr, destroyResult) => {
			if (destroyErr) console.log("Error in destroy occured: " + destroyErr);
		});
		return Course.findByIdAndRemove({ _id: params.id })
		.then(result => { return (result) ? { status: 200, message: "Course deleted successfully"} : { status: 400, message: "Course deletion failed"}});
	});
}



