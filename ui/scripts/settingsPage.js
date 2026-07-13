const SettingsPage = (() => {
  const settingsPanel = document.getElementById("settings-panel");
  const performancePanel = document.getElementById("performance-panel");

  async function load() {
    const settings = await Api.settings.get();
    renderSettings(settings);
    renderPerformance(settings);
  }

  function renderSettings(settings) {
    settingsPanel.innerHTML = "";

    settingsPanel.appendChild(
      buildToggleRow("Launch at startup", "Start AuraWallpapers automatically when you log in.", settings.startup, (checked) =>
        Api.settings.update({ startup: checked }),
      ),
    );
  }

  function renderPerformance(settings) {
    performancePanel.innerHTML = "";

    performancePanel.appendChild(
      buildRangeRow("Frame rate limit", settings.fps, 15, 60, 5, (value) => Api.settings.update({ fps: value })),
    );

    performancePanel.appendChild(
      buildToggleRow(
        "Pause when a fullscreen app is focused",
        "Stops rendering while you are gaming or watching video fullscreen.",
        settings.pauseOnFullscreen,
        (checked) => Api.settings.update({ pauseOnFullscreen: checked }),
      ),
    );

    performancePanel.appendChild(
      buildToggleRow(
        "Pause on battery",
        "Stops rendering wallpapers while the machine is unplugged.",
        settings.pauseOnBattery,
        (checked) => Api.settings.update({ pauseOnBattery: checked }),
      ),
    );

    performancePanel.appendChild(
      buildToggleRow(
        "Hardware acceleration",
        "Disable only if you experience rendering issues on older GPUs.",
        settings.hardwareAcceleration,
        (checked) => Api.settings.update({ hardwareAcceleration: checked }),
      ),
    );
  }

  function buildToggleRow(label, description, checked, onChange) {
    const row = document.createElement("div");
    row.className = "setting-row";

    const text = document.createElement("div");
    text.innerHTML = `<div class="setting-label">${label}</div><div class="setting-description">${description}</div>`;

    const wrapper = document.createElement("label");
    wrapper.className = "switch";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(checked);
    input.addEventListener("change", () => onChange(input.checked));

    const track = document.createElement("span");
    track.className = "switch-track";

    wrapper.appendChild(input);
    wrapper.appendChild(track);

    row.appendChild(text);
    row.appendChild(wrapper);
    return row;
  }

  function buildRangeRow(label, value, min, max, step, onChange) {
    const row = document.createElement("div");
    row.className = "setting-row";

    const text = document.createElement("div");
    text.className = "setting-label";
    text.textContent = label;

    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = value;
    input.addEventListener("change", () => onChange(Number(input.value)));

    row.appendChild(text);
    row.appendChild(input);
    return row;
  }

  return { load };
})();
