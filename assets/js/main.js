// Socket.io function
var socket = io();

//=================== Config =====================

var pointsToWin = 2;
var _size = 5;
var hG = $(window).height();
var wG = $(window).width();
// 1 - 10 (hard - easy)
var handicap = 5;

// =======================================


handicap = ((hG + wG) / 1500) * handicap 
// Android workaround
if(navigator.userAgent.match(/Andoird/i)){
  window.scrollTo(0,1);
}

var game = {
  
  gameOver: false,
  winner : '',
  playerColor : '',
  active : false,
  roundMultiplier : [1, 10, 1],
  room: '',
  round : 1,
  hostScore: 0,
  clientScore: 0,
  hostClient : '',
  host : {
    name: '',
    score : 0
  },
  client : {
    name: '',
    score: 0
  },
  colors : {
    'player1' : '#FFD166',
    'player2' : '#EF476F'
  },

  meter1: {
    x: 0,
    y: 0,
    w: 0,
    h: 30,
    color: "#FFD166"
  },

   meter2: {
    x: 0,
    y: 30,
    w: 0,
    h: 30,
    color: "#EF476F"
  },

  start : function(data) {
    var host = data.room.host;
    var client = data.room.client;
    game.active = true;
    game.host.name = host;
    game.client.name = client;
    $('#hostScore').text(host + " : " + game.host.score);
    $('#clientScore').text(client + " : " +  game.client.score);
    $('#waiting').hide();
    $('#roomsInput').hide();
    loop();
  },

  gameOver: function(player) {
    noCanvas();
    noLoop();
    var winner = getWinner();
    if(winner !== game.hostClient) {
      $('#lose').show();
    } else {
      $('#win').show();
    }
  },

  winRound: function(data) {
    // Ten rounds to win? 
    // ** Score is not increasing on second round **
      game.meter1.w = 0;
      game.meter2.w = 0;
      changeRound()
      increaseScore(data.player, data.userName)
    if(game.round == 10) {
      sockets.gameOver()
    }
  },

  showWarn: function(which) {
    if(which == 'host') {
      $("#hostWarn").show();
      setTimeout(function() {
        $('#hostWarn').hide();
      },1300)
    } else {
      $("#clientWarn").show();
      setTimeout(function() {
        $('#clientWarn').hide();
      },1300)
    }
  },

  waiting : function() {
    $('#roomsInput').hide();
    $('#waiting').show();
  },
}


var ball = {  
  x : wG / 2,
  y :  hG -  ((wG / _size) /2 ),
  size : wG / _size,
  radius : (wG / _size) / 2,
  color : '',
  moveable: false
}



var obstacles = [
  // hole obstacle that moves to new space after each score.`
  {
    x: wG / 2, 
    y: 100,
    size: wG / _size + 10,
    radius : _size / 2,
    color: '#FFD166',
    stroke: 5,
    move : function() {
      this.x = Math.random() * (wG - this.radius) + this.radius;
      this.y = Math.random() * (hG - this.radius) + this.radius;
    },
  },
  // two lines obstacle that moves "randomly" each frame. 
  {
    line1_x1: 0,
    line1_y : hG / 2,
    line1_x2: wG, 
    line2_x1: 0,
    line2_y : (hG / 2) + (hG / _size) + 80,
    line2_x2 : wG,
    moveCount: 0,
    rand: 0,
    stroke: 3,
    move  : function () {
      var rand;
      // lets the lines move in the same direction 5 times so its not so jitty
      if(this.moveCount < 10){
        rand = this.rand
      } else {
        rand = Math.floor(Math.random() * 2)
      }

      if(this.line1_y <= 0) {
        rand = 0
        this.moveCount = 0
      } else if (this.line2_y >= hG){
        rand = 1
        this.moveCount = 0
      }

     // move right if rand is 0 and left if rand is 1
      if (rand == 0) {
        this.line1_y+= 5;
        this.line2_y+= 5;
      } else {
        this.line1_y-= 5;
        this.line2_y-= 5;
      }
      this.rand = rand;
      this.moveCount+=1
      // resetting the move back to 0.
      if(this.moveCount >10) {
        this.moveCount = 0
      }
    } 
  },
  {
    x: wG / 2, 
    y: 100,
    size: wG / _size + 10,
    radius : _size / 2,
    color: '#FFD166',
    stroke: 5,
    grow : false,
    move : function() {
      this.x = Math.random() * (wG - this.radius) + this.radius;
      this.y = Math.random() * (hG - this.radius) + this.radius;
    },
    growShrink : function(){
      if(this.grow) {
        this.size += 2;
      } else {
        this.size -= 2;
      }
      if(this.size < 2){
        this.grow = true;
        obstacles[2].move();
      }
      if(this.size > wG / _size + 20){
        this.grow = false;
      }
    }
  },
    
]

function joinRoom(data){
  if (data.joined){
    $('#back').hide();
      game.room = data.room.roomName;
      game.start(data);
  } else {
    game.showWarn('client');
  }
}


function hostRoom (data){
  if (data.newRoom == true) {
    $('#back').hide();
    game.room = data.room
    game.waiting();
  } else if (data.newRoom == false) {
    game.showWarn('host');
  }
}

function score(user) {
  // move the hole
  // grow score meters based on the round muliplier
  if(user == game.hostClient){
    game.round == 1 ? obstacles[0].move() : null;
    game.round == 3 ? obstacles[2].move() : null;
    game.meter1.w += width / (pointsToWin * game.roundMultiplier[game.round - 1]);
  } else {
    game.meter2.w += width / (pointsToWin * game.roundMultiplier[game.round - 1]);
  }
}
  
function changeRound() {
  game.meter1.w = 0;
  game.meter2.w = 0;
  // increasing the game round
  game.round++
}


function increaseScore(player, userName) {
  game[player].score ++;
  var score = game[player].score
  var scoreString = `${userName} : ${score}`;
  if(player === game.hostClient){
    $(`#${player}Score`).text(scoreString)
  }
}



function checkScore(){
  if(game.round == 1){
    var ballX = ball.x;
    var ballY = ball.y;
    var holeX = obstacles[0].x;
    var holeY = obstacles[0].y;
    // if the ball is in the hole.
    if (((ballX >= holeX && ballX <= holeX + handicap) || 
        (ballX <= holeX && ball.x >= holeX - handicap)) && 
        ((ballY >= holeY && ballY <= holeY + handicap) || 
        (ballY <= holeY && ballY >= holeY - handicap))){
        sockets.score()
    }
  } else if(game.round == 2){
    var ballY = ball.y;
    var rad = ball.radius
    var line1Y = obstacles[1].line1_y;
    var line2Y = obstacles[1].line2_y;
    if(ballY + rad < line2Y && ballY -rad > line1Y){
      sockets.score()
    } else {

    }
  } else if (game.round == 3){
    var ballX = ball.x;
    var ballY = ball.y;
    var holeX = obstacles[2].x;
    var holeY = obstacles[2].y;
    // if the ball is in the hole.
    if (((ballX >= holeX && ballX <= holeX + (handicap + 5)) || 
        (ballX <= holeX && ball.x >= holeX - (handicap + 5))) && 
        ((ballY >= holeY && ballY <= holeY + (handicap + 5)) || 
        (ballY <= holeY && ballY >= holeY - (handicap + 5))) && obstacles[2].size > wG / _size + 10){
        sockets.score()
    }
  }
}

function getWinner(){
  if(game.client.score > game.host.score){
    return "client"
  } else {
    return "host"
  }
}