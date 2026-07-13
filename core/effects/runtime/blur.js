window.__AURA__.registerEffect("blur", function (canvas, filterTarget, config) {
  function apply(settings) {
    var amount = settings.amount != null ? settings.amount : 4;
    filterTarget.style.filter = mergeFilter(filterTarget.style.filter, "blur", amount + "px");
  }
  apply(config);

  return {
    update: apply,
    dispose: function () {
      filterTarget.style.filter = removeFilter(filterTarget.style.filter, "blur");
    },
  };

  function mergeFilter(current, name, value) {
    var withoutOld = removeFilter(current, name);
    return (withoutOld + " " + name + "(" + value + ")").trim();
  }

  function removeFilter(current, name) {
    if (!current) return "";
    var pattern = new RegExp(name + "\\([^)]*\\)", "g");
    return current.replace(pattern, "").trim();
  }
});
