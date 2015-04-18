var http  = require('http');
var parse = require('url').parse;
var join  = require('path').join;
var fs    = require('fs');
var root  = __dirname;
var qs    = require('querystring');

// Environment configuration
require('dotenv').load();

var Item = require('./item');

var mongoose = require('mongoose');

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
    cb(null, data);
  });
};

var server = http.createServer(function (req, res) {
  switch (req.method) {
    case 'PUT':
      var item_id = item_id_from_url(req.url);

      if (!validate_item(req, res))
        return;
      else {
        res.setHeader('Content-Type', 'text/plain');
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
        res.setHeader('Content-Type', 'text/plain');
        items.splice(item_id, 1);
        res.end('Item deleted successfully');
      }
      break;
  }
  if (req.url == '/')
  {
    switch (req.method) {
      case 'GET':
        var header = '<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head>' +
        '<meta charset="UTF-8">' +
           '<title>Shopping List</title>' +
           '<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/0.5.0/sweet-alert.css" />' +
           '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>' +
           '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/sweetalert/0.5.0/sweet-alert.min.js"></script>' +
        '</head>' +
        '<body>';
        var list_html = '';
        if (items.length > 0)
        {
          list_html += '<ul>';
          list_html += items.reduce(function (html, item, index) {
            item_html = '<li>' +
            '<span>' + qs.parse(item).item + '</span>' +
            '<button data-edit data-id="' + index + '">Update</button>' +
            '<button data-delete data-id="' + index + '">Delete</button></li>';
            return html += item_html;
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
         '<script type="text/javascript" src="/shopping-list.js"></script>'
        '</body>' +
        '</html>';
        res.setHeader('Content-Type', 'text/html');
        res.write(header + list_html + form_html);
        res.end();
        break;
      case 'POST':
        res.setHeader('Content-Type', 'text/plain');
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
    }
  }
  else if (req.method == 'GET')
  {
    var url = parse(req.url);
    var path = join(root, url.pathname);
    fs.stat(path, function (err, stat) {
      if (err) {
        if (err.code == 'ENOENT') {
          res.statusCode = 404;
          res.end('File Not Found');
        }
        else {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      }
      else {
        var stream = fs.createReadStream(path);
        res.setHeader('Content-Length', stat.size);
        stream.pipe(res);
        stream.on('error', function (err) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        });
      }
    });
  }
});

mongoose.connect(process.env.SHOPPING_LIST_MONGO_URI);

var db = mongoose.connection;
db.on('error', function callback () {
  console.error('connection error');
});
db.once('open', function callback () {
  console.error('connection success');
});

server.listen(9000, function(){
  console.log('listening on 9000');
});
