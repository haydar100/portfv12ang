var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema   = new Schema({
    base64: String,
    description: String,

});

module.exports = mongoose.model('Image', ImageSchema);
