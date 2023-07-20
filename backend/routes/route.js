const { Router } = require('express');
const { addCard, createChannel, getChannel, subscribe, getCard, DeleteSubscribe } = require('../controller/controller');
const { isAuth } = require('../controller/auth');
const router = Router();

router.post('/card',addCard);
router.post('/channel',createChannel);
router.get('/channel',isAuth,DeleteSubscribe,getChannel);
router.post('/subscribe',subscribe)
router.get('/card',getCard)


module.exports = router