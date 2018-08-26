$('canvas').on('mousedown touchstart', function () {
  // If the mouse click was within the circle, make the circle moveable
  if (((mouseX >= game.ball.x && mouseX <= game.ball.x + game.ball.size / 2) ||
      (mouseX <= game.ball.x && mouseX >= game.ball.x - game.ball.size / 2)) &&
    ((mouseY >= game.ball.y && mouseY <= game.ball.y + game.ball.size / 2) ||
      (mouseY <= game.ball.y && mouseY >= game.ball.y - game.ball.size / 2))) {
    game.ball.moveable = true;
  }

})

$('canvas').on('mouseup touchend', function () {
  game.ball.moveable = false;
  return false;
})


// Host and Join btns
$('#rooms > button').on('click touchstart', function () {
  // setting "host"/ "join" based on button pressed
  game.hostJoin = $(this).attr('id');
  $('#rooms').hide()
  $('#roomsInput').show();
  $('#roomName').show()
})

// Submit button
$('#roomsInput > button').on('click touchstart', function () {
  var action = `${game.hostJoin}Room`
  var value = $(`#roomName`).val();
  var userName = $('#playerName').val();
  game.playerName = userName;
  
  if (game.hostJoin == 'host') {
    // Join or host? 
    // setting the user name
    socket.emit(action, {
      name: value,
      userName: userName
    })
  } else if (game.hostJoin == 'join') {
    socket.emit(action, {
      name: value,
      userName: userName
    })
  } else {
    console.log('huh?')
  }
})




// $('.choosePlayer').on('click touchstart', function () {
//   // Only fire if a player isn't chosen
//   if (!game.player) {
//     var id = $(this).attr('id')
//     game.player = id;
//     // hide the buttons
//     $('.choosePlayer').hide();
//     // show waiting gif
//     $('#waiting').show();
//     game.setColor(id)
//     socket.emit('newUser', {
//       player: id
//     });
//   }
// });