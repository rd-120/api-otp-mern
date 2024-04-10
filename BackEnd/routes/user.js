const express = require('express');
const { create, verifyEmail } = require('../controllers/user');
const { userValidtor, validate } = require('../middlewares/validator');

const router = express.Router();

router.post('/create', userValidtor, validate, create);
router.post('/verify-email', verifyEmail);

module.exports = router;
