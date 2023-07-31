const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    email:{
        type:String,require:true,unique:true
    },
    password:{
        type:String,require:true
    },
    mobileNo:{
        type:Number
    }
})

const userModel = mongoose.model('user',userSchema)
module.exports = userModel