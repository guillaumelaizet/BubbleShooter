var BubbleShooter = window.BubbleShooter || {};
BubbleShooter.Board = (function($) {
  var NUM_ROWS = 4; // nombre de ligne que compose la structure du niveau
  var NUM_COLS = 32; // nombre de d'emplacement par ligne. une bubble prend 2 emplacements.
  var MAX_ROWS = 11;
  var BUBBLE_DIMS = 45; // definit les dimension d'une bubble
  var ROW_HEIGHT = 39;


  var Board = function() {
    var that = this;
    this.rows = [];
    this.getRows = function() {
      return this.rows;
    };

    this.addBubble = function(bubble) { // fonction qui ajoute une bubble normale et une bubble fake au board.
      if (bubble.getRow() >= this.rows.length) {
        this.rows.push([]);
      }
      this.rows[bubble.getRow()][bubble.getCol()] = bubble;
      this.rows[bubble.getRow()][bubble.getCol() + 1] = BubbleShooter.Bubble.create(bubble.getRow(), bubble.getCol() + 1, -1);
    };

    this.getBubbleFired = function(rowNum, colNum) { // récupere l'objet bubbme qui a été placé dans le board.
      if (!this.getRows()[rowNum])
        return null;
      return this.getRows()[rowNum][colNum];
    };

    this.getBubblesAround = function(curRow, curCol) { // retourne un tableau des bubbles qui sont autour de la bubble tirée.
      var bubbles = [];
      for (var rowNum = curRow - 1; rowNum <= curRow + 1; rowNum++) {
        for (var colNum = curCol - 2; colNum <= curCol + 2; colNum++) {
          var bubbleAt = that.getBubbleFired(rowNum, colNum);
          if (bubbleAt && bubbleAt.getType() !== -1 && !(colNum == curCol && rowNum == curRow)) {
            bubbles.push(bubbleAt);
          }
        }
      }
      return bubbles
    };

    this.getGroup = function(bubble, found, differentColor) {
      var curRow = bubble.getRow();
      if (!found[curRow]) {
        found[curRow] = {};
      }
      if (!found.list) {
        found.list = [];
      }
      if (found[curRow][bubble.getCol()]) {
        return found;
      }
      found[curRow][bubble.getCol()] = bubble;
      found.list.push(bubble);
      var curCol = bubble.getCol();
      var surrouding = that.getBubblesAround(curRow, curCol);
      for (var i = 0; i < surrouding.length; i++) {
        var bubbleAt = surrouding[i];
        if (bubbleAt.getType() == bubble.getType() || differentColor) {
          found = that.getGroup(bubbleAt, found, differentColor);
        }
      };
      return found;
    };

    this.popBubbleAt = function(rowNum, colNum) {
      var row = this.rows[rowNum];
      this.rows[rowNum][colNum] = undefined;
      if (colNum + 1 < this.rows[rowNum].length) {
        this.rows[rowNum][colNum + 1] = undefined;
      }
    };

    this.findOrphans = function() { // méthode qui renvoi un tableau de bubble true si elles sont touché par une autre bubble.
      var orphaned = [];
      for (var i = this.rows.length - 1; i >= 0; i--) {
        for (var j = 0; j < this.rows[i].length; j++) {
          if (this.rows[i][j] !== undefined && this.rows[i][j].getType() !== -1 && !this.rows[i][j].isInlist(orphaned, this.rows[i][j])) {
            var group = that.getGroup(this.rows[i][j], {}, true);
            if (group["0"] === undefined) {
              for (var k = 0; k < group.list.length; k++) {
                orphaned.push(group.list[k]);
              }
            }
          }
        }
      }
      return orphaned;
    };

    this.isEmpty = function() { //méthode  qui checke si le board est vide.
      for (var i = 0; i < that.getRows()[0].length; i++) {
        if (typeof that.getRows()[0][i] !== 'undefined') {
          return false;
        }
      }
      return true;
    };
    return this;
  };


  Board.prototype = {
    createLayout: function() {
      this.rows = [];
      for (var i = 0; i < NUM_ROWS; i++) {
        var row = [];
        var startCol = i % 2 == 0 ? 1 : 0;
        for (var j = startCol; j < NUM_COLS; j += 2) {
          row[j] = undefined;
        }
        this.rows.push(row);
      }

      for (var i = 0; i < NUM_ROWS; i++) {
        var startCol = i % 2 == 0 ? 1 : 0;
        for (var j = startCol; j < NUM_COLS; j += 2) {
          var bubble = BubbleShooter.Bubble.create(i, j);
          this.rows[i][j] = bubble;
        }
      }
      return this.rows;
    }
  };
  return Board;
})(jQuery);
