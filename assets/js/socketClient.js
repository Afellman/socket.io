socket.on('players', function(players) {
  if(!players.player1) {
    $('#player1').show();
  }
  if (!players.player2){
    $('#player2').show();
  }
})


socket.on('score',function(user){
  if(user !== game.hostClient) {
    game.score(user, game.round)
  }
})

// after a user chooses a player, hide that player button.

socket.on('gameStart', function(){
  game.start()
})


socket.on('winGame', function(data){
  noCanvas();
  if(data.player !== game.hostClient) {
    $('#loose').show();
  }
})

socket.on('winRound', function(player) {
  // resetting the meter back to 0
  game.changeRound()
  game.increaseScore(player)
  // show graphic that round was won?

})

socket.on('hostRoom', function(data){
  console.log('hostGame', data);
  if (data.newRoom == true) {
    console.log(data.name, "data.name")
    $('#back').hide();
    game.room = data.room
    game.waiting();
  } else if (data.newRoom == false) {
    game.showWarn('host');
  }
});


socket.on('joinGame', function(data) {
  console.log('joinGame', data)
  if (data.joined){
    console.log(data.room, "data.name")
    $('#back').hide();
    $('#hostScore').text(data.room.host + " : 0");
    $('#clientScore').text(data.room.client + " : 0");
      game.room = data.room.roomName;
      game.start();
  } else {
      game.showWarn('client');
  }
 
})