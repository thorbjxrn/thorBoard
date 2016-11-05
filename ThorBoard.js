// JavaScript test 2016-10-27

//ThorBoard
//A simple skateboarding game

console.log("ThorBoard v 0.2");

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var refresher = null;
var firstRun = true;

context.font = "30px Arial";

var skaterSprite = new Image();
skaterSprite.src = 'resources/skaterSprite.png';
var skaterSpriteNr = 0; // standing

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
var spaceKeyIsDown = false;

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
  displayText("loading...");

  document.addEventListener("keydown",keyDownHandler, false);
  document.addEventListener("keyup",keyUpHandler, false);

  var welcome = "hello world. press space to play or something";

  skaterSprite.onload = function(){
    resetGame(welcome);
  }
  // end key handling

} //end of main

function displayText(t0, t1) { //possible to write to two lines!
  console.log("displayText: " + t0 + ", " + t1);


  if(t1 != null){
    context.strokeText(t0, 10, 30);
    context.strokeText(t1, 10, 60);
  }
  else{
    context.strokeText(t0, 10, 50);
  }

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
  if(gameStarted){
    drawFrame();
    if(currentTrick != null){
      displayText((currentTrick + "!"), ("+" + howManyPoints(currentTrick) + " points!"));
    }
    else{
      displayText("Score: " + score, "jmp: " + jumpHeightTotal);
    }
  }
}

var currentTrick = null; // Holds information about current trick;

function drawFrame(){
    clearFrame();
    context.moveTo(0,240);
    context.stroke();
    //Draw anything else...
    currentTrick = trick(currentTrick);

    drawSkater(skaterSpriteNr);
}

function clearFrame(){
  context.clearRect(0,0,canvas.width,canvas.height);
}


function drawSkater(integer){

  context.drawImage(skaterSprite, (integer*150), 0, 150, 150, skaterPos[0], skaterPos[1], 150, 150);

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
  score = score - howManyPoints(currentTrick);
  var message = ("You died... You got " + score + " points!");

  resetGame(message);
}

function resetGame(string){
    gameStarted = false;

    clearFrame();
    clearInterval(refresher);
    console.log("clearInterval");

    //Default values
    currentTrick = null;
    skaterPos = skaterPosDefault;
    skaterInAir = false;
    jumpHeightTotal = jumpHeight;
    jumpTimer = 0;
    trickTimer = 0;

    displayText(string);

    onkeypress = function(){
      if (gameStarted == false){
        score = 0;
        refresher = setInterval("gameLogic()", 1000/60); //60 Frames per second
        gameStarted = true;
      }
    }

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
    else if (keyPressed == 32)
    {
        spaceKeyIsDown = true;
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
  if (keyPressed == 32)
  {
      spaceKeyIsDown = false;
      console.log("spaceKeyIsDown");
  }
}
}
