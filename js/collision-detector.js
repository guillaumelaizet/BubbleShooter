var BubbleShooter = window.BubbleShooter || {};
BubbleShooter.CollisionDetector = (function($) {
  var CollisionDetector = {
    findIntersection: function(curBubble, board) { // méthode de détection qui prend en parametres les coordonnées de la bubble qui va être tirée et les bubbles qui sont dans le board. Retourne un objet avec les coordonneés intiales et finales.
      var rows = board.getRows();
      var collision = null;
      var pos = curBubble.getSprite().position();
      var start = {
        left: pos.left + BubbleShooter.ui.BUBBLE_DIMS / 2,
        top: pos.top + BubbleShooter.ui.BUBBLE_DIMS / 2
      };
      var rowNumStart = Math.round(start.top / BubbleShooter.ui.ROW_HEIGHT);
      var colNumStart = Math.round(start.left / BubbleShooter.ui.BUBBLE_DIMS * 2) - 1;


      var game = $('#page');
      var gameCoords = game.position();
      var endGame = false;


      for (var i = rows.length - 1; i >= 0; i--) {
        var row = rows[i];
        var bubble = rows[i][colNumStart];
        if (bubble) {
          if (i == board.MAX_ROWS - 1) {
            endGame = true;
            break;
          }
          if (colNumStart == 0) {
            if (bubble.getType() !== -1) {
              if (i == rows.length - 1) {
                return {
                  dest: {
                    row: i + 1,
                    col: colNumStart + 1
                  },
                  start: {
                    row: rowNumStart,
                    col: colNumStart
                  }
                };
              } else if (rows[i + 1][colNumStart + 1] && rows[i + 1][colNumStart + 1].getType() !== -1) {
                return {
                  dest: {
                    row: i + 2,
                    col: colNumStart
                  },
                  start: {
                    row: rowNumStart,
                    col: colNumStart
                  }
                };
              }
            }
          } else if (colNumStart == 1) {
            if (bubble.getType() !== -1) {
              if (i == rows.length - 1) {
                return {
                  dest: {
                    row: i + 1,
                    col: colNumStart + 1
                  },
                  start: {
                    row: rowNumStart,
                    col: colNumStart
                  }
                };
              } else if (rows[i + 1][colNumStart - 1]) {
                return {
                  dest: {
                    row: i + 2,
                    col: colNumStart
                  },
                  start: {
                    row: rowNumStart,
                    col: colNumStart
                  }
                };
              } else if (rows[i + 1][colNumStart + 1]) {
                return {
                  dest: {
                    row: i + 2,
                    col: colNumStart
                  },
                  start: {
                    row: rowNumStart,
                    col: colNumStart
                  }
                };
              }
            } else if (bubble.getType() == -1) {
              return {
                dest: {
                  row: i + 2,
                  col: colNumStart
                },
                start: {
                  row: rowNumStart,
                  col: colNumStart
                }
              };
            }
          } else if (colNumStart == BubbleShooter.Board.NUM_COLS - 1) {
            if (row.length == BubbleShooter.Board.NUM_COLS) {
              return {
                dest: {
                  row: i + 1,
                  col: colNumStart - 1
                },
                start: {
                  row: rowNumStart,
                  col: colNumStart
                }
              };
            } else if (bubble.getType() == -1) {
              if (rows[i + 1][colNumStart - 1] && rows[i + 1][colNumStart - 1].getType() == -1) {
                return {
                  dest: {
                    row: i + 1,
                    col: colNumStart - 1
                  },
                  start: {
                    row: rowNumStart,
                    col: colNumStart
                  }
                };
              }
            }
          } else if (colNumStart == BubbleShooter.Board.NUM_COLS - 2) {
            if (row.length == BubbleShooter.Board.NUM_COLS) {
              return {
                dest: {
                  row: i + 1,
                  col: colNumStart
                },
                start: {
                  row: rowNumStart,
                  col: colNumStart
                }
              };
            } else if (bubble.getType() == -1) {
              if (rows[i + 1][colNumStart - 1] && rows[i + 1][colNumStart - 1].getType() == -1) {
                return {
                  dest: {
                    row: i + 2,
                    col: colNumStart
                  },
                  start: {
                    row: rowNumStart,
                    col: colNumStart
                  }
                };
              }
            }
          } else {
            if (bubble.getType() == -1) {

              return {
                dest: {
                  row: i + 1,
                  col: colNumStart
                },
                start: {
                  row: rowNumStart,
                  col: colNumStart
                }
              };
            } else {
              if (i == rows.length - 1) {
                return {
                  dest: {
                    row: i + 1,
                    col: colNumStart + 1
                  },
                  start: {
                    row: rowNumStart,
                    col: colNumStart
                  }
                };
              } else if (!rows[i + 1][colNumStart - 1] && !rows[i + 1][colNumStart + 1]) {
                return {
                  dest: {
                    row: i + 1,
                    col: colNumStart + 1
                  },
                  start: {
                    row: rowNumStart,
                    col: colNumStart
                  }
                };
              } else {
                return {
                  dest: {
                    row: i + 2,
                    col: colNumStart
                  },
                  start: {
                    row: rowNumStart,
                    col: colNumStart
                  }
                };
              }
            }
          }
        } else if (i == 0) {
          if (colNumStart % 2 == 0) {
            if (!(rows[0][colNumStart + 1])) {
              return {
                dest: {
                  row: 0,
                  col: colNumStart + 1
                },
                start: {
                  row: rowNumStart,
                  col: colNumStart
                }
              };
            } else if (!(rows[0][colNumStart - 1])) {
              return {
                dest: {
                  row: 0,
                  col: colNumStart - 1
                },
                start: {
                  row: rowNumStart,
                  col: colNumStart
                }
              };
            } else {
              return {
                dest: {
                  row: 1,
                  col: colNumStart
                },
                start: {
                  row: rowNumStart,
                  col: colNumStart
                }
              };
            }
          }
        }
      }
      if (endGame) {
        BubbleShooter.Game.endGame(endGame);
      }
      return {
        dest: {
          row: 0,
          col: colNumStart
        },
        start: {
          row: rowNumStart,
          col: colNumStart
        }
      };
    }
  };
  return CollisionDetector;
})(jQuery);
