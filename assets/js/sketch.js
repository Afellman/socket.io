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
    switch(game.round) {
      case 1:
        noFill() 
        strokeWeight(obstacles[0].stroke)
        stroke(obstacles[0].color)
        ellipse(obstacles[0].x, obstacles[0].y, obstacles[0].size, obstacles[0].size);
        break;
      case 2:
        strokeWeight(obstacles[1].stroke)
        line(obstacles[1].line1_x1, obstacles[1].line1_y, obstacles[1].line1_x2, obstacles[1].line1_y)
        line(obstacles[1].line2_x1,obstacles[1].line2_y, obstacles[1].line2_x2, obstacles[1].line2_y)
        obstacles[1].move()
        break;
      case 3 :
        break;
      case 4 :
        break;
    }
    if(game.round == "1"){
      
    } 
    
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
    fill(ball.color);
    ellipse(ball.x, ball.y, ball.size, ball.size)
    
    
    // moving the ball with the mouse
    if (ball.moveable == true){
      ball.x = mouseX;
      ball.y = mouseY;
    }
    
    // If the ball is inside the circle
    checkScore()
    
    // Win Game
   
    if (game.meter1.w >= width) {
      sockets.winRound();
    } 
    
    // When is the game over??
    // game.gameOver()
  }
}
  



