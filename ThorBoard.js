// JavaScript test 2016-10-27

//ThorBoard
//A simple skateboarding game

console.log("ThorBoard v 0.1");

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var skater = new Image();
skater.src = 'resources/skater.png';

context.moveTo(0,240);
context.lineTo(720,240);
context.stroke();

// execute main function now
main();

//Functions:

function main(){
  var text = displayText("hello world. press space to play or something");

  skater.onload = function(){
    context.drawImage(skater, 50, 93);
  }

  onkeypress = function(){
    setInterval("update()",1000/60); //60 Frames per second
  }

}

function displayText(text) {
  context.font = "30px Arial";
  context.strokeText(text,10,50);
}

function update(){
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillText(count,200,200);
    //Draw anything else...
    displayText(score);

    skater.onload = function(){
      context.drawImage(skater, 50, 93);
    }

}
