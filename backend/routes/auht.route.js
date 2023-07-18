const { Router } = require('express');
const router = Router()
const { Register,Login } = require('../controller/auth');

router.post('/register',Register);
router.post('/login',Login);

module.exports = router;