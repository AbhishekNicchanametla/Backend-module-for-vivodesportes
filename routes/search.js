var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Player = mongoose.model('Player');

router.get('/', function(req, res) {
    var search = req.query.name;
    
    Player.find({f_name: new RegExp('^'+search,"i")},function(err, players){
        if(err){ return ; }
        res.json(players);
    });
    
});

module.exports = router;
