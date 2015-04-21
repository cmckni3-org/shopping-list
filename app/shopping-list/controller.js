var Item = require('./item');

var mongoose = require('mongoose');

exports.list = function(req, res){
  Item.find(function(err, items){
    if (err)
    {
      return console.error(err);
    }
    res.render('index', {items: items});
  });
};

exports.retrieveAll = function(req, res){
  Item.find(function (err, items) {
    if (err)
    {
      return console.error(err);
    }
    res.send(items);
  });
};

exports.retrieveOne = function(req, res){
  Item.find({'_id':mongoose.Types.ObjectId(req.params.id)}, function (err, item){
    if (err)
    {
      return console.error(err);
    }
    res.send(item);
  });
};

exports.show = function(req, res, next){
  Item.findById({'_id':mongoose.Types.ObjectId(req.params.id)}, function(err, item){
    if (err)
    {
      return console.error(err);
    }
    res.render('show', item);
  });
};

exports.new = function(req, res){
  res.render('new');
};

exports.create = function (req, res){
  if (!req.body.name) {
    res.send('Item not valid');
    res.statusCode = 400;
    return;
  }
  var item = new Item({ name: req.body.name });
  item.save(function (err, item) {
    if (err)
    {
      return console.error(err);
    }
    res.redirect('/');
  });
};

exports.edit = function(req, res){
  Item.findOne(req.params.id, function(err, item){
    if (err)
    {
      return console.error(err);
    }
    res.render('edit', item);
  });
};

exports.update = function(req, res, next){
  var id = req.params.id;
  Item.findByIdAndUpdate(mongoose.Types.ObjectId(id), { name: req.body.name }, function(err, result){
    if (err)
    {
      return console.error(err);
    }
    res.redirect('/' + id);
  });
};

exports.delete = function (req, res) {
  Item.remove({ '_id': mongoose.Types.ObjectId(req.params.id) }, function (err, result) {
    if (err)
    {
      return console.error(err);
    }
    res.send({});
  });
};
