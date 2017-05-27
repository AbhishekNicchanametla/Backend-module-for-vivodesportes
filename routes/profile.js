var express = require('express');
var router = express.Router();
var md5 = require('MD5');
var mongoose = require('mongoose');
var Player = mongoose.model('Player');
var fs = require('fs');
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, req.user.username+".jpg");
  }
});
var upload = multer({storage: storage});

router.get('/',ensureAuthenticated,function(req,res) {
  Player.findOne({username:req.user.username},function(err,p) {
    if(err) { return res.json({error:"database error"});}
    if(p){
      res.json(p);
    }
  }).select({_id:0,verifyhash:0,password:0});    
});

router.post('/',ensureAuthenticated,function(req,res) {
  console.log(req.body);
  Player.findOne({username:req.user.username},function(err,p) {
    if(err) { return res.json({error:"database error"});}
    if(p){
      p.f_name = req.body.f_name;
      p.l_name = req.body.l_name;
      p.email = req.body.email;
      p.bdate = req.body.bday;
      p.contact = req.body.contact;
      p.fav_footballer = req.body.fav_footballer;
      p.fav_club = req.body.fav_club;
      p.pre_foot = req.body.pre_foot;
      p.save();
      res.json({msg:"profile updated!!",p});
    }
  });
  
});
router.get('/pic',function(req,res) {
    var get = req.query.name;
    console.log(get);
    var fs = require('fs'),
    path = 'public/uploads/'+get+'.jpg';
    fs.exists(path, function(exists) { 
        if (exists) { 
          console.log("1");
          return res.redirect('/uploads/'+get+'.jpg');
        }
        console.log("12"+path);
        return res.redirect('/uploads/none.jpg');
    }); 
});

router.get('/picrm',ensureAuthenticated,function(req,res) {
    var fs = require('fs'),
    path = 'public/uploads/'+req.user.username+'.jpg';
    fs.exists(path, function(exists) { 
        if (exists) { 
          fs.unlink(path);
        }
    }); 
    res.redirect(req.headers['referer']);
});

router.post('/pic',ensureAuthenticated, function(req, res) {
  upload.single('image')(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      return res.send(err);
    }
      res.redirect(req.headers['referer']);
  });
});

router.post('/rating',ensureAuthenticated,function(req,res) {
  var rating = req.body.rating;
  Player.findOne({username:req.user.username},function(err,p) {
      if(err) {return res.json({error:"database error"});}
      if(p){

        p.rating = rating;
        p.save();
        console.log(req.body.rating+" p "+p.rating);
        res.json({msg:"rating updated!!"});
      }
  });
});

router.post('/skills',ensureAuthenticated,function(req,res) {
  Player.findOne({username:req.user.username},function(err,p) {
      if(err) {return res.json({error:"database error"});}
      if(p){
        p.skills = req.body;
        p.save();
        res.json({msg:"skills updated!!"});
      }
  });
});

router.post('/pass',ensureAuthenticated,function(req,res) {
  var oldpass = req.body.password;
  var newpass = req.body.newpass;
  Player.findOne({username:req.user.username},function(err,p) {
    if(err) {return res.json({error:"database error"});}
    if(p){
        console.log(p.password+" "+createHash(oldpass));
        if(p.password != createHash(oldpass)){
          return res.json({error:"Wrong current password"})
        }
        else{
          p.password = createHash(newpass);
          p.save();
          res.json({msg:"password changed!!"});
        }
    }
  });
});

router.get('/getrated',ensureAuthenticated,function(req,res) {
  console.log("get reated "+req.user.username);
  Player.findOne({username: req.user.username},function(err,player) {
    if (err) {}
    else if(player){
      if(player.requestVerify){ res.json({error:"Already applied for Verification!"});}
      else{
        player.requestVerify = true;
        res.json({msg:"Verification request sent!"});
      }
      player.save();
    }  
  }); 
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else{
    res.json({error:"please login"});
  }
    
}

function createHash(password){
        return md5(password);
}

module.exports = router;