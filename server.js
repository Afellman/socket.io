
var express = require('express');
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);

// main object with game data
var game = {
  player1: false,
  player2: false,
  rooms: [],
}



app.use(express.static(__dirname));

require('./backSockets.js')(io, game)




server.listen(8080, function(res) {
  console.log('listening on port');
});
