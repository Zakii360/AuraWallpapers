const Api = (() => {
  async function unwrap(promise) {
    const result = await promise;
    if (!result.ok) {
      console.error(result.error);
      throw new Error(result.error);
    }
    return result.data;
  }

  return {
    wallpapers: {
      list: () => unwrap(window.aura.wallpapers.list()),
      refresh: () => unwrap(window.aura.wallpapers.refresh()),
      apply: (wallpaperId, monitorId) => unwrap(window.aura.wallpapers.apply(wallpaperId, monitorId)),
      applyToAll: (wallpaperId) => unwrap(window.aura.wallpapers.applyToAll(wallpaperId)),
      stop: (monitorId) => unwrap(window.aura.wallpapers.stop(monitorId)),
      active: () => unwrap(window.aura.wallpapers.active()),
    },
    effects: {
      definitions: () => unwrap(window.aura.effects.definitions()),
      get: (wallpaperId) => unwrap(window.aura.effects.get(wallpaperId)),
      set: (monitorId, wallpaperId, effects) => unwrap(window.aura.effects.set(monitorId, wallpaperId, effects)),
    },
    settings: {
      get: () => unwrap(window.aura.settings.get()),
      update: (partial) => unwrap(window.aura.settings.update(partial)),
      toggleFavorite: (wallpaperId) => unwrap(window.aura.settings.toggleFavorite(wallpaperId)),
    },
    monitors: {
      list: () => unwrap(window.aura.monitors.list()),
    },
  };
})();
