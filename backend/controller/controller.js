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
    const user_id = await verify(req.headers.token);
    const card_id = (await pg("select * from card where user_id = $1",user_id))[0].id;
    await pg("insert into channel(name,month,year,descr,card_id,author_id)values($1,$2,$3,$4,$5,$6)",name,month,year,descr,card_id,user_id);
    res.status(201).json({message:'created channel'})
} catch (error) {
    res.status(500).json({error})
}
}

const DeleteChannel = async(req,res) => {
    try {
        const { id } = req.params;
        await pg("delete from channel where id = $1",id);
        await pg("delete from subscribe where channel_id = $1",id)
        res.status(200).json({message:'succes'})
    } catch (error) {
        res.status(500).json({message:'error'})
    }
}


const getChannel = async(req,res) => {
    try {
        const user_id = await verify(req.headers.token);
        const data = await pg("select * from channel");
        const subscribe = (await pg("select * from subscribe where user_id = $1",user_id))[0];
        
        if (user_id && subscribe) {
            const notSub = data.filter((el) => {  
                return el.id != subscribe.channel_id && el.author_id != user_id;
            })
            const Sub = data.filter((el) => {  
                return el.id == subscribe.channel_id && el.author_id != user_id;
            })
            const my = data.filter((el) => {  
                return el.author_id == user_id;
            })
            res.status(200).json({data:notSub,sub:Sub,My:my,user_id})
        }
        else if (user_id) {
            let notSub
           if (subscribe) {
                notSub = data.filter((el) => {  
                return el.id != subscribe.channel_id && el.author_id != user_id;
            })
            const Sub = data.filter((el) => {  
                return el.id == subscribe.channel_id && el.author_id != user_id;
            })
            const my = data.filter((el) => {  
                return el.author_id == user_id;
            })
            console.log(notSub);
            res.status(200).json({data:notSub,sub:Sub,My:my,user_id})

           }
           else{
            const all = data.filter((el) => {  
                return el.author_id != user_id;
                })
            const my = data.filter((el) => {  
            return el.author_id == user_id;
            })
            res.status(200).json({data:all,My:my,user_id})
           }
            
           
        }
        else{
            res.status(200).json({data,user_id})
        }
    } catch (error) {
        console.log(error);
    }
}

const getCard = async(req,res) =>{
    try {
        const user_id = await verify(req.headers.token);
        const card = (await pg("select * from card where user_id = $1",user_id))[0];
        res.status(200).json({balance:card.balance})
    } catch (error) {
        console.log(error);
    }
}

const subscribe = async(req,res) => {
    try {
        const { option,id,name,el } = req.body;
        const user_id = await verify(req.headers.token);
        const card = (await pg("select * from card where id = $1",user_id))[0];
        const channel = (await pg("select * from channel where id = $1",el))[0];
        const subscribes = (await pg("select * from subscribe where user_id = $1",user_id))[0];
        let year;
        let month;
        let day;
        if(channel.month == option){
            let date = new Date();
            year = date.getFullYear()
            month = date.getMonth() + 1
            day = date.getDate()
            if (month == 12) {
                year + 1
                month = 1
            }
        }
        else if(channel.year == option){
            let date = new Date();
            year = date.getFullYear() + 1
            month = date.getMonth() + 1
            day = date.getDate()
        }
        if (subscribes || subscribes == undefined) {
            await pg("start transaction")[0];
            if (option < card.balance && subscribes) {
               if (el != user_id && subscribes.name != name) {
                await pg("update card set balance = balance - $1 where user_id = $2",option,user_id);
                await pg("update card set balance = balance + $1 where id = $2",option,id);
                await pg("insert into subscribe(name,price,year,month,day,user_id,channel_id)values($1,$2,$3,$4,$5,$6,$7)",name,option,year,month,day,user_id,el);
                res.status(201).json({message:'succes'})
               }
            }
            else if(subscribes == undefined && option < card.balance){
                await pg("update card set balance = balance - $1 where user_id = $2",option,user_id);
                await pg("update card set balance = balance + $1 where id = $2",option,id);
                await pg("insert into subscribe(name,price,year,month,day,user_id,channel_id)values($1,$2,$3,$4,$5,$6,$7)",name,option,year,month,day,user_id,el);
                res.status(201).json({message:'succes'})
            }
            else{
                await pg("ROLLBACK");
                res.status(400).json({message:'error'})
            }
        }  
    } catch (error) {
        console.log(error);
    }
};

const DeleteSubscribe = async(req,res,next) => {
    try {
        const user_id = await verify(req.headers.token);
        const subscribe = await pg("select * from subscribe where user_id = $1",user_id);
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
       
    }
}



module.exports = {
addCard,
createChannel,
getChannel,
subscribe,
getCard,
DeleteSubscribe,
DeleteChannel
}