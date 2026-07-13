window.__AURA__.registerEffect("vignette", function (canvas, filterTarget, config) {
  var layer = document.createElement("div");
  layer.style.position = "fixed";
  layer.style.inset = "0";
  layer.style.pointerEvents = "none";
  layer.style.zIndex = "2147483646";
  document.documentElement.appendChild(layer);

  function apply(settings) {
    var strength = settings.strength != null ? settings.strength : 0.5;
    layer.style.boxShadow = "inset 0 0 " + 220 * strength + "px " + 80 * strength + "px rgba(0, 0, 0, " + strength + ")";
  }
  apply(config);

  return {
    update: apply,
    dispose: function () {
      layer.remove();
    },
  };
});
