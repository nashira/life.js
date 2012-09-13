$(function() {
  
  var name = window.location.hash.substr(1);
  var win = $(window);
  var container = $('#content');
  var cvs = $('canvas');
  var canvas = cvs[0].getContext("2d");
  
  var grid = new Grid(5, canvas);
  
  win.resize(function() {
    layout(cvs, canvas, container);
    grid.setup(container.width(), container.height());
    // grid.draw();
    
    // grid.drawSquare(0, 0)
    // grid.drawSquare(2, 2)
    // grid.drawSquare(-2, -2)
  });
  
  container.trigger('resize');
  
  var socket = io.connect('/');
  socket.on('connect', function (data) {
    socket.emit('set name', name);
  });
  
  socket.on('update', function (data) {
    // console.log('update', data);
    data = JSON.parse(data);
    // grid.squares = resp;
    // grid.clear();
    // grid.draw();
    var adds = data.adds;
    var rems = data.rems;
    var i;
    
    for(i in adds){
      grid.drawSquare(adds[i].x, adds[i].y);
    }
    for(i in rems){
      grid.drawSquare(rems[i].x, rems[i].y, '#000');
    }
  });
  
  $('#play').click(function() {
    socket.emit('play')
  });
  
  $('#pause').click(function() {
    socket.emit('pause')
  });
  
  cvs.click(function(evt) {
    var yOffset = cvs.offset().top;
    var pos = grid.getSquare(evt.pageX, evt.pageY-yOffset);
    socket.emit('add', JSON.stringify({x: pos.x, y: pos.y}), function(resp) {
      for(var i in resp){
        grid.drawSquare(resp[i].x, resp[i].y);
      }
    });
    console.log(evt.pageX, evt.pageY, pos);
  });
});


var layout = function(cvs, canvas, container) {
  cvs.attr('width',  container.width());
  cvs.attr('height',  container.height());
  canvas.fillStyle   = '#fff';
  canvas.strokeStyle   = '#fff';
  canvas.lineWidth   = 0.8;
};















