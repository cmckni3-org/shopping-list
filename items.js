var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
    name: String
});

var Item = mongoose.model('Item', itemSchema);
