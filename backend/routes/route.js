const { Router } = require('express');
const { addCard, createChannel, getChannel } = require('../controller/controller');
const router = Router();

router.post('/card',addCard);
router.post('/channel',createChannel);
router.get('/channel',getChannel)


module.exports = router