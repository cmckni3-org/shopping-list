var http  = require('http');
var url   = require('url');
var items = [];

var server = http.createServer(function (req, res) {
  switch (req.method) {
    case 'GET':
      items.forEach(function (item, i) {
        res.write(i + '. ' + item + '\n');
      });
      res.end();
      break;
    case 'POST':
      var item = '';
      req.setEncoding('utf8');
      req.on('data', function (chunk) {
        item += chunk;
      });
      req.on('end', function () {
        items.push(item);
        res.end('Item added\n');
      });
      break;
  }
});

server.listen(9000, function(){
  console.log('listening on 9000');
});
