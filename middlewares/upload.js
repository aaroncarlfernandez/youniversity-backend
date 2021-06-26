const cloudinary = require('cloudinary');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const singleUpload = upload.single('uploadedImage');

module.exports.singleUploadCtrl = (req, res, next) => {
	return singleUpload(req, res, (error) => {
  		return (error) ? res.send({ status: 400, message: 'Image upload failed' }) : next();
  	});
}