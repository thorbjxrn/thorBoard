// JavaScript test 2016-10-27

//ThorBoard
//A simple skateboarding game

console.log("ThorBoard v 0.1");

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var skater = new Image();
skater.src = 'resources/skater.png';

var skaterPosDefault = [50,93];
var skaterPos = skaterPosDefault;
var skaterInAir = false;
var jumpHeight = 15;
var jumpHeightTotal = jumpHeight;
var jumpHeightMax = 100;
var jumpTimer = 0;
var kickflipTime = 10;
var flipTime = 0;

var downKeyIsDown = false;
var upKeyIsDown = false;

context.moveTo(0,240);
context.lineTo(720,240);
context.stroke();

var score = 0
var gameStarted = false;

// execute main function now
main();

//Functions:

function main(){
  var text = "hello world. press space to play or something";
  displayText(text);

  skater.onload = function(){
    context.drawImage(skater, skaterPos[0], skaterPos[1]);
  }
  //------------
  //Key Handlers
  //------------
  function keyPressHandler(event)
  {
  	var keyPressed = event.keyCode;
    if(gameStarted == true){
    	if (keyPressed == 38)
    	{
            upKeyIsDown = true;
    		    console.log("up");
            if(skaterPos == skaterPosDefault){
              skaterInAir = true;
              console.log("jump!");
            }
    	}
    	else if (keyPressed == 40)
    	{
          console.log("down");
          downKeyIsDown = true;
    	}
    }
  }

function keyUpHandler(event){
  var keyPressed = event.keyCode;
  if(gameStarted == true){
    if (keyPressed == 40){
        downKeyIsDown = false;
    }
    if (keyPressed == 38)
    {
      upKeyIsDown = false;
    }
  }
}


  document.addEventListener("keydown",keyPressHandler, false);
  document.addEventListener("keyup",keyUpHandler, false);

  onkeypress = function(){
    if (gameStarted == false){
      setInterval("drawFrame()", 1000/60); //60 Frames per second
      gameStarted = true;
    }
  }// end key handling

} //end of main

function displayText(text) {
  context.font = "30px Arial";
  context.strokeText(text,10,50);
}

function drawPlayer(){
  if(skaterInAir){
    if(downKeyIsDown && ! upKeyIsDown){

      displayText("Kickflip!");
    }
    jumpTimer++;
    if(jumpTimer < jumpHeightTotal){
      skaterPos[1]--;
    }
    else if (jumpTimer == jumpHeightTotal){
      score++;
      console.log(jumpTimer + " jumpTimer,");
    }
    else if (jumpTimer > jumpHeightTotal && jumpTimer < jumpHeightTotal*2){
      skaterPos[1]++;
    }
    else {
      skaterInAir = false;
      jumpTimer = 0;
    }
  }
  else if(flipTime > 2){

    console.log("DEAD");
  }
  else if(downKeyIsDown && (jumpHeightTotal < jumpHeightMax)){
    jumpHeightTotal++;
  }
  else if(!downKeyIsDown) {
    if(jumpHeightTotal > jumpHeight){
      jumpHeightTotal--;
    }
  }

  context.drawImage(skater, skaterPos[0], skaterPos[1]);

}

function drawFrame(){
    context.clearRect(0,0,canvas.width,canvas.height);
    //Draw anything else...
    displayText(jumpHeightTotal);
    score++;

    context.moveTo(0,240);
    context.lineTo(720,240);
    context.stroke();


    drawPlayer();


}
