const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const app = express();

mongoose.connect(process.env.DATABASE,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useUnifiedTopology:true
    
}).then(()=>
        console.log("DB connected")
    ).catch((error)=>console.log(error))
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
const port = process.env.PORT||8000;

app.listen(port,()=>{
    console.log(`Serve is running on ${port}`)
})