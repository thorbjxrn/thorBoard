// JavaScript test 2016-10-27

//ThorBoard
//A simple skateboarding game

console.log("ThorBoard v 0.2");

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var refresher = null;
var firstRun = true;

var skater = new Image();
skater.src = 'resources/skater.png';

var skaterSprite = new Image();
skaterSprite.src = 'resources/skaterSprite.png';

var obstacles = new Image();
obstacles.src = 'resources/obstacles.png';

var skaterPosDefault = [50,93];
var skaterPos = skaterPosDefault;
var skaterInAir = false;
var jumpHeight = 15;
var jumpHeightTotal = jumpHeight;
var jumpHeightMax = 100;
var jumpTimer = 0;
var trickTimerHeelflip = 60;
var trickTimer = 0;

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
  skater.onload = function(){
    context.drawImage(skater, skaterPos[0], skaterPos[1]);
  }
  var welcome = "hello world. press space to play or something";
  resetGame(welcome);
  // end key handling

} //end of main

function displayText(text) {
  context.font = "30px Arial";
  context.strokeText(text,10,50);
}

function gameLogic(){
  if(skaterInAir){
    jumpTimer++;
    if(jumpTimer < jumpHeightTotal){
      skaterPos[1]--;
    }
    else if (jumpTimer == jumpHeightTotal){
      //This is the top of the jump if you would like do something here
    }
    else if (jumpTimer > jumpHeightTotal && jumpTimer < jumpHeightTotal*2){
      skaterPos[1]++;
    }
    else {
      skaterInAir = false;
      jumpTimer = 0;
    }
  }
  else if(trickTimer > 0){
    dead();
  }
  else if(downKeyIsDown && (jumpHeightTotal < jumpHeightMax)){
    jumpHeightTotal++;
  }

  else if (upKeyIsDown) {
    if (skaterPos == skaterPosDefault){
      skaterInAir = true;
    }
  }
  else if(!downKeyIsDown) {
    if(jumpHeightTotal > (jumpHeight)){
      jumpHeightTotal--;
    }
  }
  drawFrame();
}

var currentTrick = null; // Holds information about current trick;

function drawFrame(){
    context.clearRect(0,0,canvas.width,canvas.height);
    context.moveTo(0,240);
    context.stroke();
    //Draw anything else...
    currentTrick = trick(currentTrick);
    if(currentTrick != null){
      displayText(currentTrick + "! + " + howManyPoints(currentTrick));
    }
    else{displayText(jumpHeightTotal)}
    drawPlayer();
}

function drawPlayer(){
  context.drawImage(skater, skaterPos[0], skaterPos[1]);
}

function trick(ct){
  if(ct == null){
    if(downKeyIsDown && skaterInAir && !upKeyIsDown){
      ct = "heelflip";
      trickTimer = trickTimerHeelflip;
      score += 13;
    }
  }
  else if(trickTimer > 0){
    trickTimer--;
  }
  else{
    ct = null;
  }
  return ct;
}

function howManyPoints(ct){
  if(ct == "heelflip"){
    return 13;
  }
  else {
    return 0;
  }

}

// DEATH AND DESTRUCTION

function dead(){
  var message = ("You died.. " + score +" points! \nTry again?");
  resetGame(message);
  console.log("DEAD!");
}

function resetGame(string){
    gameStarted = false;
    clearInterval(refresher);
    score = score - howManyPoints(currentTrick);
    currentTrick = null;
    displayText(string);
    console.log("Game over. " + score + " points!");

    //Default values
    skaterPos = skaterPosDefault;
    skaterInAir = false;
    jumpHeightTotal = jumpHeight;
    jumpTimer = 0;
    trickTimer = 0;
    //waiting skaterPos
    skater.src = 'resources/skaterSprite.png';

}

//------------
//Key Handlers
//------------
function keyDownHandler(event)
{
  var keyPressed = event.keyCode;
  if(gameStarted == true){
    if (keyPressed == 38)
    {
          upKeyIsDown = true;
    }
    else if (keyPressed == 40)
    {
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


document.addEventListener("keydown",keyDownHandler, false);
document.addEventListener("keyup",keyUpHandler, false);

onkeypress = function(){
  if (gameStarted == false){
    score = 0
    refresher = setInterval("gameLogic()", 1000/60); //60 Frames per second
    gameStarted = true;
    skater.src = 'resources/skater.png';
  }
}
