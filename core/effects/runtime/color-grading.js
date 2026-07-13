window.__AURA__.registerEffect("colorGrading", function (canvas, filterTarget, config) {
  function apply(settings) {
    var brightness = settings.brightness != null ? settings.brightness : 1;
    var contrast = settings.contrast != null ? settings.contrast : 1;
    var saturation = settings.saturation != null ? settings.saturation : 1;

    var others = stripColorGradingFilters(filterTarget.style.filter);
    var next = [
      "brightness(" + brightness + ")",
      "contrast(" + contrast + ")",
      "saturate(" + saturation + ")",
    ].join(" ");

    filterTarget.style.filter = (others + " " + next).trim();
  }
  apply(config);

  return {
    update: apply,
    dispose: function () {
      filterTarget.style.filter = stripColorGradingFilters(filterTarget.style.filter);
    },
  };

  function stripColorGradingFilters(current) {
    if (!current) return "";
    return current
      .replace(/brightness\([^)]*\)/g, "")
      .replace(/contrast\([^)]*\)/g, "")
      .replace(/saturate\([^)]*\)/g, "")
      .trim();
  }
});
