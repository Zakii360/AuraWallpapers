"use strict";

const { contextBridge, ipcRenderer } = require("electron");

const invoke = (channel, payload) => ipcRenderer.invoke(channel, payload);

contextBridge.exposeInMainWorld("aura", {
  wallpapers: {
    list: () => invoke("wallpaper.list"),
    refresh: () => invoke("wallpaper.refresh"),
    apply: (wallpaperId, monitorId) => invoke("wallpaper.apply", { wallpaperId, monitorId }),
    applyToAll: (wallpaperId) => invoke("wallpaper.applyToAll", { wallpaperId }),
    stop: (monitorId) => invoke("wallpaper.stop", { monitorId }),
    reload: (monitorId) => invoke("wallpaper.reload", { monitorId }),
    active: () => invoke("wallpaper.active"),
  },

  effects: {
    definitions: () => invoke("effects.definitions"),
    get: (wallpaperId) => invoke("effects.get", { wallpaperId }),
    set: (monitorId, wallpaperId, effects) => invoke("effects.set", { monitorId, wallpaperId, effects }),
  },

  settings: {
    get: () => invoke("settings.get"),
    update: (partialSettings) => invoke("settings.update", partialSettings),
    toggleFavorite: (wallpaperId) => invoke("settings.toggleFavorite", { wallpaperId }),
  },

  monitors: {
    list: () => invoke("monitors.list"),
  },
});
