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
        strokeWeight(game.obstacles[1].stroke)
        stroke(game.obstacles[1].color)
        ellipse(game.obstacles[1].x, game.obstacles[1].y, game.obstacles[1].size, game.obstacles[1].size);
        break;
      case 2:
        console.log('line')
        strokeWeight(game.obstacles[2].stroke)
        line(game.obstacles[2].line1_x, game.obstacles[2].line1_y1, game.obstacles[2].line1_x, game.obstacles[2].line1_y2)
        line(game.obstacles[2].line2_x,game.obstacles[2].line2_y1, game.obstacles[2].line2_x, game.obstacles[2].line2_y2)
        game.obstacles[2].move()
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
    fill(game.ball.color);
    ellipse(game.ball.x, game.ball.y, game.ball.size, game.ball.size)
    
    
    // moving the ball with the mouse
    if (game.ball.moveable == true){
      game.ball.x = mouseX;
      game.ball.y = mouseY;
    }
    
    // If the ball is inside the circle
    game.checkScore[game.round]()
    
    
    // Win Game
   
    if (game.meter1.w >= width) {
      game.winRound()
    } 
    
    // When is the game over??
    // game.winGame()
  }
}
  



