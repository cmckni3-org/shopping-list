var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
  name: String,
});

module.exports = mongoose.model('Item', itemSchema);
