var QuadTree = require('./quadtree.js').QuadTree;

var Game = function() {
  this.size = 1000;
  this.grid = new QuadTree(this.size, this.size);

  var range = this.size/2+1;
  
  this.neibs = {};
  for (var i = -range, ii = range; i <= ii; i++) {
    this.neibs[i] = {};
    for (var j = -range, jj = range; j <= jj; j++) {
      this.neibs[i][j] = {count: 0, live: false};
    }
  }
};

Game.prototype.add = function(x, y) {
  var add = this.grid.add(x, y, x+':'+y);
  if(add){
    this.updateNeibs(x, y, true);
  }
  return [add];
};

Game.prototype.rem = function(x, y) {
  var rem = this.grid.rem(x, y);
  if(rem){
    this.updateNeibs(x, y, false);
  }
  return rem;
};

Game.prototype.updateNeibs = function(x, y, live) {
  var count = live ? 1 : -1;
  this.neibs[x-1][y-1].count += count;
  this.neibs[x-1][y].count += count;
  this.neibs[x-1][y+1].count += count;
  this.neibs[x][y-1].count += count;
  this.neibs[x][y].live = live;
  this.neibs[x][y+1].count += count;
  this.neibs[x+1][y-1].count += count;
  this.neibs[x+1][y].count += count;
  this.neibs[x+1][y+1].count += count;
};

Game.prototype.get = function(x, y) {
  return this.grid.get(x, y);
};

Game.prototype.pause = function() {
  clearInterval(this.iid);
  this.iid = null;
};

Game.prototype.play = function(interval) {
  if(this.iid) return;
  
  var endx = endy = this.size/2;
  var startx = starty = -endx;
  
  interval = interval || 100;
  
  this.iid = setInterval(function() {
    console.time('gameOfLife')
    var liveCells = this.grid.getInRange(startx, starty, endx, endy);
    var visited = {};
    
    var adds = [], rems = [];
    
    for(var c = 0; c < liveCells.length; c++){
      var cell = liveCells[c];
      
      for(var i = cell.x-1, ii = i+2; i <= ii; i++){
        for(var j = cell.y-1, jj = j+2; j <= jj; j++){
          var key = i+':'+j;
          if(visited[key]) {
            continue;
          }
          visited[key] = true;
          var neib = this.neibs[i][j];
          if(!neib.live && (neib.count == 3)){
            adds.push({x: i, y: j});
          } else if (neib && (neib.count < 2 || neib.count > 3)) {
            rems.push({x: i, y: j});
          }
        }
      }
    }
    
    for(i in adds){
      this.add(adds[i].x, adds[i].y);
    }
    for(i in rems){
      this.rem(rems[i].x, rems[i].y);
    }
    
    this.socket.emit('update', JSON.stringify({adds: adds, rems: rems}));
    // this.socket.emit('update', this.serialized())
    console.timeEnd('gameOfLife')
  }.bind(this), interval);
};

Game.prototype.setSocket = function(socket) {
  var pause = this.pause.bind(this);
  var play = this.play.bind(this);
  var self = this;
  
  if(this.socket){
    // clean up
  }
  
  this.socket = socket;
  this.socket.on('add', function(square, cb) {
    square = JSON.parse(square);
    var add = self.add(square.x, square.y);
    cb(add);
  });
  this.socket.on('pause', pause);
  this.socket.on('play', play);
  this.socket.on('disconnect', pause);
  this.socket.emit('update', JSON.stringify({adds: this.serialized()}));
};

Game.prototype.serialized = function() {
  var endx = endy = this.size/2;
  var startx = starty = -endx;
  return this.grid.getInRange(startx, starty, endx, endy);
};

exports.Game = Game;
