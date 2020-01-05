const formidable = require("formidable");
const _ = require("lodash");
const Product  = require("../models/product");
const fs = require("fs");
const errorHandler = require("../helpers/dberrorHandler");

exports.productById = (req,res,next, id) =>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err || !product){
            return res.status(400).json({
                error:"Product not found"
            })
        }
        req.product = product;
        next();
    })
}

exports.read = (req,res)=>{
    req.product.photo = undefined;
    return res.json(req.product);
}


exports.create = (req,res)=>{

    let form = new formidable.IncomingForm();
     form.keepExtensions = true;
     form.parse(req,(err,fields,files) =>{
        if(err){
            return res.status(400).json({
                error:"Image could not be uploaded"
            })
        }
        const {name, description, quantity, price, category, shipping} = fields;
        if(!name || !description || !quantity || !price || !category || !shipping){
            return res.status(400).json({
                error:"All fields are required"
            })
        }
        let product = new Product(fields)
   
        if(files.photo){

            if(files.photo.size>100000){
                return res.status(400).json({
                    error:"Image should be less than 1mb in size"
                })  
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type;
        }
   
        product.save((err,result)=>{
           if(err){
               return res.status(400).json({
                   error:errorHandler(err)
               })
           }
   
           res.json(result);
   
        })
     })
}

exports.remove = (req,res) =>{
    let productId =req.product._id;
     Product.findById(productId).exec((err,product)=>{
            if(err || !product){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            Product.findByIdAndDelete(productId);

            res.json({
                "message":"Deleted product"
            })
     })
}

exports.update = (req,res)=>{

    let form = new formidable.IncomingForm();
     form.keepExtensions = true;
     form.parse(req,(err,fields,files) =>{
        if(err){
            return res.status(400).json({
                error:"Image could not be uploaded"
            })
        }

        const {name, description, quantity, price, category, shipping} = fields;
        if(!name || !description || !quantity || !price || !category || !shipping){
            return res.status(400).json({
                error:"All fields are required"
            })
        }
        let product = req.product;
        product = _.extend(product,fields);
   
        if(files.photo){
            if(files.photo.size>100000){
                return res.status(400).json({
                    error:"Image should be less than 1mb in size"
                })  
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type;
        }
   
        product.save((err,result)=>{
           if(err){
               return res.status(400).json({
                   error:errorHandler(err)
               })
           }
   
           res.json(result);
   
        })
     })
}

exports.list = (req,res) =>{
    let order = req.query.order ? req.query.order : "desc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy,order]])
        .limit(limit)
        .exec((err,data)=>{
            if(err){
                return res.status(400).json({
                    error:"Products not found"
                })
            }

            res.json(data)
        })

}

exports.listRelated = (req,res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    Product.find({_id:{$ne:req.product},category:req.product.library})
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, products)=>{
        if(err){
            return res.status(400).json({
                error:"Products not found"
            })
        }

        res.json(products);
    })
}

exports.listCategories = (req,res) =>{
    Product.distinct("category",{},(err,categories)=>{
        if(err){
            return res.status(400).json({
                error:"Categories not found"
            })
        }

        res.json(categories);
    })
}

exports.listBySearch = (req,res) =>{
    let order = req.query.order ? req.query.order : "desc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for(let key in req.body.filters){
        if(req.body.filters[key].length>0){
            if(key=="price"){
                findArgs[key] = {
                    $gte : req.body.filters[key][0],
                    $lte : req.body.filters[key][1]
                }
            } else{
                findArgs[key] = req.body.filters[key]
            }
        }
    }

    Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy,order]])
    .skip(skip)
    .limit(6)
    .exec((err,data)=>{
        if(err){
            return res.status(400).json({
                error:err
            })
        }

        res.json({
            size:data.length,
            data
        })
    })
}

exports.photo = (req,res, next)=>{
    console.log("Tanmay")
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }

    next();
}

exports.listSearch = (req,res) =>{
    const query = {};
    if(req.query.search){
        query.name = {$regex:req.query.search, $options:"i"}

        if(req.query.categpry && req.query.category!="All"){
            query.category = req.query.category;
        }

        Product.find(query,(err,products)=>{
            if(err){
                return res.status(400).json({
                    error:"Error"
                })
            }
            res.json(products)
        }).select("-photo")
    }
}