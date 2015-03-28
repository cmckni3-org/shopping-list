var http  = require('http');
var items = [];

var item_id_from_url = function(url) {
  var pathname = require('url').parse(url).pathname;
  return parseInt(pathname.slice(1), 10);
};

var validate_item = function(req, res) {
  item_id = item_id_from_url(req.url);
  if (isNaN(item_id)) {
    res.statusCode = 400;
    res.end('Item id not valid');
    return false;
  }
  else if (!items[item_id]) {
    res.statusCode = 404;
    res.end('Item not found');
    return false;
  }
  return true;
};

var get_data = function(req, cb)
{
  var data = '';
  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    data += chunk;
  });
  req.on('end', function () {
    return cb(null, data);
  });
}

var server = http.createServer(function (req, res) {
  switch (req.method) {
    case 'GET':
      items.forEach(function (item, i) {
        res.write(i + '. ' + item + '\n');
      });
      res.end();
      break;
    case 'POST':
      get_data(req, function(err, item) {
        items.push(item);
        res.end('Item added\n');
      });
      break;
    case 'PUT':
      var item_id = item_id_from_url(req.url);

      if (!validate_item(req, res))
        return;
      else {
        get_data(req, function(err, item) {
          items[item_id] = item;
          res.end('Item updated\n');
        });
      }
      break;
    case 'DELETE':
      var item_id = item_id_from_url(req.url);

      if (!validate_item(req, res))
        return;
      else {
        items.splice(item_id, 1);
        res.end('Item deleted successfully');
      }
      break;
  }
});

server.listen(9000, function(){
  console.log('listening on 9000');
});
