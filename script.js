var countdownDate = new Date("Nov 7, 2017 7:00:00").getTime();
var now = new Date().getTime();

var countdownTime = countdownDate - now;
var days = Math.floor(countdownTime / (1000 * 60 * 60 * 24));
  var hours = Math.floor((countdownTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((countdownTime % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((countdownTime % (1000 * 60)) / 1000);

console.log( days + " days" + hours + " hours")
