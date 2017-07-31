var JSONURL = 'https://spreadsheets.google.com/feeds/list/15Tvpy7CqfH33BZ18CYRI2fYOR-P5yaxZDVzZNdZ2W6Q/1/public/basic?alt=json';

function callback(data){
    var rows = [];
    var cells = data.feed.entry;

    for (var i = 0; i < cells.length; i++){
        var rowObj = {};
        rowObj.item = cells[i].title.$t;
        var rowCols = cells[i].content.$t.split(',');
        for (var j = 0; j < rowCols.length; j++){
            var keyVal = rowCols[j].split(':');
            rowObj[keyVal[0].trim()] = keyVal[1].trim();
        }
        rows.push(rowObj);
    }


    // for(i=0; i<rows.length; i++){
    //   $('#showme').append((i+ 1) + ". " +rows[i].item + " " + rows[i].income + " " + rows[i].expenses + "<br>")
    // }
    length = rows.length-1;

    var total = rows[length].income - rows[length].expenses;

    $('#moneyTotal').append("Money available: " + total);

    // for(i=0; i<rows.length; i++){
    //   $('#canvass').append((i+ 1) + ". " +rows[i].name + " " + rows[i].walk + " " + rows[i].call + "<br>")
    // }
    $.each( rows, function( key, value ) {
      $("#tableMoney").append(
        "<tr>"
            +"<td>"+value.item+"</td>"
            +"<td>"+value.income+"</td>"
            +"<td>"+value.expenses+"</td>"
        +"</tr>" );
});
}

$(document).ready(function(){

    $.ajax({
        url:JSONURL,
        success: function(data){
            callback(data);
        }
    });



});



$(document).ready(function() {
  var countdownDate = new Date("Nov 7, 2017 7:00:00").getTime();
  var now = new Date().getTime();

  var countdownTime = countdownDate - now;
  var days = Math.floor(countdownTime / (1000 * 60 * 60 * 24));
    var hours = Math.floor((countdownTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

$('.election').append("<p>" + days+ " days " + hours + " hours till polls open!</p>")
});
