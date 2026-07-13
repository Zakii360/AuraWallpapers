window.__AURA__.registerEffect("snow", function (canvas, filterTarget, config) {
  var flakes = [];
  var state = { intensity: 0.5 };

  function seed(count) {
    flakes = [];
    for (var i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 1 + Math.random() * 3,
        drift: Math.random() * 1.2 - 0.6,
        speed: 0.5 + Math.random() * 1.5,
      });
    }
  }

  function apply(settings) {
    state.intensity = settings.intensity != null ? settings.intensity : state.intensity;
    seed(Math.round(40 + state.intensity * 200));
  }
  apply(config);

  return {
    update: apply,
    render: function (ctx) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";

      for (var i = 0; i < flakes.length; i++) {
        var flake = flakes[i];
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();

        flake.y += flake.speed;
        flake.x += flake.drift;

        if (flake.y > canvas.height) {
          flake.y = -flake.radius;
          flake.x = Math.random() * canvas.width;
        }
      }
    },
    dispose: function () {
      flakes = [];
    },
  };
});
