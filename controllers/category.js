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

exports.categoryById = (req,res, next, id)=>{
    Category.findById(id).exec((err,category)=>{
        if(err || !category){
            return res.status(400).json({
                error:"Category not found"
            })
        }

        req.category = category;
        next();
    })
} 

exports.read = (req,res)=>{
    return res.json(req.category);
}


exports.update = (req,res)=>{
    const category = req.body
    category.name = req.body.name
    category.save((err,data)=>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }

        res.json(data);
    })
}

exports.remove = (req,res)=>{
    const category = req.body;
    category.remove((err,data)=>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }

        res.json({
            "message":"Deleted category"
        });
    })
}


exports.list = (req,res)=>{
    Category.find().exec((err,data)=>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }

        res.json(data);
    })
}