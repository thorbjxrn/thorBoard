// JavaScript test 2016-10-27

//ThorBoard
//A simple skateboarding game

console.log("ThorBoard v 0.1");

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

context.moveTo(0,240);
context.lineTo(720,240);
context.stroke();
