var BubbleShooter = window.BubbleShooter || {};
BubbleShooter.Bubble = (function($) {
  var Bubble = function(row, col, type, sprite) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.sprite = sprite;
  };

  Bubble.prototype = {
    getType: function() {
      return this.type;
    },
    getSprite: function() {
      return this.sprite;
    },
    getCol: function() {
      return this.col;
    },
    setCol: function(colNum) {
      this.col = colNum;
    },
    setRow: function(rowNum) {
      this.row = rowNum;
    },
    getCoords: function() {
      var coords = {
        left: this.col * BubbleShooter.ui.BUBBLE_DIMS / 2 + BubbleShooter.ui.BUBBLE_DIMS / 2,
        top: this.row * BubbleShooter.ui.ROW_HEIGHT + BubbleShooter.ui.BUBBLE_DIMS / 2
      };
      return coords;
    },
    getRow: function() {
      return this.row;
    },
    isInlist: function(list, bubble) {
      for (var i = 0; i < list.length; i++) {
        if (bubble.getCol() == list[i].getCol() && bubble.getRow() == list[i].getRow()) {
          return true;
        }
      }
      return false;
    }
  }

  Bubble.create = function(rowNum, colNum, type,nb) { //méthode qui va générer dans le board les bubbles en fonction de leur type (de 1 à 9) de façon aléatoire.

    if (type === undefined) {
      type = Math.floor(Math.random() * nbTypeBubble);
    }
    var sprite = $(document.createElement('div'));
    if (type == -1) {
      sprite.addClass('bubbleFake');
    } else {
      sprite.addClass('bubble');
      sprite.addClass('bubble_' + type);
    }
    var bubble = new Bubble(rowNum, colNum, type, sprite); // on instancie un nouvel objet bubble du constructeur BubbleShooter.Bubble.

    return bubble;
  };
  return Bubble;
})(jQuery);
