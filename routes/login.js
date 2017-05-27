var express = require('express');
var router = express.Router();
var passport = require('passport');
var nodemailer = require("nodemailer");
var md5 = require('MD5');
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Player = mongoose.model('Player');


router.get('/',function(req,res) {
  if(req.isAuthenticated())
    res.redirect('/');
  else
    res.render('login');
});
router.post('/',
  passport.authenticate('login', { 
    successRedirect: '/api/login/a', 
    failureRedirect: '/api/login/b', 
    failureFlash: false })
);

router.get('/a', function(req,res) {
  res.json({msg:"suc"});
});
router.get('/b', function(req,res) {
  res.json({msg:"err",error:"Incorrect username/password"});
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/index.html');
});

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "dicesimon123@gmail.com",
        pass: "qwertypad"
    }
});
var rand,mailOptions,host,link;

router.post('/forgot', function(req, res) {
    rand= md5(req.body.email+new Date());
    Player.findOne({ email: req.body.email }, function (err, user) {
       if (err){ console.log("1");
       return res.json({error:"email dosen't exist"}); 
       }
        if(user){
          user.resetPasswordExpires = Date.now() + 3600000; 
          user.forgothash=rand;
          user.save();
        }
    });
    host=req.get('host');
    link="http://"+req.get('host')+"/api/login/verifyforgot?id="+rand;
    mailOptions={
    to : req.body.email,
    subject : "Request for Password change",
    html : "Hello,<br> Please Click on the link to change your password.<br><a href="+link+">Click here to verify</a>" 
    }
    smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
    console.log("verifyforgot");
        console.log(error);
        res.send({email:"email"})
    }else{
        console.log("Message sent: " + response.message);
        res.json({message:"sent"});
     }
    });

});

router.get('/verifyforgot',function(req,res){
  host=req.get('host');

  if((req.protocol+"://"+req.get('host'))==("http://"+host))
  {
    console.log("Domain is matched. Information is from Authentic email");
    Player1.findOne({ forgothash: req.query.id, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
      if(err){return res.json({error:"Your email time is expired. Please request reset password again!!"})}
      if(user){
        res.redirect('/html/newpass.html?id='+req.query.id);
      }
    });
  }
  else
  {
    res.json({error:"you did something unexpected"});
  }
});

router.post('/reset',function(req,res) {
  var id = req.body.id;
});

module.exports = router;