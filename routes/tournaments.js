var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Tournament = mongoose.model('Tournament');
var url = require('url');
var fs = require('fs');
router.get('/',function(req,res) {
	Tournament.find(function(err, players){
        if(err){ return next(err); }
        res.json(players);
    }).select({name:1,closedate:1,type:1,location:1,banner:1});
});

router.post('/id',function(req,res) {
	var id = req.body.id;

	Tournament.findOne({_id:id},function(err,t) {
		if(err){ return res.json({error:"Wrong id"})}
		if(t){
			res.json(t);
		}
	});
});


module.exports = router;