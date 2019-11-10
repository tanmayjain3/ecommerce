const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
const userRoutes = require("./routes/user");
const app = express();

mongoose.connect(process.env.DATABASE,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useUnifiedTopology:true
    
}).then(()=>
        console.log("DB connected")
    ).catch((error)=>console.log(error))

app.use("/api",userRoutes);
const port = process.env.PORT||8000;

app.listen(port,()=>{
    console.log(`Serve is running on ${port}`)
})