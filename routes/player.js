var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Player = mongoose.model('Player');

router.get('/', function(req, res, next) {
    var seek = parseInt(req.query.seek);
    console.log("seek "+seek);
	Player.find(function(err, players){
		if(err){ return next(err); }
		res.json(players);
	}).skip(seek).limit(9);
});

router.param('profile', function(req, res,next,username) {
	var query  = Player.where({ username: username});
	query.findOne(function (err, player){
		if (err) {next(err)}
		else if (player) {
            req.player = player;
			next();
		}
        else{
            next(new Error('database'));
        }
	}).select({name: 1,age:1,username:1,email:1,_id:0});
});

router.get('/:profile', function(req, res,next) {
    res.json(req.player);
});

router.post('/',function(req,res) {

    var profile = new Player({ name: req.body.name , age:req.body.age, username:req.body.username, password:req.body.password});
    profile.save(function(err) {
    	if(err){
    		res.write("Error in database");
    		res.end();
    		console.log("Error in database: "+err);
    	}
    	else{
    	res.write("saved!! "+req.body.name+" "+req.body.age+" "+req.body.username+" %$");
    	res.end();
    	console.log("account created");
    	}
    });
    
});

module.exports = router;
