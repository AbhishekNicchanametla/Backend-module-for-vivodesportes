var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
var md5 = require('MD5');
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Player = mongoose.model('Player');

var createHash = function(password){
        return md5(password)
}

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "dicesimon123@gmail.com",
        pass: "qwertypad"
    }
});
var rand,mailOptions,host,link;
router.get('/',function(req,res) {
  res.send('test');
})
router.post('/', function(req, res) {
  
  console.log("entered");
  Player.findOne({$or: [{username:req.body.username},{email:req.body.email}]},function(err,user) {
    if(err) { return next(err); }
    if(user) {
      if(user.email==req.body.email) 
        res.json({error:"email"});
      else
        res.json({error:"username"});
      return;
    }
    else createUser(req,res);
  });
  
  // Player.findOne({email:req.body.email},function(err,user) {
  //   if(err) { return next(err); }
  //   if(user) { 
  //     res.json({message:"email exist"});
  //     return;
  //   }
  //   else createUser(req,res);
  // });
  
});

router.get('/verify',function(req,res){
  host=req.get('host');
  if((req.protocol+"://"+req.get('host'))==("http://"+host))
  {
    console.log("Domain is matched. Information is from Authentic email");
    Player.findOne({ verifyhash: req.query.id }, function (err, user) {
      if(err){res.send(err)}
       user.active=1;
       user.save();
       res.redirect('/html/login.html')
    });
  }
  else
  {
    res.json({error:"You did something unexpected!!"});
  }
});

function createUser(req,res) {
  var p1 = new Player();
  p1.username=req.body.username;
  p1.password=createHash(req.body.password);
  p1.email=req.body.email;
  p1.active = 0;
  p1.f_name = "User";
  rand= md5(req.body.username+new Date());
  p1.verifyhash=rand;
  p1.save(function (err, p1) {
  if (err) return req.json({error:"Problem in Database. Try Again later."});
  });
  
  host=req.get('host');
  link="http://"+req.get('host')+"/api/register/verify?id="+rand;
  mailOptions={
    to : req.body.email,
    subject : "Please confirm your Email account",
    html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a><br>You will be redirected to login page." 
  }

  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      return res.json({error:"Error in sending email. Please contact administrator of the site"});
    }
    else{
      console.log("Message sent: " + response.message);
    }
  });
  res.json({msg:"suc"})
}

module.exports = router;