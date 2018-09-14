var utils = require('./utils.js');


module.exports = function (io, game) {

  io.on('connection', function (socket) {
    console.log('connected')

    io.emit('players', game)

    // When a users chooses a player
    socket.on('newUser', function (player) {
      
      io.to(game.room).emit('newUser', {
        player: player.player
      })

    })

    // ** DOESN'T WORK ?? ** 
    // socket.on('disconnet', function () {
      // // ** if host, delete room **
    //   game[socket.player] = false;
    //   console.log(socket.player, 'disconnected');
    //   socket.player = ''
    // })

    socket.on('score', function (data) {
      io.to(data.room).emit('score', data.player)
    })


    socket.on('winGame', function (data) {
      io.to(data.room).emit('winGame', data.player);
      console.log(game.rooms, 'before')
      utils.deleteRoom(game.rooms, data.room);
      console.log(game.rooms, 'after')
    })


    socket.on('winRound', function(data) {
      io.to(data.room).emit('winRound', data.player)
    })

    socket.on('hostRoom', function (data) {
      var newRoom = false
      var roomName = data.name
      var userName = data.userName
      var roomCheck = utils.roomCheck(game.rooms, roomName)
      // Checking if a room with that name exists already
      if (roomCheck) {
        // Joing the room
        console.log('"' + userName + '" created "' + roomName + '"')
        socket.join(roomName)
        // adding that room name to a local storage of room names
        game.rooms.push({roomName : roomName, host : userName})
        newRoom = true;
      }
      socket.emit('hostRoom', {
        newRoom : newRoom,
        room : roomName
      })
    })


    socket.on('joinRoom', function (data) {
      var roomName = data.name;
      var roomCheck = utils.roomCheck(game.rooms, roomName);
      var joinGame = utils.joinGame(game.rooms, roomName, data.userName);
      // If the room exists.
      if(!roomCheck && joinGame.bool) {
        // join the room
        socket.join(roomName);
        console.log('"' + data.userName + '" join "' + roomName + '"')
        // emit to the room (player and host) that the user joined successfully
        io.to(roomName).emit('joinGame', {joined : true, room: game.rooms[joinGame.index] });
      } else {
        // If the game does not exist, emit to the user that the join was 
        // unsuccessfully
        socket.emit('joinGame', {joined : false}); 
      }
      
    })

  });
}







