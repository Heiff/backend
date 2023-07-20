const { sign,verify } = require('../utils/jwt');
const pg = require('../db/pg');

const addCard = async(req,res) => {
    try {
        const {name,number,balance} = req.body;
        const { token } = req.cookies;
        const user_id = await verify(token);
        const card = (await pg("insert into card(name,number,balance,user_id)values($1,$2,$3,$4) returning *",name,number,balance,user_id))[0]
        res.status(201).json({message:'succes'})
    } catch (error) {
        res.status(500).json({error})
    }
}




const createChannel = async(req,res) => {
try {
    const {name,month,year,descr} = req.body;
    const { token } = req.cookies;
    const user_id = await verify(token);
    const card_id = (await pg("select * from card where user_id = $1",user_id))[0].id;
    await pg("insert into channel(name,month,year,descr,card_id,author_id)values($1,$2,$3,$4,$5,$6)",name,month,year,descr,card_id,user_id);
    res.status(201).json({message:'created channel'})
} catch (error) {
    res.status(500).json({error})
}
}


const getChannel = async(req,res) => {
    try {
        const user_id = await verify(req.headers.token);
        const data = await pg("select * from channel");
        res.status(200).json({data,user_id})
    } catch (error) {
        res.status(500).json({error})
    }
}

const getCard = async(req,res) =>{
    try {
        const user_id = await verify(req.headers.token);
        const card = (await pg("select * from card where user_id = $1",user_id))[0];
        res.status(200).json({balance:card.balance})
    } catch (error) {
        res.status(500)
    }
}

const subscribe = async(req,res) => {
    try {
        const { option,id,name,el } = req.body;
        const { token } = req.cookies;
        const user_id = await verify(token);
        const card = (await pg("select * from card where id = $1",user_id))[0];
        const s = (await pg("select * from channel where id = $1",el))[0];
        let year;
        let month;
        let day;
        if(s.month == option){
            let date = new Date();
            year = date.getFullYear()
            month = date.getMonth() + 1
            day = date.getDate()
        }
        else if(s.year == option){
            let date = new Date();
            year = date.getFullYear() + 1
            month = date.getMonth() + 1
            day = date.getDate()
        }
        await pg("start transaction")[0];
        if (option < card.balance && id != user_id) {
            await pg("update card set balance = balance - $1 where user_id = $2",option,user_id);
            await pg("update card set balance = balance + $1 where id = $2",option,id);
            await pg("insert into subscribe(name,price,year,month,day,user_id)values($1,$2,$3,$4,$5,$6)",name,option,year,month,day,user_id);
            res.status(201).json({message:'succes'})
        }
        else{
            await pg("ROLLBACK");
            res.status(400).json({message:'error'})
        }
    } catch (error) {
        res.status(500).json({error})
    }
};

const DeleteSubscribe = async(req,res,next) => {
    try {
        const user_id = await verify(req.headers.token);
        const subscribe = (await pg("select * from subscribe where user_id = $1",user_id))[0]
        if (subscribe) {
            const year = new Date().getFullYear();
            const month = new Date().getMonth() + 1;
            const day = new Date().getDate();
            if (subscribe.year == year && subscribe.month == month && subscribe.day == day) {
                await pg("delete from subscribe where user_id = $1",user_id);
                next()
            }
        } 
        next()
    } catch (error) {
      console.log(error);  
    }
}



module.exports = {
addCard,
createChannel,
getChannel,
subscribe,
getCard,
DeleteSubscribe
}