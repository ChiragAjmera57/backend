const express = require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const connection = require('./config/mongodb');
const User = require('./models/user.model')
const Blog = require('./models/blog.model')
const authentication = require('./middleware/authentication')
require('dotenv').config()
const app = express();
app.use(express.json())


app.get('/',(res,req)=>{
    res.send({msg:"base route"})
})


app.post('/signup',async(req,res)=>{
    const {email,password,mobileNo} = req.body;
    const found = await User.findOne({email:email})
    if(found!=null){
        res.send({msg:"email already registered"})
    }
    else{
        await bcrypt.hash(password, 5, function(err, hash) {
            const user =new User({
                email,password : hash,mobileNo
            });
            try {
                 user.save()
                res.send({msg:"user registerd succesfully"});
            } catch (error) {
                res.send({msg:"please try again later"})
            }
        });
       
      
       
    }
})

app.post('/login',async(req,res)=>{
    const {email,password} = req.body
    const found = await User.findOne({email:email})
    if(found==null){
        res.send({msg:"invalid input"})
    }
    else{
        const hash_password = found.password
        bcrypt.compare(password, hash_password, function(err, response) {
            if(response){
                let token = jwt.sign({user_id : found._id}, process.env.SECRET_KEY);
                
                res.send({msg : "login successfull", token : token})
                
            }
            else{
               res.status(400).send({msg:"invalid input"})
            }
        });
    }

})


app.get('/blog',authentication ,async(req,res)=>{
    const found = await Blog.find({});
    res.send({data:found})
})

app.post('/blog/create',authentication,async(req,res)=>{
    const { Title ,Category ,Author ,Content } = req.body
    const  autherid = req.user_id
    const found = await User.findById(autherid)
    const auther_mail = found.email
    const autherName = auther_mail.substring(0,2);
    const blog = new Blog({Title,Category,Author:autherName,Content,autherEmail:auther_mail})
    try {
        blog.save()
        res.send({msg:`blog created for${auther_mail}`})
    } catch (error) {
        res.send({msg:"something went wrong"})
    }


})

app.put('/blog/update/:blogId',authentication ,async(req,res)=>{
    const blogId = req.params.blogId
    const  autherid = req.user_id
    const foundAuther = await User.findById(autherid)

    const foundBlog = await Blog.findById(blogId)
    // console.log(foundBlog);
    console.log(foundAuther.email,foundBlog.autherEmail);
    if(foundAuther.email==foundBlog.autherEmail){
        const payload = req.body 
        await Blog.findByIdAndUpdate(blogId,payload)
        res.send(`blog ${blogId} updated,by ${foundAuther.email}`)
    }
    else{
        res.send({msg:"not permitted"})
    }

})


app.delete('/blog/delete/:blogId',authentication ,async(req,res)=>{
    const blogId = req.params.blogId
    const  autherid = req.user_id
    const foundAuther = await User.findById(autherid)

    const foundBlog = await Blog.findById(blogId)
    console.log(foundAuther.email,foundBlog.autherEmail);
    if(foundAuther.email==foundBlog.autherEmail){
       
        await Blog.findByIdAndDelete(blogId)
        res.send(`blog ${blogId} deleted,by ${foundAuther.email}`)
    }
    else{
        res.send({msg:"not permitted"})
    }

})



app.listen('8080',async()=>{
    try{
        await connection
        console.log("connected to DB Successfully")
    }
    catch(err){
        console.log("Error while connecting to DB")
        console.log(err)
    }
    console.log("listinig at 8080");
})