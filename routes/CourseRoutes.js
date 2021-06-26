const CourseController = require('../controllers/CourseController');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/count', (req, res) => {
	CourseController.count().then(result => res.json({ count: result }));
});

router.get('/', (req,res) => {
	CourseController.getAll().then(result => res.send(result));
});

router.get('/active', (req,res) => {
	CourseController.getActive().then(result => res.send(result));
});

router.get('/course-exists', auth.verify, (req,res) => {
	CourseController.courseExists(req.query).then(result => res.send(result));
});

router.get('/:id&:role&:status', auth.verify, (req, res) => {
	CourseController.getByIdRoleStatus(req.params).then(result => res.send(result));
});

router.get('/:id', auth.verify, (req,res) => { 
	CourseController.getById(req.params).then(result => res.send(result));
});

router.get('/enrollees/:id', auth.verify, (req,res) => { 
	CourseController.getEnrollees(req.params).then(result => res.send(result));
});

router.put('/enroll', auth.verify, (req,res) => {
	CourseController.enroll(req).then(result => res.send(result));
});

router.post('/search', (req,res) => {
	CourseController.search(req).then(result => res.send(result));
});

router.put('/deactivate/:id', auth.verify, (req, res) =>{
	CourseController.deactivate(req.params).then(result => res.send(result));
});

router.put('/activate/:id', auth.verify, (req, res) => {
	CourseController.activate(req.params).then(result => res.send(result));
});

router.put('/enrollee', auth.verify, (req, res) => {
	CourseController.enrolleeUpdate(req.query).then(result => res.send(result));
});

router.delete('/:id', auth.verify, (req, res) => {
	CourseController.delete(req.params).then(result => { res.send(result);});
});

router.post('/create', auth.verify, upload.singleUploadCtrl, (req, res) => {
	CourseController.create(req).then(result => res.send(result));
});

router.put('/:id', upload.singleUploadCtrl, (req, res) => {
	CourseController.courseUpdate(req).then(result => res.send(result));
});

module.exports = router;