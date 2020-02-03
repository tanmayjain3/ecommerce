const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const brainTreeRoutes = require("./routes/braintree");
const app = express();
const uri = "mongodb+srv://tanmayjain:tanmay@19@cluster0-5djwb.mongodb.net/test"

// mongoose.connect(process.env.DATABASE,{
//         useNewUrlParser:true,
//         useCreateIndex:true,
//         useUnifiedTopology:true
    
// }).then(()=>
//         console.log("DB connected")
//     ).catch((error)=>console.log(error))

mongoose.connect(uri,{
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
app.use(cors());

app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",brainTreeRoutes);
const port = process.env.PORT||8000;

app.listen(port,()=>{
    console.log(`Serve is running on ${port}`)
})