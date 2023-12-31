const pg = require('../db/pg');
const { passHash, passCompare } = require('../utils/bcrypt');
const { sign,verify } = require('../utils/jwt')
const Register = async(req,res)=>{
try {
    const { username,password } = req.body;
    console.log(req.body);

    const findUser = await pg("select * from auth where username = $1",username);

    if (findUser.length) {
        return res.status(403).json({message:'username bor'})
    }
    const hashPass = await passHash(password);
    const newUser = (await pg("insert into auth(username,password)values($1,$2) returning *",username,hashPass))[0];
    res.status(201).json({message:"succes register" ,data:newUser})
} catch (error) {
    res.status(400).json({message:error})
}
}

const Login = async(req,res) => {
try {
    const { username,password } = req.body;
    const findUser = (await pg("select * from auth where username = $1",username))[0];
    console.log(findUser);
    if (!findUser) { 
        return res.status(403).json({message:'not user'})
    }
    const compare = await passCompare(password,findUser.password)
    if(!compare){
        return res.status(403).json({message:'Incorrent password or username'})
    }
    const token = await sign(findUser.id);
    res.cookie('token',token)
    res.status(200).json({message:'succes'})
} catch (error) {
    res.status(400).json({message:error})
}
}

const isAuth = async(req,res,next) => {
    try {
      const { token } = req.headers;
      const user_id = await verify(token);
      const users = (await pg("select * from auth where id = $1",user_id))[0];
      if (users) {
        next()
      }
    } catch (error) {
       console.log(error);
    }
}

module.exports = {
    Register,
    Login,
    isAuth
}