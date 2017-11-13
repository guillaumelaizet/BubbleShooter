var nbTypeBubble = 2;
var MAX_BUBBLES = 60;
var score = 0;
var level = 1;
var BubbleShooter = window.BubbleShooter || {};
BubbleShooter.Game = (function($) {
  var game = {
    curBubble: null, // bubble que l'on utilise pour tirer
    board: null,
    SCORE_BUBBLE: 50, // score par bubble
    highscore: 0,
    MAX_ROWS: 12,
    DURATION: 750,
    that: this,
    requestAnimStart: null,
    requestAnimStartRight: null,
    hasWon: null,


    init: function() {
      $('#button_return_init').bind('click', function(){
        nbTypeBubble = 2;
        score = 0;
        level = 1;
        BubbleShooter.Game.startGame();
      });
      $('.button_new_game').bind('click', this.startGame);
      $('#button_next_level').bind('click', function(){
        if(nbTypeBubble<9){
          nbTypeBubble++;
        }
        level++;
        BubbleShooter.Game.startGame();
      $('#end_game_win').hide();
      });


      function RaF() {


        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
          window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
          window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
          window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
              },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
          };

        if (!window.cancelAnimationFrame)
          window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
          };
      };
      RaF();
      (function animStart() {
        var vitesse = 10;
        var menu = $('#start_game').position();
        $('#start_game').css({
          left: (menu.left - vitesse)
        });

        if (menu.left > 50) {
          cancelAnimationFrame(BubbleShooter.Game.requestAnimStart);
          BubbleShooter.Game.requestAnimStart = requestAnimationFrame(animStart);
        } else {
          cancelAnimationFrame(BubbleShooter.Game.requestAnimStartRight);
          BubbleShooter.Game.requestAnimStartRight = requestAnimationFrame(animStartRight);
        }
      })();

      function animStartRight() {
        var vitesse = 4;
        var menu = $('#start_game').position();

        $('#start_game').css({
          left: (menu.left + vitesse)
        });
        if (menu.left < 150) {

          BubbleShooter.Game.requestAnimStartRight = requestAnimationFrame(animStartRight);
        }
      }
    },

    getNextBubble: function() {
      var bubble = BubbleShooter.Bubble.create();
      bubble.getSprite().addClass('cur_bubble');
      $('#board').append(bubble.getSprite());
      if ($('.boat').length) {
        if ($('.boatLeft').length > 0) {
          $('.cur_bubble').css({
            left: $('.boat').position().left - BubbleShooter.ui.BUBBLE_DIMS / 2
          });
        } else if ($('.boatRight').length > 0) {
          $('.cur_bubble').css({
            left: $('.boat').position().left + $('.boat').width() - BubbleShooter.ui.BUBBLE_DIMS / 2
          })
        }
      }
      BubbleShooter.ui.drawBubblesRemaining(MAX_BUBBLES);
      return bubble;
    },

    startGame: function() {
      BubbleShooter.ui.drawLevel(level);
      BubbleShooter.ui.drawScore(score);
      MAX_BUBBLES = 60;
      clearTimeout(BubbleShooter.Game.requestAnimStart);


      $('.button_new_game').unbind('.myEvents');
      $('#button_return_init').unbind('.myEvents');
      $('#game').unbind('.myEvents');
      if (typeof board !== undefined) {
        $('#board').html('');
      }
      var bubbleRem = $(document.createElement('div'));
      $('#board').append(bubbleRem);
      bubbleRem.addClass('bubbles_remaining');
      BubbleShooter.ui.hideDialog();
      curBubble = BubbleShooter.Game.getNextBubble();
      board = new BubbleShooter.Board();
      board.createLayout();
      BubbleShooter.ui.drawBoard(board);
      boatAnim = BubbleShooter.Game.drawBoat();


      var keyState = {}
      window.addEventListener('keydown', function(e) {
        keyState[e.keyCode || e.which] = true;
        if ((keyState[37] || keyState[81]) || (keyState[39] || keyState[68]) || keyState[32]) {
          e.stopPropagation();
          e.preventDefault();
        }
      }, true);

      window.addEventListener('keyup', function(e) {
        keyState[e.keyCode || e.which] = false;
        if ((keyState[37] || keyState[81]) || (keyState[39] || keyState[68]) || keyState[32]) {
          e.stopPropagation();
          e.preventDefault();
        }
      }, true);

      function keyMovement(curBubble, e) {
        var bubble = $('.cur_bubble').position();
        var boat = $('.boat').position();
        if (keyState[37] || keyState[81]) {
          if ($('.boat').hasClass('boatRight')) {
            $('.boat').css({
              transform: 'scale(1,1)'
            }).removeClass('boatRight').addClass('boatLeft');
            $('.cur_bubble').css({
              left: bubble.left - $('.boat').width()
            })
            bubble.left -= +$('.boat').width();

          }
          $('.boat').css({
            left: Math.max(boat.left - 10, BubbleShooter.ui.BUBBLE_DIMS / 2 + 10)
          });
          $('.cur_bubble').css({
            left: Math.max(bubble.left - 10, 10)
          });

        }
        if (keyState[39] || keyState[68]) {
          if ($('.boat').hasClass('boatLeft')) {
            $('.boat').css({
              transform: 'scale(-1,1)'
            }).removeClass('boatLeft').addClass('boatRight');
            $('.cur_bubble').css({
              left: bubble.left + $('.boat').width()
            });
            bubble.left += $('.boat').width();

          }
          $('.boat').css({
            left: Math.min(boat.left + 10, $("#game").width() - $(".boat").width() - BubbleShooter.ui.BUBBLE_DIMS / 2 -15)
          });
          $('.cur_bubble').css({
            left: Math.min(bubble.left + 10, $('#game').width() - BubbleShooter.ui.BUBBLE_DIMS - 15)
          });
        }

        if (keyState[32]) {
          BubbleShooter.ui.fireBubble(curBubble, board);
          curBubble = BubbleShooter.Game.getNextBubble();
          MAX_BUBBLES--;
          // var numBubbles = BubbleShooter.Game.MAX_BUBBLES;
          keyState = {};
        }
        BubbleShooter.Game.requestAnimStart = setTimeout(function() {
          keyMovement(curBubble);
        }, 10);
      }
      keyMovement(curBubble);
    },

    drawBoat: function() {
      var boat = BubbleShooter.Boat.create();
      boat.getSprite().addClass('boat');
      $('#board').append(boat.getSprite());
    },




    popGroupedBubble: function(curBubble, callback) { // méthode qui appellent les animations et qui change le score.
      var group = board.getGroup(curBubble, {});
      if (group.list.length >= 3) {
        BubbleShooter.Game.popBubbles(group.list, BubbleShooter.Game.DURATION);
        var orphans = board.findOrphans();

        var delay = BubbleShooter.Game.DURATION + 200 + 30 * group.list.length;
        BubbleShooter.Game.dropBubble(orphans, delay);
        var popped = [].concat(group.list, orphans);
        var point = (popped.length * BubbleShooter.Game.SCORE_BUBBLE) + (50 * level);
        score += point;
        setTimeout(function() {
          BubbleShooter.ui.drawScore(BubbleShooter.Game.score);
        }, BubbleShooter.Game.DURATION + 200);
      }
      if (callback) {
        callback();
      }
    },

    detectEndGame: function(hasWon) { //méthode qui définit si le niveau est gagné ou perdu.
      if (board.getRows().length >= BubbleShooter.Game.MAX_ROWS) {
        BubbleShooter.Game.endGame(false);
      } else if (MAX_BUBBLES <= 0) {
        BubbleShooter.Game.endGame(false);
      } else if (board.isEmpty()) {
        BubbleShooter.ui.endGame(true);
      } else {

        BubbleShooter.ui.drawScore(score);
        BubbleShooter.ui.drawHighscore(highscore);
      }
    },


    popBubbles: function(bubbles, delay) { //méthode qui anime les bubbles qui explosent.
      $.each(bubbles, function() {
        var bubble = this;
        board.popBubbleAt(this.getRow(), this.getCol());
        setTimeout(function() {
          bubble.getSprite().remove();
        }, delay + 200);
      });
    },
    dropBubble: function(bubbles, delay) { // méthode qui anime les bubbles qui tombent.
      $.each(bubbles, function() {
        var bubble = this;
        board.popBubbleAt(bubble.getRow(), bubble.getCol());
        setTimeout(function() {
          bubble.getSprite().animate({
            top: 1000
          }, 1000);
        }, delay);
      });
    },

    endGame: function(hasWon) { // méthode qui renvoi les scores en fin de partie et qui rappelle le début du jeu si besoin.
      if (score > BubbleShooter.Game.highscore) {
        BubbleShooter.Game.highscore = score;
        BubbleShooter.ui.drawHighscore(BubbleShooter.Game.highscore);
      }
        BubbleShooter.ui.drawLevel(level);
      clearTimeout(BubbleShooter.Game.requestAnimStart);
      clearTimeout(BubbleShooter.Game.requestAnimStartRight);
      // window.removeEventListener('keyup', );
      window.removeEventListener('keydown', BubbleShooter.Game.myEventKeydown, true);
      window.removeEventListener('keyup', BubbleShooter.Game.myEventKeyup, true);
      $('#board .bubble').remove();
      BubbleShooter.ui.endGame(hasWon,score);
    }
  }
  return game;
})(jQuery);
BubbleShooter.Game.init();
