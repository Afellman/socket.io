// Socket.io function
var socket = io();

//=================== Config =====================

var pointsToWin = 5;
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
  hostJoin : '',
  host : '',
  client : '',
  room: '',
  gameRound : 1,

  colors : {
    'player1' : '#FFD166',
    'player2' : '#EF476F'
  },

  ball : {  
    x : wG / 2,
    y :  hG - ((wG / _size) / 2 ),
    size : wG / _size,
    color : '',
    moveable: false
  },

  hole: {
    x: wG / 2, 
    y: 100,
    size: wG / _size + 10,
    radius : _size / 2,
    color: '#FFD166',
    stroke: 5,
    move : function() {
      this.x = Math.random() * (wG - this.radius) + this.radius;
      this.y = Math.random() * (hG - this.radius) + this.radius;
    }
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

  win: function(player) {
    noCanvas();
    $('#win').show();
    socket.emit('win', {room: game.room, player: game.hostJoin}) 
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
      $("#joinWarn").show();
      setTimeout(function() {
        $('#joinWarn').hide();
      },1300)
    }
  },

  waiting : function() {
    $('#roomsInput').hide();
    $('#waiting').show();
  },

  score : function() {
    // Meter grows
    this.meter1.w += width / pointsToWin;
    socket.emit('score', {score: 1 , room: this.room, player: this.hostJoin});
    // ** Move Circle **
    this.hole.move(); 
  },

  checkScore: function() {
    if(this.gameRound == 1) {
      if (((this.ball.x >= this.hole.x && this.ball.x <= this.hole.x + handicap) || 
      (this.ball.x <= this.hole.x && this.ball.x >= this.hole.x - handicap)) && 
      ((this.ball.y >= this.hole.y && this.ball.y <= this.hole.y + handicap) || 
      (this.ball.y <= this.hole.y && this.ball.y >= this.hole.y - handicap)))
      {
       this.score()
      }
    } else if(this.gameRound = 2) {
      // 
    }
  },

  

}

