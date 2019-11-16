const Category = require("../models/category");
const {errorHandler} = require("../helpers/dberrorHandler");
exports.create = (req,res)=>{
    const category = new Category(req.body);
    category.save((error,data)=>{
        if(error){
            return res.status(400).json({
                error:errorHandler(error)
            })
        }

        res.json({data})
    }); 
}