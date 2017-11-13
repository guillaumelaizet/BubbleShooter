var BubbleShooter = window.BubbleShooter || {};
BubbleShooter.ui = (function($) {
  var ui = {
    BUBBLE_DIMS: 45, // definit les dimension d'une bubble
    ROW_HEIGHT: 39, // definit la hauteur des lignes
    init: function() {},

    hideDialog: function() { // methode lié au click du début de jeu.
      $('.menu').fadeOut();
    },

    getBubbleCoords: function(bubble) { // méthode qui récupère les coordonnées d'une bubble.
      var bubbleCoords = bubble.position();
      bubbleCoords.left += ui.BUBBLE_DIMS / 2;
      bubbleCoords.top += ui.BUBBLE_DIMS / 2;
      return bubbleCoords
    },

    fireBubble: function(bubble, board) {
      collision = BubbleShooter.CollisionDetector.findIntersection(bubble, board);
      var x = (collision.dest.col * BubbleShooter.ui.BUBBLE_DIMS) / 2;

      var y = collision.dest.row * BubbleShooter.ui.ROW_HEIGHT;

      bubble.getSprite().animate({
        left: x - ui.BUBBLE_DIMS / 2,
        top: y - ui.BUBBLE_DIMS / 2
      }, {
        duration: BubbleShooter.Game.DURATION,
        easing: "linear",
        complete: function() { // méthode qui replace correctement une bubble tiré dans le board après l'avoir ajouté avec BubbleShooter.Board.addBubble().

          if (bubble.getRow() !== null) {
            bubble.getSprite().css({
              left: bubble.getCoords().left - ui.BUBBLE_DIMS / 2,
              top: bubble.getCoords().top - ui.BUBBLE_DIMS / 2
            });
          }
        }
      });
      bubble.setCol(collision.dest.col);
      bubble.setRow(collision.dest.row);
      board.addBubble(bubble);
      BubbleShooter.Game.popGroupedBubble(bubble, function() {
        BubbleShooter.Game.detectEndGame();
      });
      //BubbleShooter.Game.detectEndGame();
      $('.cur_bubble').removeClass('cur_bubble').addClass('bubble_placed');
    },

    drawBoard: function(board) { // méthode qui insere un sprite de bubble.
      var rows = board.getRows();

      var gameArea = $("#board");
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        for (var j = 0; j < row.length; j++) {
          var bubble = row[j];
          if (bubble) {
            var sprite = bubble.getSprite();
            gameArea.append(sprite);
            var left = j * ui.BUBBLE_DIMS / 2;
            var top = i * ui.ROW_HEIGHT;
            sprite.css({
              left: left,
              top: top
            });
            if ((j + 1) <= (row.length - 1)) {
              j++;
              row[j] = BubbleShooter.Bubble.create(i, j, -1);
            }
          }
        }
      }
    },

    drawBubblesRemaining: function(numBubbles) {
      $('.bubbles_remaining').text(numBubbles);
    },

    drawScore: function(score) {// méthode qui rend le score et qui anime les parties FORMATION et EXPERIENCES.
      if (score >= 2500) {
        setTimeout(function() {
          $('#wanted_5').css({
            display: 'none'
          });
          $('#text_wanted_5').css({
            display: 'block',
            marginTop: '50px',
            marginBottom: '50px'
          });
          $('#Formation div:eq(2)').css({
            borderRadius: '20px',
            backgroundColor: '#FFDD83'
          });
        }, BubbleShooter.Game.DURATION + 200);
      }
      if (score >= 1800) {
        setTimeout(function() {
          $('#wanted_4').css({
            display: 'none'
          });
          $('#text_wanted_4').css({
            display: 'block',
            marginTop: '50px',
            marginBottom: '50px'
          });
          $('#Formation div:eq(1)').css({
            borderRadius: '20px',
            backgroundColor: '#FFDD83'
          });
        }, BubbleShooter.Game.DURATION + 200);
      }
      if (score >= 1350) {
        setTimeout(function() {
          $('#wanted_3').css({
            display: 'none'
          });
          $('#formationTitre').css({
            display: 'block'
          })
          $('#text_wanted_3').css({
            display: 'block',
            marginTop: '50px',
            marginBottom: '50px'
          });
          $('#Formation>h3 + div').css({
            borderRadius: '20px',
            backgroundColor: '#FFDD83'
          })
        }, BubbleShooter.Game.DURATION + 200);
      }
      if (score >= 900) {
        setTimeout(function() {
          $('#wanted_2').css({
            display: 'none'
          });
          $('#text_wanted_2').css({
            display: 'block',
            marginTop: '50px',
            marginBottom: '50px'
          });
          $('#Experience div:eq(2)').css({
            borderRadius: '20px',
            backgroundColor: '#FFDD83'
          });
        }, BubbleShooter.Game.DURATION + 200);
      }

      if (score >= 450) {
        setTimeout(function() {
          $('#wanted_1').css({
            display: 'none'
          });
          $('#text_wanted_1').css({
            display: 'block',
            marginTop: '50px',
            marginBottom: '50px'
          });
          $('#Experience div:eq(1)').css({
            borderRadius: '20px',
            backgroundColor: '#FFDD83'
          });
        }, BubbleShooter.Game.DURATION + 200)
      }
      if (score >= 150) {
        setTimeout(function() {
          $('#wanted_0').css({
            display: 'none'
          });
          $('#experienceTitre').css({
            display: 'block'
          })
          $('#text_wanted_0').css({
            display: 'block',
            marginTop: '50px',
            marginBottom: '50px'
          });
          $('#Experience>h3 + div').css({
            borderRadius: '20px',
            backgroundColor: '#FFDD83'
          });
        }, BubbleShooter.Game.DURATION + 200);
      }
      setTimeout(function() {
        $('#score_number').text(score);
      }, BubbleShooter.Game.DURATION + 200);
    },

    drawHighscore: function(highscore) {
      $('#highscore_number').text(BubbleShooter.Game.highscore);
    },

    drawLevel: function(level) {
      $('#level_number').text(level);
    },

    endGame: function(hasWon, score) { //méthode qui anime les fins gagnantes et fins perdantes.
      BubbleShooter.ui.drawBubblesRemaining(0);
      if (hasWon) {
        setTimeout(function() {
          $('#end_game_win').show();
          $('#end_game_loss').hide();
        }, BubbleShooter.Game.DURATION + 200);
      } else {
        $('#end_game_loss').show();
        $('#end_game_win').hide();
      }
      $('#button_return_init').click('click', function() {
        $('#end_game_loss').hide();
      });
    }
  };
  return ui;
})(jQuery);
