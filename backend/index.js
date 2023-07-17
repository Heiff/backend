const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const Cookie = require('cookie-parser');
require('dotenv').config();
const app = express();

const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(Cookie());
app.use(fileUpload());
app.use(express.static(process.cwd() + "/uploads"));
app.get('/',(req,res)=>{
res.status(200).json([{message:'succes'}])
})


app.listen(port,()=>{
    console.log(port);
})