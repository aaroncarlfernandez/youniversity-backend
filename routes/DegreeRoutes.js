const DegreeController = require('../controllers/DegreeController');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/count', (req, res) => {
	DegreeController.count().then(result => res.json({ count: result }));
});

router.get('/', (req,res) => {
	DegreeController.getAll().then(result => res.send(result));
});

router.get('/:id', auth.verify, (req,res) => { 
	DegreeController.getById(req.params).then(result => res.send(result));
});

router.put('/:id', auth.verify, upload.singleUploadCtrl, (req, res) => {
	DegreeController.degreeUpdate(req).then(result => res.send(result));
})

router.post('/create', auth.verify, upload.singleUploadCtrl, (req, res) => {
	DegreeController.create(req).then(result => res.send(result));
});


module.exports = router;