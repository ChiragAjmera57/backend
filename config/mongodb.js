const mongoose = require('mongoose')
require('dotenv').config()
const url = "mongodb+srv://chiragajmera57:KTq7p1JboSkaYuHy@chiragajmera.rht24ui.mongodb.net/blog"
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
 }
 const connection = mongoose.connect(url,connectionParams) 
module.exports = connection 