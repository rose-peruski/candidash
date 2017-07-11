
$(document).ready(function() {
  var countdownDate = new Date("Nov 7, 2017 7:00:00").getTime();
  var now = new Date().getTime();

  var countdownTime = countdownDate - now;
  var days = Math.floor(countdownTime / (1000 * 60 * 60 * 24));
    var hours = Math.floor((countdownTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

$('.election').append("<p>" + days+ " days " + hours + " hours till polls open!</p>")
});
