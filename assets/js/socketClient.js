socket.on('players', function(players) {
  if(!players.player1) {
    $('#player1').show();
  }
  if (!players.player2){
    $('#player2').show();
  }
})


socket.on('score',function(data){
  if(data != game.hostJoin) {
    game.meter2.w += width/pointsToWin;
  }
})

// after a user chooses a player, hide that player button.

socket.on('gameStart', function(){
  game.start()
})


socket.on('win', function(data){
  noCanvas();
  if(data.player !== game.hostJoin) {
    $('#loose').show();
  }
})


socket.on('hostRoom', function(data){
  console.log('hostGame', data);
  if (data.newRoom == true) {
    console.log(data.name, "data.name")
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
      game.room = data.room;
      game.start();
  } else {
      game.showWarn('join');
  }
 
})