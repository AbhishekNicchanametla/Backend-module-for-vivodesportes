var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Tournament = mongoose.model('Tournament');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET home page. */
router.get('/',ensureAuthenticated,function(req, res, next) {
	if(req.user.role=="admin"){
		res.redirect("/admin/admin.html");
	}
	else{
		res.redirect("/admin/login.html");
	}
});

router.post('/login',
  passport.authenticate('adminlogin', { successRedirect: '/admin/admin.html',
                                   failureRedirect: '/admin/login.html',
                                   failureFlash: false })
);

router.post('/tournaments',ensureAuthenticated,function(req,res) {
	console.log(req.body);
	var t1 = new Tournament();
	t1.name=req.body.name;
	t1.location=req.body.location;
	t1.description=req.body.description;
	t1.googlelink=req.body.googlelink;
	t1.format=req.body.format;
	t1.type=req.body.type;
	t1.date=req.body.date;
	t1.closedate=req.body.closedate;
	t1.status = req.body.status;
	var feature = req.body.feature.split('#');
	var rules= req.body.rules.split('#');
	t1.feature = feature;
	t1.rules = rules;
	t1.fid = req.body.fid;
	t1.fix = req.body.fix;
	t1.banner = req.body.banner;

	t1.save(function (err, t1) {
		if (err) return console.error(err);
		console.log("stored successfully");
		res.json(t1);
	});
	// Tournament.find(function(err, players){
	// 	if(err){ return next(err); }
	// 	res.json(players);
	// });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else{
    res.json({error:"please login"});
  }
    
}

module.exports = router;
