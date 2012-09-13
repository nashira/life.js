var app = require('meryl');
var file = new(require('node-static').Server)('./public');

var GamesController = require('./lib/games_controller.js');

app.get('/css|js', function(req, res){
  res.removeHeader('content-type');
  file.serve(req, res);
});

app.get('/', function(req, res){
  file.serveFile("index.html", 200, {}, req, res);
});
// 
// app.get('/game/{name}', function(req, res){
//   var game = GamesController.get(req.params.name);
//   
//   res.setHeader('content-type', 'text/json');
//   res.end(game.serialized());
// });
// 
// app.post('/game/{name}/add', function(req, res){
//   var game = GamesController.get(req.params.name);
//   var params = JSON.parse(req.postdata);
//   console.time('update')
//   if(!game.get(params.x, params.y).length){
//     var adds = game.add(params.x, params.y, params.data);
//   }
//   console.timeEnd('update')
//   
//   res.setHeader('content-type', 'text/json');
//   res.end(JSON.stringify(adds || []));
// });

var server = require('http').createServer(app.cgi());
var io = require('socket.io').listen(server);

io.configure(function () {
  io.set('transports', ['websocket', 'xhr-polling']);
  io.set('log level', 1);
});

io.sockets.on('connection', function (socket) {
  socket.on('set name', function (name) {
    socket.set('name', name, function () {
      // console.log('name', name)
      var game = GamesController.get(name);
      game.setSocket(socket);
      socket.emit('ready');
    });
  });
});


server.listen(8000);

