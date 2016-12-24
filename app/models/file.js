var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
FileSchema for fileUploads, TODO: only support imageFiles
**/

var FileSchema   = new Schema({
  fieldname: String,
  originalname: String,
  encoding: String,
  mimeptype: String,
  destination: String,
  filename: String,
  path: String,
  size: Number,
  created_at: Date,
  updated_at: Date

});

module.exports = mongoose.model('File', FileSchema);
