// JavaScript test 2016-10-27

//ThorBoard
//A simple skateboarding game

console.log("ThorBoard v 0.3");

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var refresher = null;
var firstRun = true;

var framerate = 1000/60;

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
var jumpHeightMax = 115;
var jumpTimer = 0;
var jumpSpeed = 5;

var currentTrick = null; // Holds information about current trick;
var trickTimerHeelflip = framerate*2.5;
var trickTimerKickflip = framerate*2;
var trickTimer = 0;

function setDefaults(){
  currentTrick = null;
  skaterPos = skaterPosDefault;
  skaterInAir = false;
  jumpHeightTotal = jumpHeight;
  jumpTimer = 0;
  trickTimer = 0;
}

var downKeyIsDown = false;
var upKeyIsDown = false;
var rightKeyIsDown = false;
var leftKeyIsDown = false;
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
  //console.log("displayText: " + t0 + ", " + t1);
  if(t1 != null){
    context.strokeText(t0, 10, 30);
    context.strokeText(t1, 10, 60);
  }
  else{
    context.strokeText(t0, 10, 50);
  }

}

function skaterSpriteLogic(spriteNr, time){ //Holds a wanted sprite change a bit, to animate
  setTimeout(function(){skaterSpriteNr = spriteNr}, framerate*time);
}

function gameLogic(){

  //todo: better jumping speed
  if(skaterInAir){
    currentTrick = trick(currentTrick); // check if a trick is beeing executed

    jumpTimer+=2;

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
    skaterSpriteLogic(7);
  }
  else if (upKeyIsDown) {
    if (!skaterInAir){
      skaterInAir = true;
      skaterSpriteLogic(1);
      skaterSpriteLogic(4,10);
    }
  }
  else if(!downKeyIsDown) {
    if(jumpHeightTotal > (jumpHeight)){
      jumpHeightTotal--;
    }
    skaterSpriteLogic(2);
  }

  if(gameStarted){
    drawFrame();
    if(currentTrick != null){
      displayText((currentTrick + "!"), ("+" + howManyPoints(currentTrick) + " points!"));
    }
    else{
      displayText("Score: " + score, "jmp: " + (jumpHeightTotal - 15));
    }
  }
}


function drawFrame(){
    clearFrame();
    context.moveTo(0,240);
    context.stroke();
    //Draw anything else...

    drawSkater();
}

function clearFrame(){
  context.clearRect(0,0,canvas.width,canvas.height);
}


function drawSkater(){

  context.drawImage(skaterSprite, (skaterSpriteNr*150), 0, 150, 150, skaterPos[0], skaterPos[1], 150, 150);

}

function animateHeelFlip(){
  var tt = trickTimerHeelflip;
  rate = tt/5;
  skaterSpriteLogic(3, rate);
  skaterSpriteLogic(4, 2*rate);
  skaterSpriteLogic(5, 3*rate);
  skaterSpriteLogic(6, 4*rate);
  skaterSpriteLogic(4, 5*rate);

}
function animateKickFlip(){
  var tt = trickTimerKickflip;
  rate = tt/4;
  skaterSpriteLogic(5, rate);
  skaterSpriteLogic(6, 2*rate);
  skaterSpriteLogic(3, 3*rate);
  skaterSpriteLogic(4, 4*rate);

}



function trick(ct){
  if(ct == null){
    if(downKeyIsDown && skaterInAir && !upKeyIsDown){
      ct = "heelflip";
      trickTimer = trickTimerHeelflip;
      score += howManyPoints(ct);
      animateHeelFlip();
    }
    else if(rightKeyIsDown && skaterInAir && !upKeyIsDown){
      ct = "kickflip";
      trickTimer = trickTimerKickflip;
      score += howManyPoints(ct);
      animateKickFlip();
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
    return 75;
  }
  else if (ct == "kickflip") {
      return 50;
  }
  else {
    return 0;
  }

}

// DEATH AND DESTRUCTION

function dead(){
  score = score - howManyPoints(currentTrick);
  var message = ("Wrecked... Final score: " + score + " points!");
  skaterSpriteNr = 8;

  resetGame(message);
}

function resetGame(string){
    gameStarted = false;

    clearFrame();
    clearInterval(refresher);

    //Default values
    setDefaults();

    //non game frame;
    drawFrame();
    displayText(string);

    onkeypress = function(){
        if (gameStarted == false){
          score = 0;
          skaterSpriteNr = 1;
          skaterSpriteLogic(2, 10); //change to sprite 2 after 10 frames
          refresher = setInterval("gameLogic()", framerate);
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
    else if (keyPressed == 39)
    {
          rightKeyIsDown = true;
    }
    else if (keyPressed == 37)
    {
          leftKeyIsDown = true;
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
    if (keyPressed == 39)
    {
          rightKeyIsDown = false;
    }
    if (keyPressed == 38)
    {
      upKeyIsDown = false;
    }
    if (keyPressed == 37)
    {
      leftKeyIsDown = false;
    }
    if (keyPressed == 32){
        spaceKeyIsDown = false;
    }
  }
}
