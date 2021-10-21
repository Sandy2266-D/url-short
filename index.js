const express = require('express')
const bodyParser = require ('body-parser')
const mongoose=require('mongoose')
const app=express()

const db = 'mongodb+srv://Santhose:Santhose@cluster0.yyklc.mongodb.net/urlShort?retryWrites=true&w=majority'
mongoose.connect(db)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

 const{ UrlModel } = require('./models/urlShort')

//middleware
app.use(express.static('public'))
app.set('view engine',"ejs")

app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

app.get('/',function(req,res){
let allUrl=UrlModel.find(function(err,result){
    res.render('home',{
        urlResult:result
    })
})
})

app.post('/create',function(req,res){
    
    let urlShort=new UrlModel({
        longUrl:req.body.longUrl,
        shortUrl:generateUrl()
    })
    urlShort.save(function(err,data){
        if(err)
        throw err;
        res.redirect('/');
    })
    })

app.get('/:urlId',function(req,res){
    let urlShort=UrlModel.findOne({shortUrl : req.params.urlId},function(err,data)
    {
        if(err) throw err;

        UrlModel.findByIdAndUpdate({_id:data.id},{$inc:{count : 1}},function(err,updatedData)
        {
            if(err) throw err;
            res.redirect(data.longUrl)
        })
        
    })
})

app.get('/delete/:id',function(req,res){
    UrlModel.findByIdAndDelete({_id:req.params.id},function(err,deleteData){
        if(err) throw err;
        res.redirect('/')
    })
})
app.listen(5000,function(){
    console.log("port is running")
})

function generateUrl(){
    var output="";
    var characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength=characters.length;
for(var i=0;i<5;i++)
{
    output += characters.charAt(
        Math.floor(Math.random() * charactersLength )
    )
}
console.log(output)
return output
}