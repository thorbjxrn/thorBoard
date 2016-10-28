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
var jumpTime = 15;
var jumpTimer = 0;


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

  	if (keyPressed == 38)
  	{
  		    console.log("up");

          if(skaterInAir == false){
            skaterPos = [51, 80];
            skaterInAir = true;
            jumpTimer = jumpTime;
          }
  	}
  	else if (keyPressed == 40)
  	{
        console.log("down");
  	}
  }


  document.addEventListener("keydown",keyPressHandler, false);


  onkeypress = function(){
    //var key = event.key;

    if (gameStarted == false){
      setInterval("drawFrame()", 1000/60); //60 Frames per second
      gameStarted = true;
    }
  }

}

function displayText(text) {
  context.font = "30px Arial";
  context.strokeText(text,10,50);
}

function drawFrame(){
    context.clearRect(0,0,canvas.width,canvas.height);
    //Draw anything else...
    displayText(score);
    score++;

    if(skaterInAir){
      if(jumpTimer < 1){
        skaterInAir = false;
        skaterPos = skaterPosDefault;
      }
      else{
        jumpTimer--;
        skaterPos[1]++;
      }

    }

    context.drawImage(skater, skaterPos[0], skaterPos[1]);

    context.moveTo(0,240);
    context.lineTo(720,240);
    context.stroke();


}
