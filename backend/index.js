const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const Cookie = require('cookie-parser');
require('dotenv').config();
const app = express();
const routers = require('./routes/All')

const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:'http://localhost:3000',
    credentials:true
}));
app.use(Cookie());
app.use(fileUpload());;
app.use('/',routers)


app.listen(port,()=>{
    console.log(port);
})