var mongoose = require('mongoose');

var PlayerSchema = new mongoose.Schema({
  username : { type: String, required: true, unique: true },
  email    : { type: String, required: true, unique: true },
  password : { type: String, required: true },
  f_name: String,
  l_name: String,
  bdate: Date,
  contact: Number,
  fav_footballer: String,
  fav_club: String,
  pre_foot: String,
  requestVerify: Boolean,
  verifyhash: String,
  verifypassword:String,
  active: Number,
  rating: Number,
  skills : mongoose.Schema.Types.Mixed
});

mongoose.model('Player', PlayerSchema);