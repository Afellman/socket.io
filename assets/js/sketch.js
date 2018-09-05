/* Colors :
 
 turqoise: #06D6A0
 yellow: #FFD166
 red:  #EF476F


 ideas :
  - Show results of last few games
*/






//=================== p5 =====================


function setup () {

  createCanvas(wG, hG)
  canvasListeners();
}

function draw() {
  if (game.active) {
    background("#073B4C")
    
    // hole
    noFill() 
    strokeWeight(game.hole.stroke)
    stroke(game.hole.color)
    ellipse(game.hole.x, game.hole.y, game.hole.size, game.hole.size);
    
    // meter1
    noStroke()
    fill(game.meter1.color)
    rect(game.meter1.x, game.meter1.y, game.meter1.w, game.meter1.h)
    
    // meter2
    fill(game.meter2.color)
    rect(game.meter2.x, game.meter2.y, game.meter2.w, game.meter2.h);
    
    // Ball
    stroke(255, 255, 255)
    strokeWeight(1)
    fill(game.ball.color);
    ellipse(game.ball.x, game.ball.y, game.ball.size, game.ball.size)
    
    
    // moving the ball with the mouse
    if (game.ball.moveable == true){
      game.ball.x = mouseX;
      game.ball.y = mouseY;
    }
    
    // If the ball is inside the circle
    game.checkScore()
   
    
    // Win Game
    if (game.meter1.w >= width) {
      game.win()
    } 
  }
}
  