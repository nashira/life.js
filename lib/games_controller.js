var Game = require('./game.js').Game;

var GamesController = function() {
  this.games = {};
};

GamesController.prototype.get = function(name) {
  return this.games[name] || this.new(name);
};

GamesController.prototype.new = function(name) {
  return this.games[name] = new Game();
};

GamesController.prototype.rem = function(name) {
  return delete(this.games[name]);
};

module.exports = new GamesController();