const { sign,verify } = require('../utils/jwt');
const pg = require('../db/pg');

const addCard = async(req,res) => {
    try {
        const {name,number,balance} = req.body;
        const { token } = req.cookies;
        console.log(balance);
        const user_id = await verify(token);
        await pg("insert into card(name,number,balance,user_id)values($1,$2,$3,$4)",name,number,balance,user_id);
        res.status(201).json({message:'succes'})
    } catch (error) {
        res.status(500).json({error})
    }
}

const createChannel = async(req,res) => {
try {
    const {name,week,month,year,descr} = req.body;
    const { token } = req.cookies;
    const user_id = await verify(token);
    const card_id = (await pg("select * from card where user_id = $1",user_id))[0].id;
    await pg("insert into channel(name,week,month,year,descr,card_id,author_id)values($1,$2,$3,$4,$5,$6,$7)",name,week,month,year,descr,card_id,user_id);
    res.status(201).json({message:'created channel'})
} catch (error) {
    res.status(500).json({error})
}
}

const getChannel = async(req,res) => {
    try {
        const data = await pg("select * from channel")
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({error})
    }
}



module.exports = {
addCard,
createChannel,
getChannel
}