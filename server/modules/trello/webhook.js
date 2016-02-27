var restify = require('restify');

var server = restify.createServer({
  name: 'trello auth',
  version: '0.0.1'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.head('/', function (req, res, next) {
  res.send(200)
  return next();
});

server.get('/', function(req, res, next) {
    res.send(200)

    console.log(req.params)

    next()
})

server.listen(4044, function () {
  console.log('%s trello at %s', server.name, server.url);
});

