const mongoose = require("mongoose");
const crpto = requires("crypto");
const uuidv1 = require("uuid/v1");


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        maxlength:32
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:32
    },
    hashed_password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        trim:true
    },
    salt:String,
    role:{
        type:Number,
        default:0
    },
    history:{
        type:Array,
        default:[]
    }
},{timestamps:true})

// virtual field

userSchema.virtual("password").set((password)=>{
    this._password = password;
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
})
.get(()=>{
    return this._password;
})

userSchema.methods = {
    encryptPassword:function (password) {
            if(!password){
                return "";
            }
            try{
                return crpto.createHmac("sha1", this.salt).update(password).digest("hex")
            } catch(err){
                return "";
            }
    }
}

module.exports = mongoose.model("User", userSchema);