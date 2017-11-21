var valueDomain = function() {
  this.background.init();
};

valueDomain.prototype.background = {
  layout: {
    background: null
  },
  init: function() {
    var canvas = document.createElement("canvas");
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "#1d2227"; //background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#13191f"; //border color

    for (
      var unit = 10;
      unit < canvas.width || unit < canvas.height;
      unit += 12
    ) {
      if (unit < canvas.height) {
        ctx.fillRect(0, unit, canvas.width, 2);
      }
      if (unit < canvas.width) {
        ctx.fillRect(unit, 0, 2, canvas.height);
      }
    }
    canvas.addEventListener("mousedown", this.eventHandler);
    canvas.addEventListener("touchstart", this.eventHandler);
    canvas.addEventListener("mousemove", this.eventHandler);
    canvas.addEventListener("touchmove", this.eventHandler);

    document.body.appendChild(canvas);
  },
  eventHandler: function() {
    console.log("handling");
  }
};

new valueDomain();
