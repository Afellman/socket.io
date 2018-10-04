var sockets = {
  // Socket emitters
  score : function(){
    socket.emit('score', {
      score: 1, 
      room: game.room, 
      player: game.hostClient
    });
  },

  gameOver : function(){
    socket.emit('gameOver', {
      room: game.room, 
      player: game.hostClient
    }) 
    
  },

  winRound: function(){
    socket.emit('winRound', {
      room: game.room, 
      player: game.hostClient, 
      userName: game[game.hostClient].name
    })
    
  },

  hostRoom : function(value, userName){
    socket.emit('hostRoom', {
      name: value,
      userName: userName
    })
  },

  joinRoom: function(value, userName){
    socket.emit('joinRoom', {
      name: value,
      userName: userName
    })
  }
}


// Socket listeners
socket.on('gameOver', game.gameOver)
socket.on('winRound', game.winRound);
socket.on('hostRoom', hostRoom)
socket.on('joinRoom', joinRoom)
socket.on('score', score)

// Universal calls