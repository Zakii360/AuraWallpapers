window.__AURA__.registerEffect("particles", function (canvas, filterTarget, config) {
  var particles = [];
  var state = { intensity: 0.5, color: "179, 200, 255" };

  function seed(count) {
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 0.5 + Math.random() * 2,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
        alpha: 0.2 + Math.random() * 0.5,
      });
    }
  }

  function apply(settings) {
    state.intensity = settings.intensity != null ? settings.intensity : state.intensity;
    state.color = settings.color || state.color;
    seed(Math.round(30 + state.intensity * 150));
  }
  apply(config);

  return {
    update: apply,
    render: function (ctx) {
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        ctx.fillStyle = "rgba(" + state.color + ", " + p.alpha + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
    },
    dispose: function () {
      particles = [];
    },
  };
});
