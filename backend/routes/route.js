const { Router } = require('express');
const { addCard, createChannel, getChannel, subscribe, getCard, DeleteSubscribe, DeleteChannel } = require('../controller/controller');
const { isAuth } = require('../controller/auth');
const router = Router();

router.post('/card',isAuth,addCard);
router.post('/channel',isAuth,createChannel);
router.get('/channel',isAuth,DeleteSubscribe,getChannel);
router.post('/subscribe',isAuth,subscribe)
router.get('/card',isAuth,getCard)
router.delete('/delete/:id',isAuth,DeleteChannel)


module.exports = router