window.__AURA__.registerEffect("rain", function (canvas, filterTarget, config) {
  var drops = [];

  function seed(count) {
    drops = [];
    for (var i = 0; i < count; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: 10 + Math.random() * 20,
        speed: 4 + Math.random() * 6,
      });
    }
  }

  var state = { intensity: 0.5, count: 150 };

  function apply(settings) {
    state.intensity = settings.intensity != null ? settings.intensity : state.intensity;
    state.count = Math.round(80 + state.intensity * 320);
    seed(state.count);
  }
  apply(config);

  return {
    update: apply,
    render: function (ctx) {
      ctx.strokeStyle = "rgba(174, 194, 224, " + (0.3 + state.intensity * 0.4) + ")";
      ctx.lineWidth = 1;

      for (var i = 0; i < drops.length; i++) {
        var drop = drops[i];
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;
        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      }
    },
    dispose: function () {
      drops = [];
    },
  };
});
