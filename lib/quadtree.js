
var QuadTree = function(dx, dy) {
  this.maxItems = 20;
  this.x = -dx/2;
  this.y = -dy/2;
  this.x1 = this.x + dx;
  this.y1 = this.y + dy;
  
  this.root = new Node(this.x, this.y, dx, dy);
};

QuadTree.prototype.add = function(x, y, obj, node) {
  if(x < this.x || x > this.x1 || y < this.y || y > this.y1){
    return false;
  }
  
  var node = this._findNode(x, y, node);
  var item = {x: x, y: y, data: obj};
  node.items.push(item);
  
  if(node.items.length > this.maxItems && node.dx >= 2 && node.dy >= 2){
    this._split(node);
  }
  return item;
};

QuadTree.prototype.rem = function(x, y) {
  var node = this._findNode(x, y);
  var len = node.items.length;
  node.items = node.items.filter(function(it) {
    return it.y != y || it.x != x;
  });
  return len - node.items.length;
};

QuadTree.prototype.get = function(x, y) {
  var node = this._findNode(x, y);
  return node.items.filter(function(it) {
    return it.y == y && it.x == x;
  });
};

QuadTree.prototype.getInRange = function(x, y, x1, y1) {
  var stack = [this.root], node, items = [];
  
  while (node = stack.pop()) {
    if (y1 >= node.y && y <= node.y1 && x <= node.x1 && x1 >= node.x) {
      if (node.children) {
        stack.push(node.children['topleft'],    node.children['topright'],
                   node.children['bottomleft'], node.children['bottomright']);
      } else {
        items = items.concat(node.items.filter(function(it) {
          return y1 >= it.y && y <= it.y && x <= it.x && x1 >= it.x;
        }));
      }
    }
  }
  return items;
};

QuadTree.prototype._findNode = function(x, y, node) {
  node = node || this.root;
  var nx, ny;
  while (node.children) {
    var ref = node.children.topright;
    ny = (y > ref.y ? 'top' : 'bottom');
    nx = (x > ref.x ? 'right' : 'left');
    node = node.children[ny + nx];
  }
  return node;
};

QuadTree.prototype._split = function(node) {
  var dx2 = node.dx/2;
  var dy2 = node.dy/2;
  var x = node.x + dx2;
  var y = node.y + dy2;
  
  
  node.children = {
    topright: new Node(x, y, dx2, dy2),
    topleft: new Node(node.x, y, dx2, dy2),
    bottomright: new Node(x, node.y, dx2, dy2),
    bottomleft: new Node(node.x, node.y, dx2, dy2)
  };

  for(var i in node.items){
    var item = node.items[i];
    this.add(item.x, item.y, item.data, node);
  }
  
  node.items = null;
};

var Node = function(x, y, dx, dy) {
  this.children = null;
  this.items = [];
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.x1 = x + dx;
  this.y1 = y + dy;
};


exports.QuadTree = QuadTree;
// verb(QuadTree.prototype)
function verb(obj){
 var pad = '';
 for(var f in obj){
   if(typeof obj[f] == 'function'){
     (function(fun) {
       var old = obj[fun];
       obj[fun] = function() {
         pad += ' ';
         console.log(pad, fun, arguments);
         var ret;
         try{
           ret = old.apply(this, arguments);
         } catch(e) {
           console.log(pad, 'error', fun, ret);
           pad = pad.substr(1);
           throw e;
         }
         console.log(pad, fun, ret);
         pad = pad.substr(1);
         return ret;
       };
     })(f);
   }
 }
}