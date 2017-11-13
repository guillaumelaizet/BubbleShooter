var BubbleShooter = window.BubbleShooter || {};
BubbleShooter.Boat = (function($) {
  var Boat = function(sprite) {
    this.getSprite = function() {
      return sprite;
    };
  };

  Boat.create = function() { // méthode qui crée la div, ajoute une classe et instancie un objet boat.
    if (typeof boat !== undefined) {
      $('.boat').remove();
    }
    var sprite = $(document.createElement('div'));
    sprite.addClass('boatLeft').addClass('boat')
    var boat = new BubbleShooter.Boat(sprite);
    return boat;
  };
  return Boat;
})(jQuery);
