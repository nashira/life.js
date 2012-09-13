var Grid = function(gridSize, canvas) {
  this.gridSize = gridSize;
  this.canvas = canvas;
  this.squares = {};
};

Grid.prototype.setup = function(width, height) {
  this.cx = width/2;
  this.cy = height/2;
  this.canvas.translate(this.cx, this.cy);
};

Grid.prototype.clear = function() {
  this.canvas.clearRect(-this.cx, -this.cy, this.cx*2, this.cy*2);
};

Grid.prototype.draw = function() {
  var xpad = Math.round(this.cx % this.gridSize),
      ypad = Math.round(this.cy % this.gridSize);

  var left = -this.cx,
      top = -this.cy;
  
  for(var x = left + xpad; x <= this.cx; x += this.gridSize){
    this.canvas.beginPath();
    this.canvas.moveTo(x, top);
    this.canvas.lineTo(x, this.cy);
    this.canvas.stroke();
  }
  for(var y = top + ypad; y <= this.cy; y += this.gridSize){
    this.canvas.beginPath();
    this.canvas.moveTo(left, y);
    this.canvas.lineTo(this.cx, y);
    this.canvas.stroke();
  }
  // for(var s = 0; s < this.squares.length; s++){
  //   var square = this.squares[s];
  //   this.drawSquare(square.x, square.y);
  // }
  
  
  // this.canvas.beginPath();
  // this.canvas.arc(0, 0, 5, 0, Math.PI*2, true);
  // this.canvas.closePath();
  // this.canvas.stroke();
};

Grid.prototype.addSquare = function(x, y) {
  this.squares.push({x: x, y: y});
  this.drawSquare(x, y);
};

Grid.prototype.drawSquare = function(x, y, color) {
  this.canvas.fillStyle = color || '#fff';
  this.canvas.strokeStyle = this.canvas.fillStyle;
  this.canvas.fillRect(x*this.gridSize, -y*this.gridSize, this.gridSize, -this.gridSize);
};

Grid.prototype.getSquare = function(x, y) {
  var nx = Math.floor((x - this.cx) / this.gridSize),
      ny = Math.floor((this.cy - y) / this.gridSize);
  return {x: nx, y: ny};
};
