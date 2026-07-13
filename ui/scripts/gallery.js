const Gallery = (() => {
  let wallpapers = [];
  let favorites = [];
  let activeWallpaperId = null;
  let primaryMonitorId = null;

  const grid = document.getElementById("gallery-grid");
  const searchInput = document.getElementById("gallery-search");
  const refreshButton = document.getElementById("gallery-refresh");

  async function load() {
    const [list, settings, active, monitors] = await Promise.all([
      Api.wallpapers.list(),
      Api.settings.get(),
      Api.wallpapers.active(),
      Api.monitors.list(),
    ]);

    wallpapers = list;
    favorites = settings.favorites || [];
    const primary = monitors.find((monitor) => monitor.isPrimary) || monitors[0];
    primaryMonitorId = primary ? primary.id : null;
    activeWallpaperId = active.find((item) => item.monitorId === primaryMonitorId)?.wallpaperId || null;

    render(wallpapers);
  }

  function render(items) {
    grid.innerHTML = "";

    for (const wallpaper of items) {
      const card = document.createElement("div");
      card.className = "wallpaper-card" + (wallpaper.id === activeWallpaperId ? " applied" : "");

      const preview = document.createElement("img");
      preview.className = "wallpaper-preview";
      preview.src = `file://${wallpaper.previewPath}`;
      preview.alt = wallpaper.name;

      const meta = document.createElement("div");
      meta.className = "wallpaper-meta";

      const info = document.createElement("div");
      info.innerHTML = `<div class="wallpaper-name">${wallpaper.name}</div><div class="wallpaper-author">by ${wallpaper.author}</div>`;

      const favoriteButton = document.createElement("button");
      favoriteButton.className = "favorite-toggle" + (favorites.includes(wallpaper.id) ? " active" : "");
      favoriteButton.textContent = favorites.includes(wallpaper.id) ? "★" : "☆";
      favoriteButton.addEventListener("click", async (event) => {
        event.stopPropagation();
        favorites = await Api.settings.toggleFavorite(wallpaper.id);
        render(currentFilter());
      });

      meta.appendChild(info);
      meta.appendChild(favoriteButton);

      card.appendChild(preview);
      card.appendChild(meta);

      card.addEventListener("click", () => applyWallpaper(wallpaper));

      grid.appendChild(card);
    }
  }

  async function applyWallpaper(wallpaper) {
    if (!primaryMonitorId) return;
    await Api.wallpapers.apply(wallpaper.id, primaryMonitorId);
    activeWallpaperId = wallpaper.id;
    render(currentFilter());
    EffectsEditor.selectWallpaper(wallpaper.id, primaryMonitorId);
  }

  function currentFilter() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return wallpapers;
    return wallpapers.filter(
      (wallpaper) => wallpaper.name.toLowerCase().includes(query) || wallpaper.author.toLowerCase().includes(query),
    );
  }

  searchInput.addEventListener("input", () => render(currentFilter()));

  refreshButton.addEventListener("click", async () => {
    wallpapers = await Api.wallpapers.refresh();
    render(currentFilter());
  });

  return { load };
})();
