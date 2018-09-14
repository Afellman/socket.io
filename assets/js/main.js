// Socket.io function
var socket = io();

//=================== Config =====================

var pointsToWin = 2;
var _size = 5
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
  hostClient : '',
  host : {
    name: '',
    score : 0
  },
  client : {
    name: '',
    score: 0
  },
  room: '',
  round : 1,
  hostScore: 0,
  clientScore: 0,

  colors : {
    'player1' : '#FFD166',
    'player2' : '#EF476F'
  },

  ball : {  
    x : wG / 2,
    y :  hG -  ((wG / _size) /2 ),
    size : wG / _size,
    radius : (wG / _size) / 2,
    color : '',
    moveable: false
  },

  obstacles: {
    // hole obstacle that moves to new space after each score.
    "1": {
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
    "2" : {
      line1_x: wG /2,
      line1_y1 : 0,
      line1_y2 : hG,
      line2_x: (wG / 2) + (wG / _size) + 80,
      line2_y1 : 0,
      line2_y2 : hG,
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

        if(this.line1_x <= 0) {
          rand = 0
          this.moveCount = 0
        } else if (this.line2_x >= wG){
          rand = 1
          this.moveCount = 0
        }

       // move right it rand is 0 and left if rand is 1
        if (rand == 0) {
          this.line1_x+= 5;
          this.line2_x+= 5;
        } else {
          this.line1_x-= 5;
          this.line2_x-= 5;
        }
        this.rand = rand;
        this.moveCount+=1
        // resetting the move back to 0.
        if(this.moveCount >10) {
          this.moveCount = 0
        }
      } 
    },
    
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

  start : function() {
    this.active = true;
    $('#waiting').hide();
    $('#roomsInput').hide();
    loop();
  },

  winGame: function(player) {
    noCanvas();
    $('#win').show();
    socket.emit('winGame', {room: game.room, player: game.hostClient}) 
  },

  winRound: function() {
    // Ten rounds to win? 
    if(game.round == 10) {
      game.winGame()
    } else {
      game.meter1.w = 0;
      game.meter2.w = 0;
      socket.emit('winRound', {room: game.room, player: game.hostClient})

    }

  },
  // Setting the player colors
  setColor : function(player) {
    var color = this.colors[player]
    this.playerColor = color
    this.ball.color = color
    if (color == this.colors.player1) {
      this.meter1.color = color
      this.meter2.color = this.colors.player2
    } else {
      this.meter1.color = this.colors.player2
      this.meter2.color = this.colors.player1
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

  score : function(user, round) {
    
    if (round == 1){
      if(user == game.hostClient) {
        game.meter1.w += width / pointsToWin;
        socket.emit('score', {score: 1 , room: game.room, player: game.hostClient});
        game.obstacles[1].move(); 
      } else {
        game.meter2.w += width/pointsToWin;
      }
      
    } else if (round == 2){
      
      if(user == game.hostClient) {
        console.log(width / (pointsToWin * 100), 'meter')
        game.meter1.w += width / (pointsToWin * 100);
        socket.emit('score', {score: 1 , room: game.room, player: game.hostClient});
      } else {
        game.meter2.w += width / (pointsToWin * 100);
      }
    } else if (round == 3){

    }

    
    // Meter grows
    // ** Move Circle **
    
    
  },

  checkScore: {
    1: function() {
      var ballX = game.ball.x;
      var ballY = game.ball.y;
      var holeX = game.obstacles[1].x;
      var holeY = game.obstacles[1].y;
      // if the ball is in the hole.
        if (((ballX >= holeX && ballX <= holeX + handicap) || 
            (ballX <= holeX && game.ball.x >= holeX - handicap)) && 
            ((ballY >= holeY && ballY <= holeY + handicap) || 
            (ballY <= holeY && ballY >= holeY - handicap))){
          game.score(game.hostClient, 1)
        }
    },
    2 : function() {
      var ballX = game.ball.x;
      var rad = game.ball.radius
      var line1X = game.obstacles[2].line1_x;
      var line2X = game.obstacles[2].line2_x;
    
      if(ballX + rad < line2X && ballX -rad > line1X){
        game.score(game.hostClient, 2)
      } else {

      }
    }
  },
  
  changeRound : function() {
    game.meter1.w = 0;
    game.meter2.w = 0;
    // increasing the game round
    game.round++
  },

  increaseScore : function(player) {
    var score = game[player].score
    var scoreString = `${player} : ${score+ 1}`;
    if(player === game.hostClient){
      $(`#${player}Score`).text(scoreString)
    }
  }
  
}




