


// Host and client btns
$('#rooms > button').on('click touchstart', function () {
  // setting "host"/ "client" based on button pressed
  var player = $(this).attr('id');
  game.hostClient = player;
  $('#rooms').hide()
  $('#roomsInput').show();
  $('#roomName').show()
  $('#back').show();
})


$('#back').on('click', function() {
  $('#rooms').show()
  $('#roomsInput').hide();
  $('#roomName').hide()
  $('#back').hide();
});

// Submit button
$('#roomsInput > button').on('click touchstart', function () {
  var value = $(`#roomName`).val();
  var userName = $('#playerName').val();
  game[game.hostClient].name = userName;
  
  if (game.hostClient == 'host') {
    // client or host? 
    // setting the user name
    socket.emit('hostRoom', {
      name: value,
      userName: userName
    })
  } else if (game.hostClient == 'client') {
    socket.emit('joinRoom', {
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


function canvasListeners() {
  $('canvas').on('mousedown touchstart', function () {
    // If the mouse click was within the circle, make the circle moveable
    if(dist(mouseX, mouseY, game.ball.x, game.ball.y) <= game.ball.radius){
      game.ball.moveable = true
    }
  
  })
  
  $('canvas').on('mouseup touchend', function () {
    game.ball.moveable = false;
    return false;
  })

}
