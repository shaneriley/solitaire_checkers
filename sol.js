(function() {
  var $ = function(el) { return document.getElementsByTagName(el)[0]; };
  var game = {
    marbles: 32,
    padding_x: 20,
    padding_y: 20,
    init: function() {
      var g = this;
      g.canvas = $("canvas");
      g.ctx = g.canvas.getContext("2d");
      g.board = [
        [null, null, 1, 1, 1, null, null],
        [null, null, 1, 1, 1, null, null],
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1],
        [null, null, 1, 1, 1, null, null],
        [null, null, 1, 1, 1, null, null]
      ];
      g.marble = new Image();
      g.marble.src = "./images/marble.png";
      g.marble.size = 60;
      g.marble.onload = function() { g.run.apply(g); };
      g.winrar = new Image();
      g.winrar.src = "./images/winrar.png";
      g.background();
    },
    run: function() {
      var g = game,
          c = g.ctx,
          s = g.marble.size;
      var square = {
        draw: function(x, y) {
          c.drawImage(g.marble, 0, 0, 200, 200, x * s + game.padding_x, y * s + game.padding_y, s, s);
        },
        select: function(x, y) {
          c.drawImage(g.marble, 0, 200, 200, 200, x * s + game.padding_x, y * s + game.padding_y, s, s);
        },
        clear: function(x, y) {
          if (!isNaN(x) && !isNaN(y)) { c.clearRect(x * s + game.padding_x, y * s + game.padding_y, s, s); }
        },
        reset: function(x, y) {
          square.clear(x, y);
          square.draw(x, y);
        }
      };
      for (var y in g.board) {
        for (var x in g.board[y]) {
          if (g.board[y][x]) { square.draw(x, y); }
        }
      }
      g.canvas.addEventListener("click", function(e) {
        var g = game,
            x = ~~((e.pageX - g.padding_x) / s),
            y = ~~((e.pageY - g.padding_y) / s);
        if ("chosen" in g) {
          square.reset(g.chosen.x, g.chosen.y);
          if (g.board[y][x]) {
            square.reset(g.chosen.x, g.chosen.y);
            g.chosen.x = x;
            g.chosen.y = y;
            square.select(x, y);
          }
          else if (g.board[y][x] !== null) {
            if (!(x - g.chosen.x)) {
              if (y - g.chosen.y === 2) {
                // down
                g.board[g.chosen.y][x] = 0;
                g.board[g.chosen.y + 1][x] = 0;
                g.board[g.chosen.y + 2][x] = 1;
                square.clear(x, g.chosen.y);
                square.clear(x, g.chosen.y + 1);
                square.draw(x, y);
                g.marbles--;
              }
              else if (y - g.chosen.y === -2) {
                // up
                g.board[g.chosen.y][x] = 0;
                g.board[g.chosen.y - 1][x] = 0;
                g.board[g.chosen.y - 2][x] = 1;
                square.clear(x, g.chosen.y);
                square.clear(x, g.chosen.y - 1);
                square.draw(x, y);
                g.marbles--;
              }
            }
            else if (!(y - g.chosen.y)) {
              if (x - g.chosen.x === 2) {
                // right
                g.board[y][g.chosen.x] = 0;
                g.board[y][g.chosen.x + 1] = 0;
                g.board[y][x] = 1;
                square.clear(g.chosen.x, y);
                square.clear(g.chosen.x + 1, y);
                square.draw(x, y);
                g.marbles--;
              }
              else if (x - g.chosen.x === -2) {
                // left
                g.board[y][g.chosen.x] = 0;
                g.board[y][g.chosen.x - 1] = 0;
                g.board[y][x] = 1;
                square.clear(g.chosen.x, y);
                square.clear(g.chosen.x - 1, y);
                square.draw(x, y);
                g.marbles--;
              }
            }
            delete g.chosen;
            if (g.marbles === 1) {
              (g.board[3][3] === 1) ? g.win() : g.lose();
            }
          }
        }
        else {
          if (g.board[y][x] === 1) {
            g.chosen = {
              x: x,
              y: y
            };
            square.select(x, y);
          }
        }
        var moves_remain = 0;
        for (var i = 0; i < 7; i++) {
          for (var j = 0; j < 7; j++) {
            if (g.board[i][j] === 1) {
              if (j !== 0 && j !== 6) {
                if (g.board[i][j - 1] === 1 || g.board[i][j + 1]) { moves_remain = 1; }
                if (i !== 0 && i !== 6) {
                  if (g.board[i - 1][j] === 1 || g.board[i + 1][j] === 1) { moves_remain = 1; }
                }
                else if (i) { if (g.board[i - 1][j] === 1) { moves_remain = 1; } }
                else { if (g.board[i + 1][j] === 1) { moves_remain = 1; } }
              }
              else if (j) { if (g.board[i][j - 1] === 1) { moves_remain = 1; } }
              else { if (g.board[i][j + 1] === 1) { moves_remain = 1; } }
            }
          }
        }
        if (!moves_remain) { g.lose(); }
      }, false);
    },
    ready: function() {
      if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", function() {
          game.init.apply(game);
          $("input").addEventListener("click", function() {
            delete game.chosen;
            game.marbles = 32;
            game.init.apply(game);
            return false;
          }, false);
        }, false);
      }
    },
    background: function() {
      var c = this.ctx;
      c.save();
      c.clearRect(0, 0, this.canvas.width, this.canvas.height);
      c.restore();
    },
    win: function() {
      var g = game,
          c = g.ctx;
      g.background();
      c.drawImage(g.winrar, 0, 0);
    },
    lose: function() {
      var c = game.canvas,
          ctx = game.ctx;
      game.background();
      ctx.fillStyle = "#af1f24";
      ctx.fillRect(c.width / 2 - 100, c.height / 2 - 30, 200, 60);
      ctx.fillStyle = "white";
      ctx.font = "normal 30px Impact";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("You Lose", c.width / 2, c.height / 2);
    }
  };
  game.ready();
})();