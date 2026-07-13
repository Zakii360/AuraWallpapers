(function () {
  if (window.__AURA__) return;

  var overlay = document.createElement("canvas");
  overlay.id = "__aura-effects-overlay";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.pointerEvents = "none";
  overlay.style.zIndex = "2147483647";
  document.documentElement.appendChild(overlay);

  function resize() {
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  var filterTarget = document.body || document.documentElement;

  var registry = {};
  var active = {};
  var lastFrame = performance.now();

  function tick(now) {
    var delta = now - lastFrame;
    lastFrame = now;
    var ctx = overlay.getContext("2d");
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    for (var key in active) {
      if (active[key] && typeof active[key].render === "function") {
        active[key].render(ctx, overlay, delta);
      }
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  window.__AURA__ = {
    canvas: overlay,
    filterTarget: filterTarget,

    registerEffect: function (name, factory) {
      registry[name] = factory;
    },

    applyConfig: function (config) {
      config = config || {};

      for (var name in registry) {
        var settings = config[name];

        if (settings && settings.enabled) {
          if (active[name]) {
            active[name].update(settings);
          } else {
            active[name] = registry[name](overlay, filterTarget, settings);
          }
        } else if (active[name]) {
          if (typeof active[name].dispose === "function") {
            active[name].dispose(overlay, filterTarget);
          }
          delete active[name];
        }
      }
    },
  };
})();
