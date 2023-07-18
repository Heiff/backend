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
    
} catch (error) {
    
}
}



module.exports = {
addCard,
createChannel
}