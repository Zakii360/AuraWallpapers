window.__AURA__.registerEffect("cameraDrift", function (canvas, filterTarget, config) {
  var state = { amplitude: 12, period: 20000 };
  var start = performance.now();

  filterTarget.style.transformOrigin = "center center";
  filterTarget.style.willChange = "transform";

  function apply(settings) {
    state.amplitude = settings.amplitude != null ? settings.amplitude : state.amplitude;
    state.period = settings.periodMs != null ? settings.periodMs : state.period;
  }
  apply(config);

  return {
    update: apply,
    render: function () {
      var elapsed = performance.now() - start;
      var progress = (elapsed % state.period) / state.period;
      var angle = progress * Math.PI * 2;

      var x = Math.cos(angle) * state.amplitude;
      var y = Math.sin(angle) * state.amplitude * 0.5;

      filterTarget.style.transform = "translate(" + x.toFixed(2) + "px, " + y.toFixed(2) + "px) scale(1.03)";
    },
    dispose: function () {
      filterTarget.style.transform = "";
    },
  };
});
