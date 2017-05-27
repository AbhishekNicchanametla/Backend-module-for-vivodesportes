var mongoose = require('mongoose');

var TournamentSchema = new mongoose.Schema({
  name: String,
  location: String,
  googlelink: String,
  description: String,
  type: String,
  date: Date,
  closedate:Date,
  type:String,
  status: String,
  feature : mongoose.Schema.Types.Mixed,
  rules : mongoose.Schema.Types.Mixed,
  fid: String,
  fix: String,
  banner: String
});

mongoose.model('Tournament', TournamentSchema);