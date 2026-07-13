window.__AURA__.registerEffect("fog", function (canvas, filterTarget, config) {
  var state = { intensity: 0.4 };
  var offset = 0;

  function apply(settings) {
    state.intensity = settings.intensity != null ? settings.intensity : state.intensity;
  }
  apply(config);

  return {
    update: apply,
    render: function (ctx) {
      offset = (offset + 0.15) % canvas.width;

      var gradient = ctx.createLinearGradient(offset - canvas.width, 0, offset, canvas.height);
      var alpha = state.intensity * 0.35;

      gradient.addColorStop(0, "rgba(220, 225, 235, 0)");
      gradient.addColorStop(0.5, "rgba(220, 225, 235, " + alpha + ")");
      gradient.addColorStop(1, "rgba(220, 225, 235, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    dispose: function () {},
  };
});
