const EffectsEditor = (() => {
  let definitions = [];
  let currentWallpaperId = null;
  let currentMonitorId = null;
  let currentEffects = {};

  const subtitle = document.getElementById("effects-subtitle");
  const form = document.getElementById("effects-form");

  async function load() {
    definitions = await Api.effects.definitions();
  }

  async function selectWallpaper(wallpaperId, monitorId) {
    currentWallpaperId = wallpaperId;
    currentMonitorId = monitorId;
    currentEffects = await Api.effects.get(wallpaperId);
    subtitle.textContent = `Editing effects for "${wallpaperId}"`;
    render();
  }

  function render() {
    form.innerHTML = "";

    if (!currentWallpaperId) {
      return;
    }

    for (const definition of definitions) {
      const settings = currentEffects[definition.id] || {};
      const enabled = Boolean(settings.enabled);

      const card = document.createElement("div");
      card.className = "effect-card";

      const header = document.createElement("div");
      header.className = "effect-card-header";
      header.innerHTML = `<span class="effect-label">${definition.label}</span>`;

      const toggle = buildSwitch(enabled, (checked) => {
        updateEffect(definition.id, { ...settings, enabled: checked });
        paramsContainer.classList.toggle("disabled", !checked);
      });
      header.appendChild(toggle);

      const paramsContainer = document.createElement("div");
      paramsContainer.className = "effect-params" + (enabled ? "" : " disabled");

      for (const param of definition.params) {
        paramsContainer.appendChild(buildParamRow(definition.id, param, settings));
      }

      card.appendChild(header);
      card.appendChild(paramsContainer);
      form.appendChild(card);
    }
  }

  function buildParamRow(effectId, param, settings) {
    const row = document.createElement("div");
    row.className = "param-row";

    const label = document.createElement("label");
    label.textContent = param.label;

    const input = document.createElement("input");
    input.type = "range";
    input.min = param.min;
    input.max = param.max;
    input.step = param.step;
    input.value = settings[param.key] != null ? settings[param.key] : param.default;

    const valueLabel = document.createElement("span");
    valueLabel.className = "param-value";
    valueLabel.textContent = input.value;

    input.addEventListener("input", () => {
      valueLabel.textContent = input.value;
      const current = currentEffects[effectId] || { enabled: true };
      updateEffect(effectId, { ...current, [param.key]: Number(input.value) });
    });

    row.appendChild(label);
    row.appendChild(input);
    row.appendChild(valueLabel);
    return row;
  }

  function buildSwitch(checked, onChange) {
    const wrapper = document.createElement("label");
    wrapper.className = "switch";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checked;
    input.addEventListener("change", () => onChange(input.checked));

    const track = document.createElement("span");
    track.className = "switch-track";

    wrapper.appendChild(input);
    wrapper.appendChild(track);
    return wrapper;
  }

  async function updateEffect(effectId, effectSettings) {
    currentEffects = { ...currentEffects, [effectId]: effectSettings };
    await Api.effects.set(currentMonitorId, currentWallpaperId, currentEffects);
  }

  return { load, selectWallpaper };
})();
