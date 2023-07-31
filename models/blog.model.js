const mongoose = require('mongoose')
const blogSchema = new mongoose.Schema({
    Title :{
        type:String,
        require:true
    },
    Category :{
        type:String,
        require:true
    },
    Author :{
        type:String,
        require:true
    },
    Content :{
        type:String,
        require:true
    },
    autherEmail:{
        type:String,
        require:true
    }
})

const blogModel = mongoose.model('blog',blogSchema)
module.exports = blogModel