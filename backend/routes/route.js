const { Router } = require('express');
const { addCard } = require('../controller/controller');
const router = Router();

router.post('/card',addCard)


module.exports = router