// JavaScript test 2016-10-27

//ThorBoard
//A simple skateboarding game

console.log("ThorBoard v 0.2");

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var skater = new Image();
skater.src = 'resources/skater.png';
var flipImage = new Image();
flipImage.src = 'kickflip.png';
//http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/


var obstacles = new Image();
obstacles.src = 'resources/obstacles.png';

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

console.log("canvas is this big: " + canvas.width);

function sprite (options) {

    var that = {};

    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;

    return that;
}
var spawnPoint = canvas.width;


var obstacle0 = sprite({canvas, width: 100, height: 100, image: obstacles});
//help: http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/

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
      setInterval("gameLogic()", 1000/60);
      setInterval("drawFrame()", 1000/60); //60 Frames per second
      gameStarted = true;
    }
  }// end key handling

} //end of main

function displayText(text) {
  context.font = "30px Arial";
  context.strokeText(text,10,50);
}


function gameLogic(){
    if(skaterInAir){
        if(downKeyIsDown && ! upKeyIsDown){

          displayText("Heelflip!");
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

function drawPlayer(){

  context.drawImage(skater, skaterPos[0], skaterPos[1]);
}
