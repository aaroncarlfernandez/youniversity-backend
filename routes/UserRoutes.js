const UserController = require('../controllers/UserController');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/count', (req, res) => {
	UserController.count().then(result => res.json({ count: result }));
});

router.post('/email-exists', (req,res) => {
	UserController.emailExists(req.body).then(result => res.send(result));
});

router.post('/', (req, res) => {
	UserController.register(req.body).then(result => res.send(result));
});

router.post('/login', (req, res) => {
	UserController.login(req.body).then(result => res.send(result));
});

router.get('/details', auth.verify, (req, res) => {
	const user = auth.decode(req.headers.authorization);
	UserController.get({ userId: user.id }).then(user => res.send(user));
});

router.put('/:id', auth.verify, upload.singleUploadCtrl, (req, res) => {
	UserController.update(req).then(result => res.send(result));
});

router.delete('/:id', auth.verify, (req, res) => {
	UserController.delete(req.params).then(result => { res.send(result);});
});

module.exports = router;