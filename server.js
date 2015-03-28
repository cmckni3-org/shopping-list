var http  = require('http');
var parse = require('url').parse;
var join  = require('path').join;
var fs    = require('fs');
var root  = __dirname;
var qs    = require('querystring');
var items = [];

var item_id_from_url = function(url) {
  var pathname = require('url').parse(url).pathname;
  return parseInt(pathname.slice(1), 10);
};

var validate_item = function(req, res) {
  item_id = item_id_from_url(req.url);
  if (typeof(item_id) === 'undefined' || item_id === null || isNaN(item_id)) {
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
  req.on('error', function(err) {
    cb(err, null);
  });
  req.on('end', function () {
    return cb(null, data);
  });
}

var server = http.createServer(function (req, res) {
  switch (req.method) {
    case 'GET':
      var header = '<!DOCTYPE html>' +
      '<html lang="en">' +
      '<head>' +
      '<meta charset="UTF-8">' +
         '<title>Shopping List</title>' +
      '</head>' +
      '<body>';
      var list_html = '';
      if (items.length > 0)
      {
        list_html += '<ul>';
        list_html += items.reduce(function (html, item) {
          return html += '<li>' + qs.parse(item).item + '</li>';
        }, '');
        list_html += '</ul>';
      }
      else
      {
        list_html += 'Shopping List is empty';
      }
      var form_html = '<form action="/" method="post">' +
          '<input type="text" name="item" placeholder="Enter an item">' +
          '<button>Add Item</button>' +
       '</form>' +
      '</body>' +
      '</html>';
      res.write(header + list_html + form_html);
      res.end();
      break;
    case 'POST':
      get_data(req, function(err, item) {
        if (err)
        {
          res.end('Internal Server error');
        }
        else
        {
          items.push(item);
          res.end('Item added\n');
        }
      });
      break;
    case 'PUT':
      var item_id = item_id_from_url(req.url);

      if (!validate_item(req, res))
        return;
      else {
        get_data(req, function(err, item) {
          if (err)
          {
            res.end('Internal Server error');
          }
          else
          {
            items[item_id] = 'item=' + item;
            res.end('Item updated\n');
          }
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
