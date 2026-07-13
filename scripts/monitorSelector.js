const MonitorSelector = (() => {
  const list = document.getElementById("monitor-list");
// hopefully WorkerW loads so this calls available win32 api's correctly for windows
  async function load() {
    const [monitors, wallpapers, active] = await Promise.all([
      Api.monitors.list(),
      Api.wallpapers.list(),
      Api.wallpapers.active(),
    ]);

    render(monitors, wallpapers, active);
  }

  function render(monitors, wallpapers, active) {
    list.innerHTML = "";

    for (const monitor of monitors) {
      const assignment = active.find((item) => item.monitorId === monitor.id);

      const card = document.createElement("div");
      card.className = "monitor-card";

      const info = document.createElement("div");
      info.className = "monitor-info";
      info.innerHTML = `
        <div class="monitor-name">${monitor.isPrimary ? "Primary Monitor" : "Monitor"} (${monitor.id})</div>
        <div class="monitor-resolution">${monitor.bounds.width} × ${monitor.bounds.height}</div>
      `;

      const select = document.createElement("select");
      const noneOption = document.createElement("option");
      noneOption.value = "";
      noneOption.textContent = "None";
      select.appendChild(noneOption);

      for (const wallpaper of wallpapers) {
        const option = document.createElement("option");
        option.value = wallpaper.id;
        option.textContent = wallpaper.name;
        if (assignment && assignment.wallpaperId === wallpaper.id) {
          option.selected = true;
        }
        select.appendChild(option);
      }

      select.addEventListener("change", async () => {
        if (select.value) {
          await Api.wallpapers.apply(select.value, monitor.id);
        } else {
          await Api.wallpapers.stop(monitor.id);
        }
      });

      card.appendChild(info);
      card.appendChild(select);
      list.appendChild(card);
    }
  }

  return { load };
})();
